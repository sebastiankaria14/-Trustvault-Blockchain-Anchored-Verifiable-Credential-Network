import { query } from '../utils/database.js';

/**
 * Get all credentials for logged-in user
 */
export const getUserCredentials = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT
        c.*,
        i.name as issuer_name,
        i.type as issuer_type
      FROM credentials c
      LEFT JOIN institutions i ON c.institution_id = i.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        credentials: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credentials',
      error: error.message
    });
  }
};

/**
 * Get single credential by ID
 */
export const getCredentialById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
      `SELECT
        c.*,
        i.name as issuer_name,
        i.type as issuer_type,
        i.email as issuer_email,
        i.phone as issuer_phone,
        i.website as issuer_website
      FROM credentials c
      LEFT JOIN institutions i ON c.institution_id = i.id
      WHERE c.id = $1 AND c.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { credential: result.rows[0] }
    });
  } catch (error) {
    console.error('Error fetching credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credential',
      error: error.message
    });
  }
};

/**
 * Get verification logs for a credential
 */
export const getCredentialLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // First verify the credential belongs to the user
    const credCheck = await query(
      'SELECT id FROM credentials WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (credCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    const result = await query(
      `SELECT
        vl.*,
        v.company_name as verifier_name,
        v.industry as verifier_industry,
        vl.verified_at as created_at
      FROM verification_logs vl
      LEFT JOIN verifiers v ON vl.verifier_id = v.id
      WHERE vl.credential_id = $1
      ORDER BY vl.verified_at DESC`,
      [id]
    );

    // Map database values to frontend format
    const mappedLogs = result.rows.map(row => ({
      ...row,
      verification_result: row.result === 'success' ? 'authentic' : row.result === 'failure' ? 'fake' : row.result,
      comments: row.result_details?.comments || null,
      action: row.verification_type || 'viewed'
    }));

    res.status(200).json({
      success: true,
      data: {
        logs: mappedLogs,
        total: mappedLogs.length
      }
    });
  } catch (error) {
    console.error('Error fetching verification logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification logs',
      error: error.message
    });
  }
};

/**
 * Get all verification logs for user (audit log)
 */
export const getUserAuditLog = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT
        vl.*,
        vl.verified_at as created_at,
        c.credential_name,
        c.credential_type,
        v.company_name as verifier_name,
        v.industry as verifier_industry
      FROM verification_logs vl
      JOIN credentials c ON vl.credential_id = c.id
      LEFT JOIN verifiers v ON vl.verifier_id = v.id
      WHERE c.user_id = $1
      ORDER BY vl.verified_at DESC
      LIMIT 100`,
      [userId]
    );

    // Map database values to frontend format
    const mappedLogs = result.rows.map(row => ({
      ...row,
      verification_result: row.result === 'success' ? 'authentic' : row.result === 'failure' ? 'fake' : row.result,
      comments: row.result_details?.comments || null,
      action: row.verification_type || 'viewed'
    }));

    res.status(200).json({
      success: true,
      data: {
        logs: mappedLogs || [],
        total: mappedLogs?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    // Return empty logs instead of error if no data
    res.status(200).json({
      success: true,
      data: {
        logs: [],
        total: 0
      }
    });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get credential counts by status
    const credStats = await query(
      `SELECT
        COUNT(CASE WHEN status = 'active' THEN 1 END)::int as active_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending_count,
        COUNT(CASE WHEN status = 'expired' THEN 1 END)::int as expired_count,
        COUNT(CASE WHEN status = 'revoked' THEN 1 END)::int as revoked_count,
        COUNT(*)::int as total_count
      FROM credentials
      WHERE user_id = $1`,
      [userId]
    );

    // Get recent verifications count
    const verificationStats = await query(
      `SELECT COUNT(*)::int as verification_count
      FROM verification_logs vl
      JOIN credentials c ON vl.credential_id = c.id
      WHERE c.user_id = $1`,
      [userId]
    );

    // Get recent credentials
    const recentCredentials = await query(
      `SELECT
        c.id, c.credential_name, c.credential_type, c.status, c.issue_date,
        i.name as issuer_name
      FROM credentials c
      LEFT JOIN institutions i ON c.institution_id = i.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
      LIMIT 5`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        stats: {
          active_count: credStats.rows[0]?.active_count || 0,
          pending_count: credStats.rows[0]?.pending_count || 0,
          expired_count: credStats.rows[0]?.expired_count || 0,
          revoked_count: credStats.rows[0]?.revoked_count || 0,
          total_count: credStats.rows[0]?.total_count || 0,
          recent_verifications: verificationStats.rows[0]?.verification_count || 0
        },
        recentCredentials: recentCredentials.rows || []
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, dateOfBirth } = req.body;

    const result = await query(
      `UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone = COALESCE($3, phone),
          date_of_birth = COALESCE($4, date_of_birth),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, email, first_name, last_name, phone, date_of_birth, kyc_status, created_at, updated_at`,
      [firstName, lastName, phone, dateOfBirth, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, email, first_name, last_name, phone, date_of_birth, kyc_status, created_at, updated_at
      FROM users
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * Get all available verifiers (companies) for sharing credentials
 */
export const getVerifiers = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, company_name, industry, email, phone, website
       FROM verifiers
       WHERE is_active = true
       ORDER BY company_name ASC`,
      []
    );

    res.status(200).json({
      success: true,
      data: {
        verifiers: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching verifiers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verifiers',
      error: error.message
    });
  }
};

/**
 * Share a credential with a verifier/company
 */
export const shareCredential = async (req, res) => {
  try {
    const userId = req.user.id;
    const { credentialId } = req.params;
    const { verifierId } = req.body;

    // Validate input
    if (!credentialId || !verifierId) {
      return res.status(400).json({
        success: false,
        message: 'credentialId and verifierId are required'
      });
    }

    // Check if credential exists and belongs to user
    const credentialCheck = await query(
      `SELECT id FROM credentials WHERE id = $1 AND user_id = $2`,
      [credentialId, userId]
    );

    if (credentialCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found or does not belong to this user'
      });
    }

    // Check if verifier exists
    const verifierCheck = await query(
      `SELECT id FROM verifiers WHERE id = $1`,
      [verifierId]
    );

    if (verifierCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verifier not found'
      });
    }

    // Check if already shared (prevent duplicates)
    const duplicateCheck = await query(
      `SELECT id FROM credential_shares WHERE credential_id = $1 AND verifier_id = $2`,
      [credentialId, verifierId]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This credential has already been shared with this company'
      });
    }

    // Create share entry
    const shareResult = await query(
      `INSERT INTO credential_shares (credential_id, user_id, verifier_id, shared_at, status)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
       RETURNING id, credential_id, user_id, verifier_id, shared_at, status`,
      [credentialId, userId, verifierId, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Credential shared successfully',
      data: shareResult.rows[0]
    });
  } catch (error) {
    console.error('Error sharing credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing credential',
      error: error.message
    });
  }
};

/**
 * Get credentials shared with verifiers
 */
export const getSharedCredentials = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT
        cs.id as share_id,
        cs.credential_id,
        cs.shared_at,
        cs.status,
        cs.verified_at,
        c.credential_name,
        c.credential_type,
        v.company_name,
        v.industry
       FROM credential_shares cs
       JOIN credentials c ON cs.credential_id = c.id
       JOIN verifiers v ON cs.verifier_id = v.id
       WHERE c.user_id = $1
       ORDER BY cs.shared_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        sharedCredentials: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching shared credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shared credentials',
      error: error.message
    });
  }
};

export default {
  getUserCredentials,
  getCredentialById,
  getCredentialLogs,
  getUserAuditLog,
  getDashboardStats,
  updateProfile,
  getProfile,
  getVerifiers,
  shareCredential,
  getSharedCredentials
};
