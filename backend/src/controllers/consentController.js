import { query } from '../utils/database.js';

/**
 * Grant granular consent for a specific credential
 * User grants a verifier access to a specific credential
 */
export const grantConsentGranular = async (req, res) => {
  try {
    const userId = req.user.id;
    const { verifierId, credentialId } = req.body;

    if (!verifierId || !credentialId) {
      return res.status(400).json({
        success: false,
        message: 'verifierId and credentialId are required'
      });
    }

    // Verify credential belongs to user
    const credentialCheck = await query(
      'SELECT id FROM credentials WHERE id = $1 AND user_id = $2',
      [credentialId, userId]
    );

    if (credentialCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found or does not belong to this user'
      });
    }

    // Check if consent already exists
    const existingConsent = await query(
      `SELECT id, status FROM consent_records
       WHERE user_id = $1 AND verifier_id = $2 AND credential_id = $3`,
      [userId, verifierId, credentialId]
    );

    let result;
    if (existingConsent.rows.length > 0) {
      // Update existing consent
      result = await query(
        `UPDATE consent_records
         SET status = 'granted', granted_at = CURRENT_TIMESTAMP, revoked_at = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND verifier_id = $2 AND credential_id = $3
         RETURNING *`,
        [userId, verifierId, credentialId]
      );
    } else {
      // Create new consent
      result = await query(
        `INSERT INTO consent_records (user_id, verifier_id, credential_id, status, granted_at)
         VALUES ($1, $2, $3, 'granted', CURRENT_TIMESTAMP)
         RETURNING *`,
        [userId, verifierId, credentialId]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Granular consent granted successfully',
      data: {
        consent: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Error granting granular consent:', error);
    res.status(500).json({
      success: false,
      message: 'Error granting consent',
      error: error.message
    });
  }
};

/**
 * Revoke granular consent for a specific credential
 */
export const revokeConsentGranular = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if consent belongs to user
    const consentCheck = await query(
      'SELECT user_id FROM consent_records WHERE id = $1',
      [id]
    );

    if (consentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Consent record not found'
      });
    }

    if (consentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to revoke this consent'
      });
    }

    // Update consent to revoked
    const result = await query(
      `UPDATE consent_records
       SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Granular consent revoked successfully',
      data: {
        consent: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Error revoking granular consent:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking consent',
      error: error.message
    });
  }
};

/**
 * Grant tier-based consent for a credential type
 * User grants a verifier access to all credentials of a specific type
 */
export const grantConsentTier = async (req, res) => {
  try {
    const userId = req.user.id;
    const { verifierId, credentialType } = req.body;

    if (!verifierId || !credentialType) {
      return res.status(400).json({
        success: false,
        message: 'verifierId and credentialType are required'
      });
    }

    // Validate credentialType against allowed values
    const validTypes = ['degree', 'diploma', 'certificate', 'transcript', 'salary_slip', 'employment_letter', 'bank_statement', 'medical_record', 'identity_document', 'other'];
    if (!validTypes.includes(credentialType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid credentialType. Allowed values: ${validTypes.join(', ')}`
      });
    }

    // Check if consent tier already exists
    const existingConsent = await query(
      `SELECT id, status FROM consent_tiers
       WHERE user_id = $1 AND verifier_id = $2 AND credential_type = $3`,
      [userId, verifierId, credentialType]
    );

    let result;
    if (existingConsent.rows.length > 0) {
      // Update existing consent tier
      result = await query(
        `UPDATE consent_tiers
         SET status = 'granted', granted_at = CURRENT_TIMESTAMP, revoked_at = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND verifier_id = $2 AND credential_type = $3
         RETURNING *`,
        [userId, verifierId, credentialType]
      );
    } else {
      // Create new consent tier
      result = await query(
        `INSERT INTO consent_tiers (user_id, verifier_id, credential_type, status, granted_at)
         VALUES ($1, $2, $3, 'granted', CURRENT_TIMESTAMP)
         RETURNING *`,
        [userId, verifierId, credentialType]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Tier-based consent granted successfully',
      data: {
        consent: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Error granting tier consent:', error);
    res.status(500).json({
      success: false,
      message: 'Error granting consent',
      error: error.message
    });
  }
};

/**
 * Revoke tier-based consent for a credential type
 */
export const revokeConsentTier = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if consent tier belongs to user
    const consentCheck = await query(
      'SELECT user_id FROM consent_tiers WHERE id = $1',
      [id]
    );

    if (consentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Consent tier not found'
      });
    }

    if (consentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to revoke this consent'
      });
    }

    // Update consent to revoked
    const result = await query(
      `UPDATE consent_tiers
       SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Tier-based consent revoked successfully',
      data: {
        consent: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Error revoking tier consent:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking consent',
      error: error.message
    });
  }
};

/**
 * Get all active consents for the user
 * Returns both granular and tier-based consents
 */
export const getActiveConsents = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get granular consents
    const granularResult = await query(
      `SELECT id, verifier_id, credential_id, status, granted_at, expires_at, created_at
       FROM consent_records
       WHERE user_id = $1 AND status = 'granted'
       ORDER BY granted_at DESC`,
      [userId]
    );

    // Get tier-based consents
    const tierResult = await query(
      `SELECT id, verifier_id, credential_type, status, granted_at, expires_at, created_at
       FROM consent_tiers
       WHERE user_id = $1 AND status = 'granted'
       ORDER BY granted_at DESC`,
      [userId]
    );

    // Get verifier names for context
    const granularWithVerifiers = await Promise.all(
      granularResult.rows.map(async (record) => {
        const verifierResult = await query('SELECT company_name FROM verifiers WHERE id = $1', [record.verifier_id]);
        return {
          ...record,
          verifier_name: verifierResult.rows[0]?.company_name || 'Unknown'
        };
      })
    );

    const tierWithVerifiers = await Promise.all(
      tierResult.rows.map(async (record) => {
        const verifierResult = await query('SELECT company_name FROM verifiers WHERE id = $1', [record.verifier_id]);
        return {
          ...record,
          verifier_name: verifierResult.rows[0]?.company_name || 'Unknown'
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        granularConsents: granularWithVerifiers,
        tierConsents: tierWithVerifiers,
        total: granularWithVerifiers.length + tierWithVerifiers.length
      }
    });
  } catch (error) {
    console.error('Error fetching active consents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consents',
      error: error.message
    });
  }
};

/**
 * Get all revoked consents for the user (for audit purposes)
 */
export const getRevokedConsents = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get revoked granular consents
    const granularResult = await query(
      `SELECT id, verifier_id, credential_id, status, granted_at, revoked_at, created_at
       FROM consent_records
       WHERE user_id = $1 AND status = 'revoked'
       ORDER BY revoked_at DESC`,
      [userId]
    );

    // Get revoked tier-based consents
    const tierResult = await query(
      `SELECT id, verifier_id, credential_type, status, granted_at, revoked_at, created_at
       FROM consent_tiers
       WHERE user_id = $1 AND status = 'revoked'
       ORDER BY revoked_at DESC`,
      [userId]
    );

    // Get verifier names for context
    const granularWithVerifiers = await Promise.all(
      granularResult.rows.map(async (record) => {
        const verifierResult = await query('SELECT company_name FROM verifiers WHERE id = $1', [record.verifier_id]);
        return {
          ...record,
          verifier_name: verifierResult.rows[0]?.company_name || 'Unknown'
        };
      })
    );

    const tierWithVerifiers = await Promise.all(
      tierResult.rows.map(async (record) => {
        const verifierResult = await query('SELECT company_name FROM verifiers WHERE id = $1', [record.verifier_id]);
        return {
          ...record,
          verifier_name: verifierResult.rows[0]?.company_name || 'Unknown'
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        granularConsents: granularWithVerifiers,
        tierConsents: tierWithVerifiers,
        total: granularWithVerifiers.length + tierWithVerifiers.length
      }
    });
  } catch (error) {
    console.error('Error fetching revoked consents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consents',
      error: error.message
    });
  }
};

export default {
  grantConsentGranular,
  revokeConsentGranular,
  grantConsentTier,
  revokeConsentTier,
  getActiveConsents,
  getRevokedConsents
};
