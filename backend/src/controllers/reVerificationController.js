import { query } from '../utils/database.js';

/**
 * Verifier requests re-verification of an already-verified credential
 */
export const requestReVerification = async (req, res) => {
  try {
    const verifierId = req.user.id;
    const { credentialId } = req.params;
    const { reason } = req.body;

    // Get credential and verify it exists and is already verified
    const credentialResult = await query(
      `SELECT c.id, c.user_id, cs.status, cs.verified_at
       FROM credentials c
       LEFT JOIN credential_shares cs ON c.id = cs.credential_id AND cs.verifier_id = $2
       WHERE c.id = $1`,
      [credentialId, verifierId]
    );

    if (credentialResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    const credential = credentialResult.rows[0];

    // Check if credential_shares record exists
    if (!credential.status) {
      return res.status(400).json({
        success: false,
        message: 'Credential has not been shared with you or not verified yet'
      });
    }

    // Check if already verified
    if (credential.status !== 'verified' && credential.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Can only request re-verification for already-verified credentials'
      });
    }

    // Check if there's already a pending request
    const existingRequest = await query(
      `SELECT id FROM re_verification_requests
       WHERE credential_id = $1 AND verifier_id = $2 AND status = 'pending'`,
      [credentialId, verifierId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A re-verification request is already pending for this credential'
      });
    }

    // Create re-verification request
    const result = await query(
      `INSERT INTO re_verification_requests (credential_id, verifier_id, user_id, status, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [credentialId, verifierId, credential.user_id, 'pending', reason || null]
    );

    res.status(201).json({
      success: true,
      message: 'Re-verification request sent to user',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error requesting re-verification:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting re-verification. Table may not exist - run the schema SQL first.',
      error: error.message
    });
  }
};

/**
 * Get pending re-verification requests for a user
 */
export const getUserReVerificationRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'pending' } = req.query;

    let whereClause = 'rvr.user_id = $1';
    const params = [userId];

    if (status !== 'all') {
      whereClause += ` AND rvr.status = $2`;
      params.push(status);
    }

    const result = await query(
      `SELECT
        rvr.id,
        rvr.credential_id,
        rvr.verifier_id,
        rvr.status,
        rvr.reason,
        rvr.requested_at,
        rvr.expires_at,
        c.credential_name,
        c.credential_type,
        v.company_name,
        v.industry
       FROM re_verification_requests rvr
       JOIN credentials c ON rvr.credential_id = c.id
       JOIN verifiers v ON rvr.verifier_id = v.id
       WHERE ${whereClause}
       ORDER BY rvr.requested_at DESC`,
      params
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching re-verification requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching re-verification requests',
      error: error.message
    });
  }
};

/**
 * User approves re-verification request
 */
export const approveReVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { reason } = req.body;

    // Get the request and verify it belongs to this user
    const requestResult = await query(
      `SELECT * FROM re_verification_requests
       WHERE id = $1 AND user_id = $2`,
      [requestId, userId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Re-verification request not found'
      });
    }

    const revRequest = requestResult.rows[0];

    if (revRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a ${revRequest.status} request`
      });
    }

    // Update request status to approved
    const updateResult = await query(
      `UPDATE re_verification_requests
       SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by_user_id = $1, response_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [userId, reason || null, requestId]
    );

    // Reset credential_shares status to 'pending' so verifier can verify again
    await query(
      `UPDATE credential_shares
       SET status = 'pending', verified_at = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE credential_id = $1 AND verifier_id = $2`,
      [revRequest.credential_id, revRequest.verifier_id]
    );

    res.status(200).json({
      success: true,
      message: 'Re-verification approved. Verifier can now verify again.',
      data: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error approving re-verification:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving re-verification',
      error: error.message
    });
  }
};

/**
 * User declines re-verification request
 */
export const declineReVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { reason } = req.body;

    // Get the request and verify it belongs to this user
    const requestResult = await query(
      `SELECT * FROM re_verification_requests
       WHERE id = $1 AND user_id = $2`,
      [requestId, userId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Re-verification request not found'
      });
    }

    const revRequest = requestResult.rows[0];

    if (revRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot decline a ${revRequest.status} request`
      });
    }

    // Update request status to declined
    const updateResult = await query(
      `UPDATE re_verification_requests
       SET status = 'declined', approved_at = CURRENT_TIMESTAMP, approved_by_user_id = $1, response_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [userId, reason || null, requestId]
    );

    res.status(200).json({
      success: true,
      message: 'Re-verification request declined.',
      data: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error declining re-verification:', error);
    res.status(500).json({
      success: false,
      message: 'Error declining re-verification',
      error: error.message
    });
  }
};

/**
 * Get status of a specific re-verification request
 */
export const getReVerificationStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `SELECT * FROM re_verification_requests
       WHERE id = $1 AND user_id = $2`,
      [requestId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Re-verification request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching re-verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching re-verification status',
      error: error.message
    });
  }
};
