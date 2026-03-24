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

    // Return empty logs - verification_logs table will be implemented in Phase 5 (Verifier Portal)
    res.status(200).json({
      success: true,
      data: {
        logs: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Error fetching verification logs:', error);
    // Return empty logs instead of error
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
 * Get all verification logs for user (audit log)
 */
export const getUserAuditLog = async (req, res) => {
  try {
    const userId = req.user.id;

    // Return empty audit log - verification_logs table will be implemented in Phase 5 (Verifier Portal)
    res.status(200).json({
      success: true,
      data: {
        logs: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    // Return empty logs instead of error
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
          recent_verifications: 0  // No verifications yet - Phase 5 feature
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

export default {
  getUserCredentials,
  getCredentialById,
  getCredentialLogs,
  getUserAuditLog,
  getDashboardStats,
  updateProfile,
  getProfile
};
