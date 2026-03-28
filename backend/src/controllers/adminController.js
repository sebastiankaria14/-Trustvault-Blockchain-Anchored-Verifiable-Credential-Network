import { query } from '../utils/database.js';

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
    const { search = '', status = 'all', page = '1', limit = '20' } = req.query;
    const pagination = parsePagination(page, limit);
    const params = [];
    let whereClause = 'WHERE 1=1';

    if (status === 'active' || status === 'inactive') {
      whereClause += ` AND is_active = $${params.length + 1}`;
      params.push(status === 'active');
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
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const result = await query(
      `UPDATE users
       SET is_active = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, is_active`,
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'blocked'} successfully`,
      data: {
        user: result.rows[0]
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
    const { action = 'approve' } = req.body;

    const actionToStatus = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended'
    };

    const verificationStatus = actionToStatus[action];

    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use approve, reject, or suspend.'
      });
    }

    const result = await query(
      `UPDATE institutions
       SET
         verification_status = $1,
         api_enabled = CASE WHEN $1 = 'approved' THEN true ELSE api_enabled END,
         verified_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE verified_at END,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, email, verification_status, api_enabled, verified_at`,
      [verificationStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Institution ${verificationStatus} successfully`,
      data: {
        institution: result.rows[0]
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
    const { action = 'approve', rateLimit } = req.body;

    const actionToStatus = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended'
    };

    const verificationStatus = actionToStatus[action];

    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use approve, reject, or suspend.'
      });
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

    if (verifierResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verifier not found'
      });
    }

    let updatedRateLimit = null;
    if (Number.isInteger(rateLimit) && rateLimit > 0) {
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

    res.status(200).json({
      success: true,
      message: `Verifier ${verificationStatus} successfully`,
      data: {
        verifier: verifierResult.rows[0],
        ...(updatedRateLimit && { updatedRateLimit })
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

export default {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminInstitutions,
  approveInstitution,
  getAdminVerifiers,
  approveVerifier,
  getAdminBlockchainLogs,
  getAdminSettings,
  upsertAdminSetting
};