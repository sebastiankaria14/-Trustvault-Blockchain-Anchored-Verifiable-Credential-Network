import { query } from '../utils/database.js';
import { getRequiredDocumentTypes } from '../utils/verificationRules.js';

const parsePagination = (page = '1', limit = '20') => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, offset };
};

const buildSearchClause = ({ search, columns, params }) => {
  if (!search || !search.trim()) {
    return '';
  }

  const placeholder = `$${params.length + 1}`;
  params.push(`%${search.trim()}%`);
  const conditions = columns.map((column) => `${column} ILIKE ${placeholder}`).join(' OR ');

  return ` AND (${conditions})`;
};

const ACTIONS_REQUIRING_REASON = new Set(['reject', 'suspend', 'request_more_info', 'block']);
const CHECKLIST_REVIEW_STATUSES = new Set(['pending', 'passed', 'failed']);
const CHECKLIST_ENTITY_TABLES = {
  user: 'users',
  institution: 'institutions',
  verifier: 'verifiers'
};

const ENTITY_STATUS_CONFIG = {
  user: {
    tableName: 'users',
    statusColumn: 'kyc_status',
    emailColumn: 'email'
  },
  institution: {
    tableName: 'institutions',
    statusColumn: 'verification_status',
    emailColumn: 'email'
  },
  verifier: {
    tableName: 'verifiers',
    statusColumn: 'verification_status',
    emailColumn: 'email'
  }
};

const requireReasonIfNeeded = ({ action, reason }) => {
  if (!ACTIONS_REQUIRING_REASON.has(action)) {
    return null;
  }

  if (!reason || !String(reason).trim()) {
    return 'A reason is required for this action.';
  }

  return null;
};

const logApprovalDecision = async ({
  entityType,
  entityId,
  entityEmail,
  previousStatus,
  newStatus,
  action,
  reason,
  adminId
}) => {
  try {
    await query(
      `INSERT INTO admin_approval_logs (
        entity_type,
        entity_id,
        entity_email,
        previous_status,
        new_status,
        action,
        reason,
        admin_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [entityType, entityId, entityEmail || null, previousStatus || null, newStatus || null, action, reason || null, adminId || null]
    );
  } catch (error) {
    console.warn('Failed to write admin approval log:', error.message);
  }
};

const createNotificationEvent = async ({
  recipientType,
  recipientId,
  recipientEmail,
  eventType,
  title,
  message,
  metadata
}) => {
  try {
    await query(
      `INSERT INTO notification_events (
        recipient_type,
        recipient_id,
        recipient_email,
        event_type,
        title,
        message,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [
        recipientType,
        recipientId || null,
        recipientEmail || null,
        eventType,
        title,
        message,
        JSON.stringify(metadata || {})
      ]
    );
  } catch (error) {
    console.warn('Failed to create notification event:', error.message);
  }
};

const isValidChecklistEntityType = (entityType) =>
  Object.prototype.hasOwnProperty.call(CHECKLIST_ENTITY_TABLES, entityType);

const ensureChecklistEntityExists = async (entityType, entityId) => {
  const tableName = CHECKLIST_ENTITY_TABLES[entityType];
  if (!tableName) {
    return null;
  }

  const result = await query(`SELECT id FROM ${tableName} WHERE id = $1`, [entityId]);
  return result.rows[0] || null;
};

const getChecklistRowsForEntity = async (entityType, entityId) => {
  const result = await query(
    `SELECT
      t.entity_type,
      t.checklist_key,
      t.title,
      t.description,
      t.required,
      t.display_order,
      COALESCE(r.status, 'pending') AS status,
      COALESCE(r.notes, '') AS notes,
      r.reviewed_by,
      r.reviewed_at,
      a.full_name AS reviewed_by_name
     FROM approval_checklist_templates t
     LEFT JOIN approval_checklist_reviews r
       ON r.entity_type = t.entity_type
      AND r.entity_id = $2
      AND r.checklist_key = t.checklist_key
     LEFT JOIN admins a ON a.id = r.reviewed_by
     WHERE t.entity_type = $1
       AND t.is_active = true
     ORDER BY t.display_order ASC, t.title ASC`,
    [entityType, entityId]
  );

  return result.rows;
};

const buildChecklistSummary = (rows = []) => {
  const requiredTotal = rows.filter((item) => item.required).length;
  const passedRequired = rows.filter((item) => item.required && item.status === 'passed').length;

  return {
    totalItems: rows.length,
    requiredTotal,
    passedRequired,
    isComplete: requiredTotal > 0 ? passedRequired === requiredTotal : true
  };
};

const getIncompleteRequiredChecklistItems = (rows = []) => (
  rows
    .filter((item) => item.required && item.status !== 'passed')
    .map((item) => item.title)
);

const getLatestVerificationDocuments = async (entityType, entityId) => {
  const result = await query(
    `SELECT DISTINCT ON (document_type)
      id,
      entity_type,
      entity_id,
      document_type,
      original_file_name,
      stored_file_name,
      file_path,
      mime_type,
      file_size,
      status,
      rejection_reason,
      uploaded_by,
      reviewed_by,
      reviewed_at,
      created_at,
      updated_at
     FROM verification_documents
     WHERE entity_type = $1
       AND entity_id = $2
     ORDER BY document_type, updated_at DESC`,
    [entityType, entityId]
  );

  return result.rows;
};

const buildDocumentSummary = (entityType, documents) => {
  const requiredTypes = getRequiredDocumentTypes(entityType);
  const byType = documents.reduce((acc, doc) => {
    acc[doc.document_type] = doc;
    return acc;
  }, {});

  const missingRequired = requiredTypes.filter((type) => !byType[type]);
  const pendingRequired = requiredTypes.filter((type) => byType[type] && byType[type].status === 'pending');
  const rejectedRequired = requiredTypes.filter((type) => byType[type] && byType[type].status === 'rejected');
  const approvedRequired = requiredTypes.filter((type) => byType[type] && byType[type].status === 'approved');

  return {
    requiredTypes,
    missingRequired,
    pendingRequired,
    rejectedRequired,
    approvedRequired,
    isComplete: requiredTypes.length > 0 && approvedRequired.length === requiredTypes.length
  };
};

const getIncompleteRequiredDocumentItems = (entityType, documents) => {
  const summary = buildDocumentSummary(entityType, documents);
  return [
    ...summary.missingRequired.map((item) => `${item} (missing)`),
    ...summary.pendingRequired.map((item) => `${item} (pending review)`),
    ...summary.rejectedRequired.map((item) => `${item} (rejected)`)
  ];
};

const fetchEntityForReview = async (entityType, entityId) => {
  const config = ENTITY_STATUS_CONFIG[entityType];
  if (!config) {
    return null;
  }

  const result = await query(
    `SELECT *
     FROM ${config.tableName}
     WHERE id = $1`,
    [entityId]
  );

  return result.rows[0] || null;
};

/**
 * GET /api/admin/stats
 * Returns high-level platform metrics for the super admin dashboard.
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      usersCount,
      institutionsCount,
      verifiersCount,
      credentialsCount,
      pendingUsers,
      pendingInstitutions,
      pendingVerifiers,
      todayVerifications,
      blockchainCoverage,
      recentActivity
    ] = await Promise.all([
      query('SELECT COUNT(*)::int AS total FROM users'),
      query('SELECT COUNT(*)::int AS total FROM institutions'),
      query('SELECT COUNT(*)::int AS total FROM verifiers'),
      query('SELECT COUNT(*)::int AS total FROM credentials'),
      query(`SELECT COUNT(*)::int AS total FROM users WHERE kyc_status = 'pending'`),
      query(`SELECT COUNT(*)::int AS total FROM institutions WHERE verification_status = 'pending'`),
      query(`SELECT COUNT(*)::int AS total FROM verifiers WHERE verification_status = 'pending'`),
      query(`SELECT COUNT(*)::int AS total FROM verification_logs WHERE DATE(verified_at) = CURRENT_DATE`),
      query(
        `SELECT
          COUNT(*)::int AS total_credentials,
          COUNT(CASE WHEN blockchain_hash IS NOT NULL THEN 1 END)::int AS anchored_credentials,
          COUNT(CASE WHEN blockchain_tx_hash IS NOT NULL THEN 1 END)::int AS tx_recorded
         FROM credentials`
      ),
      query(
        `SELECT
          id,
          verification_type,
          result,
          verified_at
         FROM verification_logs
         ORDER BY verified_at DESC
         LIMIT 10`
      )
    ]);

    const blockchainSummary = blockchainCoverage.rows[0] || {
      total_credentials: 0,
      anchored_credentials: 0,
      tx_recorded: 0
    };

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: usersCount.rows[0]?.total || 0,
          totalInstitutions: institutionsCount.rows[0]?.total || 0,
          totalVerifiers: verifiersCount.rows[0]?.total || 0,
          totalCredentials: credentialsCount.rows[0]?.total || 0,
          todayVerifications: todayVerifications.rows[0]?.total || 0
        },
        approvals: {
          pendingUsers: pendingUsers.rows[0]?.total || 0,
          pendingInstitutions: pendingInstitutions.rows[0]?.total || 0,
          pendingVerifiers: pendingVerifiers.rows[0]?.total || 0
        },
        blockchain: {
          ...blockchainSummary,
          strictMode: process.env.BLOCKCHAIN_STRICT_MODE === 'true',
          networkConfigured: Boolean(process.env.BLOCKCHAIN_RPC_URL && process.env.CONTRACT_ADDRESS)
        },
        recentActivity: recentActivity.rows || []
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/users
 */
export const getAdminUsers = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      accountStatus = 'all',
      kycStatus = 'all',
      page = '1',
      limit = '20'
    } = req.query;
    const pagination = parsePagination(page, limit);
    const params = [];
    let whereClause = 'WHERE 1=1';

    const resolvedAccountStatus =
      accountStatus !== 'all'
        ? accountStatus
        : (status === 'active' || status === 'inactive' ? status : 'all');

    const resolvedKycStatus =
      kycStatus !== 'all'
        ? kycStatus
        : (['pending', 'approved', 'rejected'].includes(status) ? status : 'all');

    if (resolvedAccountStatus === 'active' || resolvedAccountStatus === 'inactive') {
      whereClause += ` AND is_active = $${params.length + 1}`;
      params.push(resolvedAccountStatus === 'active');
    }

    if (resolvedKycStatus !== 'all') {
      whereClause += ` AND kyc_status = $${params.length + 1}`;
      params.push(resolvedKycStatus);
    }

    whereClause += buildSearchClause({
      search,
      columns: ['first_name', 'last_name', 'email'],
      params
    });

    const usersResult = await query(
      `SELECT
        id,
        email,
        first_name,
        last_name,
        phone,
        kyc_status,
        is_active,
        created_at,
        last_login
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM users
       ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: {
        users: usersResult.rows,
        total: countResult.rows[0]?.total || 0,
        page: pagination.page,
        limit: pagination.limit
      }
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * PATCH /api/admin/users/:id/status
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reason = '' } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const action = isActive ? 'unblock' : 'block';
    const reasonValidationError = requireReasonIfNeeded({ action, reason });
    if (reasonValidationError) {
      return res.status(400).json({
        success: false,
        message: reasonValidationError
      });
    }

    const existingUserResult = await query(
      `SELECT id, email, is_active
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousAccountState = existingUserResult.rows[0].is_active ? 'active' : 'inactive';

    const result = await query(
      `UPDATE users
       SET is_active = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, is_active`,
      [isActive, id]
    );

    const updatedUser = result.rows[0];

    await logApprovalDecision({
      entityType: 'user',
      entityId: id,
      entityEmail: updatedUser.email,
      previousStatus: previousAccountState,
      newStatus: updatedUser.is_active ? 'active' : 'inactive',
      action,
      reason,
      adminId: req.user.id
    });

    await createNotificationEvent({
      recipientType: 'user',
      recipientId: id,
      recipientEmail: updatedUser.email,
      eventType: 'account_status_change',
      title: `Account ${updatedUser.is_active ? 'Unblocked' : 'Blocked'}`,
      message: updatedUser.is_active
        ? 'Your account has been unblocked by Super Admin.'
        : 'Your account has been blocked by Super Admin.',
      metadata: {
        action,
        reason: reason || null,
        changedBy: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'blocked'} successfully`,
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/institutions
 */
export const getAdminInstitutions = async (req, res) => {
  try {
    const { search = '', status = 'all', page = '1', limit = '20' } = req.query;
    const pagination = parsePagination(page, limit);
    const params = [];
    let whereClause = 'WHERE 1=1';

    if (status !== 'all') {
      whereClause += ` AND verification_status = $${params.length + 1}`;
      params.push(status);
    }

    whereClause += buildSearchClause({
      search,
      columns: ['name', 'email', 'registration_number'],
      params
    });

    const result = await query(
      `SELECT
        id,
        name,
        type,
        email,
        registration_number,
        verification_status,
        api_enabled,
        is_active,
        created_at,
        verified_at
       FROM institutions
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM institutions
       ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: {
        institutions: result.rows,
        total: countResult.rows[0]?.total || 0,
        page: pagination.page,
        limit: pagination.limit
      }
    });
  } catch (error) {
    console.error('Error fetching institutions for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching institutions',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/institution/:id/approve
 */
export const approveInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'approve', reason = '' } = req.body;

    const actionToStatus = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended',
      request_more_info: 'pending'
    };

    const verificationStatus = actionToStatus[action];

    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use approve, reject, suspend, or request_more_info.'
      });
    }

    const reasonValidationError = requireReasonIfNeeded({ action, reason });
    if (reasonValidationError) {
      return res.status(400).json({
        success: false,
        message: reasonValidationError
      });
    }

    const existingInstitutionResult = await query(
      `SELECT id, email, verification_status
       FROM institutions
       WHERE id = $1`,
      [id]
    );

    if (existingInstitutionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    const previousStatus = existingInstitutionResult.rows[0].verification_status;

    if (action === 'approve') {
      const checklistRows = await getChecklistRowsForEntity('institution', id);
      const missingChecklistItems = getIncompleteRequiredChecklistItems(checklistRows);
      const documents = await getLatestVerificationDocuments('institution', id);
      const missingDocumentItems = getIncompleteRequiredDocumentItems('institution', documents);

      if (missingChecklistItems.length > 0 || missingDocumentItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Review is incomplete. Complete required checklist and document approvals before approval.',
          code: 'CHECKLIST_INCOMPLETE',
          data: {
            missingChecklistItems,
            missingDocumentItems
          }
        });
      }
    }

    const result = await query(
      `UPDATE institutions
       SET
         verification_status = $1,
         api_enabled = CASE WHEN $1 = 'approved' THEN true ELSE false END,
         verified_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE verified_at END,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, email, verification_status, api_enabled, verified_at`,
      [verificationStatus, id]
    );

    const updatedInstitution = result.rows[0];

    await logApprovalDecision({
      entityType: 'institution',
      entityId: id,
      entityEmail: updatedInstitution.email,
      previousStatus,
      newStatus: updatedInstitution.verification_status,
      action,
      reason,
      adminId: req.user.id
    });

    await createNotificationEvent({
      recipientType: 'institution',
      recipientId: id,
      recipientEmail: updatedInstitution.email,
      eventType: action === 'request_more_info' ? 'info_request' : 'approval_decision',
      title: action === 'request_more_info' ? 'More Information Required' : 'Institution Approval Update',
      message:
        action === 'request_more_info'
          ? 'Super Admin requested more information for your institution approval.'
          : `Your institution account is now ${updatedInstitution.verification_status}.`,
      metadata: {
        action,
        reason: reason || null,
        changedBy: req.user.id,
        previousStatus,
        newStatus: updatedInstitution.verification_status
      }
    });

    const actionLabel = action === 'request_more_info' ? 'marked as pending (more info requested)' : updatedInstitution.verification_status;

    res.status(200).json({
      success: true,
      message: `Institution ${actionLabel} successfully`,
      data: {
        institution: updatedInstitution
      }
    });
  } catch (error) {
    console.error('Error approving institution:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating institution approval',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/verifiers
 */
export const getAdminVerifiers = async (req, res) => {
  try {
    const { search = '', status = 'all', page = '1', limit = '20' } = req.query;
    const pagination = parsePagination(page, limit);
    const params = [];
    let whereClause = 'WHERE 1=1';

    if (status !== 'all') {
      whereClause += ` AND verification_status = $${params.length + 1}`;
      params.push(status);
    }

    whereClause += buildSearchClause({
      search,
      columns: ['company_name', 'email'],
      params
    });

    const result = await query(
      `SELECT
        id,
        company_name,
        email,
        industry,
        verification_status,
        is_active,
        created_at,
        verified_at
       FROM verifiers
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM verifiers
       ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: {
        verifiers: result.rows,
        total: countResult.rows[0]?.total || 0,
        page: pagination.page,
        limit: pagination.limit
      }
    });
  } catch (error) {
    console.error('Error fetching verifiers for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verifiers',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/verifier/:id/approve
 */
export const approveVerifier = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'approve', rateLimit, reason = '' } = req.body;

    const actionToStatus = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended',
      request_more_info: 'pending'
    };

    const verificationStatus = actionToStatus[action];
    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use approve, reject, suspend, or request_more_info.'
      });
    }

    if (rateLimit !== undefined && (!Number.isInteger(rateLimit) || rateLimit < 1)) {
      return res.status(400).json({
        success: false,
        message: 'rateLimit must be a positive integer when provided.'
      });
    }

    const reasonValidationError = requireReasonIfNeeded({ action, reason });
    if (reasonValidationError) {
      return res.status(400).json({
        success: false,
        message: reasonValidationError
      });
    }

    const existingVerifierResult = await query(
      `SELECT id, email, verification_status
       FROM verifiers
       WHERE id = $1`,
      [id]
    );

    if (existingVerifierResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verifier not found'
      });
    }

    const previousStatus = existingVerifierResult.rows[0].verification_status;

    if (action === 'approve') {
      const checklistRows = await getChecklistRowsForEntity('verifier', id);
      const missingChecklistItems = getIncompleteRequiredChecklistItems(checklistRows);
      const documents = await getLatestVerificationDocuments('verifier', id);
      const missingDocumentItems = getIncompleteRequiredDocumentItems('verifier', documents);

      if (missingChecklistItems.length > 0 || missingDocumentItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Review is incomplete. Complete required checklist and document approvals before approval.',
          code: 'CHECKLIST_INCOMPLETE',
          data: {
            missingChecklistItems,
            missingDocumentItems
          }
        });
      }
    }

    const verifierResult = await query(
      `UPDATE verifiers
       SET
         verification_status = $1,
         verified_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE verified_at END,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, company_name, email, verification_status, verified_at`,
      [verificationStatus, id]
    );

    const updatedVerifier = verifierResult.rows[0];

    let updatedRateLimit = null;
    if (Number.isInteger(rateLimit)) {
      const rateLimitResult = await query(
        `UPDATE verifier_api_keys
         SET rate_limit = $1
         WHERE verifier_id = $2
         RETURNING rate_limit`,
        [rateLimit, id]
      );

      if (rateLimitResult.rows.length > 0) {
        updatedRateLimit = rateLimitResult.rows[0].rate_limit;
      }
    }

    await logApprovalDecision({
      entityType: 'verifier',
      entityId: id,
      entityEmail: updatedVerifier.email,
      previousStatus,
      newStatus: updatedVerifier.verification_status,
      action,
      reason,
      adminId: req.user.id
    });

    await createNotificationEvent({
      recipientType: 'verifier',
      recipientId: id,
      recipientEmail: updatedVerifier.email,
      eventType: action === 'request_more_info' ? 'info_request' : 'approval_decision',
      title: action === 'request_more_info' ? 'More Information Required' : 'Verifier Approval Update',
      message:
        action === 'request_more_info'
          ? 'Super Admin requested more information for your verifier approval.'
          : `Your verifier account is now ${updatedVerifier.verification_status}.`,
      metadata: {
        action,
        reason: reason || null,
        changedBy: req.user.id,
        previousStatus,
        newStatus: updatedVerifier.verification_status,
        ...(updatedRateLimit !== null ? { rateLimit: updatedRateLimit } : {})
      }
    });

    const actionLabel =
      action === 'request_more_info'
        ? 'marked as pending (more info requested)'
        : updatedVerifier.verification_status;

    res.status(200).json({
      success: true,
      message: `Verifier ${actionLabel} successfully`,
      data: {
        verifier: updatedVerifier,
        ...(updatedRateLimit !== null ? { updatedRateLimit } : {})
      }
    });
  } catch (error) {
    console.error('Error approving verifier:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating verifier approval',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/approval-logs
 */
export const getAdminApprovalLogs = async (req, res) => {
  try {
    const {
      entityType = 'all',
      action = 'all',
      search = '',
      page = '1',
      limit = '20'
    } = req.query;

    const pagination = parsePagination(page, limit);
    const params = [];
    let whereClause = 'WHERE 1=1';

    if (entityType !== 'all') {
      whereClause += ` AND l.entity_type = $${params.length + 1}`;
      params.push(entityType);
    }

    if (action !== 'all') {
      whereClause += ` AND l.action = $${params.length + 1}`;
      params.push(action);
    }

    if (search && search.trim()) {
      const placeholder = `$${params.length + 1}`;
      params.push(`%${search.trim()}%`);
      whereClause += ` AND (l.entity_email ILIKE ${placeholder} OR COALESCE(l.reason, '') ILIKE ${placeholder})`;
    }

    const logsResult = await query(
      `SELECT
        l.id,
        l.entity_type,
        l.entity_id,
        l.entity_email,
        l.previous_status,
        l.new_status,
        l.action,
        l.reason,
        l.admin_id,
        l.created_at,
        a.full_name AS admin_name
       FROM admin_approval_logs l
       LEFT JOIN admins a ON a.id = l.admin_id
       ${whereClause}
       ORDER BY l.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pagination.limit, pagination.offset]
    );

    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM admin_approval_logs l
       ${whereClause}`,
      params
    );

    res.status(200).json({
      success: true,
      data: {
        logs: logsResult.rows,
        total: countResult.rows[0]?.total || 0,
        page: pagination.page,
        limit: pagination.limit
      }
    });
  } catch (error) {
    console.error('Error fetching admin approval logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin approval logs',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/checklist/:entityType/:entityId
 */
export const getAdminApprovalChecklist = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    if (!isValidChecklistEntityType(entityType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Use user, institution, or verifier.'
      });
    }

    const entity = await ensureChecklistEntityExists(entityType, entityId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found for checklist review.'
      });
    }

    const items = await getChecklistRowsForEntity(entityType, entityId);
    const summary = buildChecklistSummary(items);

    res.status(200).json({
      success: true,
      data: {
        entityType,
        entityId,
        items,
        summary
      }
    });
  } catch (error) {
    console.error('Error fetching approval checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching approval checklist',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/checklist/:entityType/:entityId/:checklistKey
 */
export const updateAdminApprovalChecklistItem = async (req, res) => {
  try {
    const { entityType, entityId, checklistKey } = req.params;
    const { status = 'pending', notes = '' } = req.body;

    if (!isValidChecklistEntityType(entityType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Use user, institution, or verifier.'
      });
    }

    if (!CHECKLIST_REVIEW_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid checklist status. Use pending, passed, or failed.'
      });
    }

    const entity = await ensureChecklistEntityExists(entityType, entityId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found for checklist review.'
      });
    }

    const templateResult = await query(
      `SELECT checklist_key
       FROM approval_checklist_templates
       WHERE entity_type = $1
         AND checklist_key = $2
         AND is_active = true`,
      [entityType, checklistKey]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found for this entity type.'
      });
    }

    const upsertResult = await query(
      `INSERT INTO approval_checklist_reviews (
        entity_type,
        entity_id,
        checklist_key,
        status,
        notes,
        reviewed_by,
        reviewed_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (entity_type, entity_id, checklist_key)
      DO UPDATE SET
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        reviewed_by = EXCLUDED.reviewed_by,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING
        id,
        entity_type,
        entity_id,
        checklist_key,
        status,
        notes,
        reviewed_by,
        reviewed_at,
        updated_at`,
      [entityType, entityId, checklistKey, status, notes || '', req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Checklist item updated successfully',
      data: {
        item: upsertResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Error updating approval checklist item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating approval checklist item',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/review/:entityType/:entityId
 */
export const getAdminKycReviewCase = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    if (!isValidChecklistEntityType(entityType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Use user, institution, or verifier.'
      });
    }

    const account = await fetchEntityForReview(entityType, entityId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Review case not found.'
      });
    }

    const documents = await getLatestVerificationDocuments(entityType, entityId);
    const documentSummary = buildDocumentSummary(entityType, documents);
    const checklistItems = await getChecklistRowsForEntity(entityType, entityId);
    const checklistSummary = buildChecklistSummary(checklistItems);
    const recentDecisions = await query(
      `SELECT
        id,
        action,
        previous_status,
        new_status,
        reason,
        admin_id,
        created_at
       FROM admin_approval_logs
       WHERE entity_type = $1
         AND entity_id = $2
       ORDER BY created_at DESC
       LIMIT 15`,
      [entityType, entityId]
    );

    const config = ENTITY_STATUS_CONFIG[entityType];

    res.status(200).json({
      success: true,
      data: {
        entityType,
        entityId,
        account,
        accountStatus: account[config.statusColumn],
        documents,
        documentSummary,
        checklist: {
          items: checklistItems,
          summary: checklistSummary
        },
        recentDecisions: recentDecisions.rows
      }
    });
  } catch (error) {
    console.error('Error fetching admin review case:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review case',
      error: error.message
    });
  }
};

/**
 * PATCH /api/admin/review/:entityType/:entityId/documents/:documentId
 */
export const updateAdminReviewDocumentStatus = async (req, res) => {
  try {
    const { entityType, entityId, documentId } = req.params;
    const { status, rejectionReason = '' } = req.body;

    if (!isValidChecklistEntityType(entityType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Use user, institution, or verifier.'
      });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use pending, approved, or rejected.'
      });
    }

    if (status === 'rejected' && !String(rejectionReason || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'rejectionReason is required when rejecting a document.'
      });
    }

    const entity = await ensureChecklistEntityExists(entityType, entityId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Review case not found.'
      });
    }

    const currentDocResult = await query(
      `SELECT id, document_type, status, entity_id, entity_type
       FROM verification_documents
       WHERE id = $1
         AND entity_type = $2
         AND entity_id = $3`,
      [documentId, entityType, entityId]
    );

    if (currentDocResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found for this review case.'
      });
    }

    const updatedResult = await query(
      `UPDATE verification_documents
       SET
         status = $1,
         rejection_reason = CASE WHEN $1 = 'rejected' THEN $2 ELSE NULL END,
         reviewed_by = $3,
         reviewed_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING
         id,
         entity_type,
         entity_id,
         document_type,
         original_file_name,
         file_path,
         status,
         rejection_reason,
         reviewed_by,
         reviewed_at,
         updated_at`,
      [status, rejectionReason || null, req.user.id, documentId]
    );

    const updatedDocument = updatedResult.rows[0];

    const entityAccount = await fetchEntityForReview(entityType, entityId);
    const recipientEmail = entityAccount?.email || null;
    await createNotificationEvent({
      recipientType: entityType,
      recipientId: entityId,
      recipientEmail,
      eventType: 'document_review',
      title: 'Verification Document Review Update',
      message:
        status === 'rejected'
          ? `Your document ${updatedDocument.document_type} was rejected. Please check review comments.`
          : `Your document ${updatedDocument.document_type} is now ${status}.`,
      metadata: {
        documentId,
        documentType: updatedDocument.document_type,
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
        reviewedBy: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Document review status updated successfully.',
      data: {
        document: updatedDocument
      }
    });
  } catch (error) {
    console.error('Error updating review document status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document review status',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/blockchain
 */
export const getAdminBlockchainLogs = async (req, res) => {
  try {
    const [credentialSummary, verificationSummary, recentCredentials] = await Promise.all([
      query(
        `SELECT
          COUNT(*)::int AS total_credentials,
          COUNT(CASE WHEN blockchain_hash IS NOT NULL THEN 1 END)::int AS anchored_credentials,
          COUNT(CASE WHEN blockchain_tx_hash IS NOT NULL THEN 1 END)::int AS with_transactions
         FROM credentials`
      ),
      query(
        `SELECT
          COUNT(*)::int AS total_logs,
          COUNT(CASE WHEN blockchain_hash_matched = true THEN 1 END)::int AS matched_logs,
          COUNT(CASE WHEN blockchain_hash_matched = false THEN 1 END)::int AS mismatched_logs
         FROM verification_logs
         WHERE blockchain_verified = true`
      ),
      query(
        `SELECT
          id,
          credential_name,
          did,
          blockchain_hash,
          blockchain_tx_hash,
          blockchain_network,
          created_at
         FROM credentials
         WHERE blockchain_hash IS NOT NULL
         ORDER BY created_at DESC
         LIMIT 20`
      )
    ]);

    res.status(200).json({
      success: true,
      data: {
        network: {
          name: process.env.BLOCKCHAIN_NETWORK || 'polygon-mumbai',
          strictMode: process.env.BLOCKCHAIN_STRICT_MODE === 'true',
          configured: Boolean(process.env.BLOCKCHAIN_RPC_URL && process.env.CONTRACT_ADDRESS)
        },
        credentialSummary: credentialSummary.rows[0],
        verificationSummary: verificationSummary.rows[0],
        recentCredentials: recentCredentials.rows
      }
    });
  } catch (error) {
    console.error('Error fetching blockchain logs for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blockchain logs',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/settings
 */
export const getAdminSettings = async (req, res) => {
  try {
    const result = await query(
      `SELECT
        key,
        value_json,
        description,
        updated_at
       FROM system_settings
       ORDER BY key ASC`
    );

    res.status(200).json({
      success: true,
      data: {
        settings: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/settings/:key
 */
export const upsertAdminSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description = null } = req.body;

    if (typeof value === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'value is required'
      });
    }

    const settingValue = typeof value === 'object' ? value : { value };

    const result = await query(
      `INSERT INTO system_settings (key, value_json, description, updated_by)
       VALUES ($1, $2::jsonb, $3, $4)
       ON CONFLICT (key)
       DO UPDATE SET
         value_json = EXCLUDED.value_json,
         description = EXCLUDED.description,
         updated_by = EXCLUDED.updated_by,
         updated_at = CURRENT_TIMESTAMP
       RETURNING key, value_json, description, updated_at`,
      [key, JSON.stringify(settingValue), description, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      data: {
        setting: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Error updating admin setting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/user/:id/approve
 */
export const approveUserKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'approve', reason = '' } = req.body;

    const actionToStatus = {
      approve: 'approved',
      reject: 'rejected',
      reset: 'pending',
      request_more_info: 'pending'
    };

    const kycStatus = actionToStatus[action];

    if (!kycStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use approve, reject, reset, or request_more_info.'
      });
    }

    const reasonValidationError = requireReasonIfNeeded({ action, reason });
    if (reasonValidationError) {
      return res.status(400).json({
        success: false,
        message: reasonValidationError
      });
    }

    const existingUserResult = await query(
      `SELECT id, email, kyc_status
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousStatus = existingUserResult.rows[0].kyc_status;

    if (action === 'approve') {
      const checklistRows = await getChecklistRowsForEntity('user', id);
      const missingChecklistItems = getIncompleteRequiredChecklistItems(checklistRows);
      const documents = await getLatestVerificationDocuments('user', id);
      const missingDocumentItems = getIncompleteRequiredDocumentItems('user', documents);

      if (missingChecklistItems.length > 0 || missingDocumentItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Review is incomplete. Complete required checklist and document approvals before approval.',
          code: 'CHECKLIST_INCOMPLETE',
          data: {
            missingChecklistItems,
            missingDocumentItems
          }
        });
      }
    }

    const result = await query(
      `UPDATE users
       SET kyc_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, kyc_status, is_active`,
      [kycStatus, id]
    );

    const updatedUser = result.rows[0];

    await logApprovalDecision({
      entityType: 'user',
      entityId: id,
      entityEmail: updatedUser.email,
      previousStatus,
      newStatus: updatedUser.kyc_status,
      action,
      reason,
      adminId: req.user.id
    });

    await createNotificationEvent({
      recipientType: 'user',
      recipientId: id,
      recipientEmail: updatedUser.email,
      eventType: action === 'request_more_info' ? 'info_request' : 'approval_decision',
      title: action === 'request_more_info' ? 'More Information Required' : 'KYC Status Update',
      message:
        action === 'request_more_info'
          ? 'Super Admin requested more information for your KYC verification.'
          : `Your KYC status is now ${updatedUser.kyc_status}.`,
      metadata: {
        action,
        reason: reason || null,
        changedBy: req.user.id,
        previousStatus,
        newStatus: updatedUser.kyc_status
      }
    });

    const actionLabel =
      action === 'request_more_info'
        ? 'marked as pending (more info requested)'
        : updatedUser.kyc_status;

    res.status(200).json({
      success: true,
      message: `User KYC ${actionLabel} successfully`,
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating user KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user KYC status',
      error: error.message
    });
  }
};

export default {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  approveUserKyc,
  getAdminInstitutions,
  approveInstitution,
  getAdminVerifiers,
  approveVerifier,
  getAdminApprovalLogs,
  getAdminApprovalChecklist,
  updateAdminApprovalChecklistItem,
  getAdminKycReviewCase,
  updateAdminReviewDocumentStatus,
  getAdminBlockchainLogs,
  getAdminSettings,
  upsertAdminSetting
};