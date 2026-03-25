import { query } from '../utils/database.js';
import crypto from 'crypto';
import { calculateCredentialHash } from '../utils/hash.js';

/**
 * Get institution dashboard stats
 */
export const getInstitutionStats = async (req, res) => {
  try {
    const institutionId = req.user.id;

    const statsQuery = await query(
      `SELECT
        COUNT(*) as total_issued,
        COUNT(DISTINCT user_id) as total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days,
        COUNT(CASE WHEN expiry_date <= NOW() + INTERVAL '30 days' AND expiry_date > NOW() THEN 1 END) as expiring_soon
      FROM credentials
      WHERE institution_id = $1`,
      [institutionId]
    );

    const recentQuery = await query(
      `SELECT c.*, u.email as user_email
      FROM credentials c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.institution_id = $1
      ORDER BY c.created_at DESC
      LIMIT 5`,
      [institutionId]
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalIssued: parseInt(statsQuery.rows[0]?.total_issued || 0),
          totalUsers: parseInt(statsQuery.rows[0]?.total_users || 0),
          last30Days: parseInt(statsQuery.rows[0]?.last_30_days || 0),
          expiringSoon: parseInt(statsQuery.rows[0]?.expiring_soon || 0)
        },
        recentCredentials: recentQuery.rows
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
};

export const issueCredential = async (req, res) => {
  try {
    const institutionId = req.user.id;
    const { recipientEmail, credentialType, credentialName, description, issueDate, expiryDate, documentUrl } = req.body;

    // Find user by email
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [recipientEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    const userId = userResult.rows[0].id;

    // Check for duplicate
    const duplicateCheck = await query(
      'SELECT id FROM credentials WHERE user_id = $1 AND credential_name = $2 AND institution_id = $3',
      [userId, credentialName, institutionId]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This credential has already been issued to this user'
      });
    }

    // Generate unique credential number
    const credentialNumber = `CRED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create credential data JSON object
    const credentialData = {
      credentialType,
      credentialName,
      description: description || '',
      issueDate,
      expiryDate: expiryDate || null,
      issuedBy: institutionId
    };

    // IMPORTANT: Calculate SHA-256 hash of credential data for blockchain verification
    // Use deterministic hashing to ensure same data always produces same hash
    const blockchainHash = calculateCredentialHash(credentialData);

    // Insert credential using correct column names
    const result = await query(
      `INSERT INTO credentials
        (user_id, institution_id, credential_type, credential_name, description, credential_data, issue_date, expiry_date, status, blockchain_hash, document_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        institutionId,
        credentialType,
        credentialName,
        description || '',
        JSON.stringify(credentialData),
        issueDate,
        expiryDate || null,
        'active',
        blockchainHash,  // Actual SHA-256 hash of credential data
        documentUrl || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Credential issued successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error issuing credential',
      error: error.message
    });
  }
};

/**
 * Get all credentials issued by institution
 */
export const getInstitutionCredentials = async (req, res) => {
  try {
    const institutionId = req.user.id;

    const result = await query(
      `SELECT c.*, u.email as user_email
      FROM credentials c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.institution_id = $1
      ORDER BY c.created_at DESC`,
      [institutionId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credentials'
    });
  }
};

/**
 * Revoke a credential
 */
export const revokeCredential = async (req, res) => {
  try {
    const institutionId = req.user.id;
    const { id } = req.params;

    // Check if credential belongs to this institution
    const checkResult = await query(
      'SELECT id FROM credentials WHERE id = $1 AND institution_id = $2',
      [id, institutionId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Update status to revoked
    await query(
      `UPDATE credentials
      SET status = 'revoked', revoked_at = NOW(), revoke_reason = $1
      WHERE id = $2`,
      ['Revoked by institution', id]
    );

    res.json({
      success: true,
      message: 'Credential revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking credential'
    });
  }
};

/**
 * Get issuance history
 */
export const getInstitutionHistory = async (req, res) => {
  try {
    const institutionId = req.user.id;

    const result = await query(
      `SELECT c.credential_name, c.status, c.created_at, u.email as user_email
      FROM credentials c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.institution_id = $1
      ORDER BY c.created_at DESC
      LIMIT 50`,
      [institutionId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history'
    });
  }
};
