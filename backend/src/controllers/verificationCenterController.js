import { query } from '../utils/database.js';
import {
  getAllowedDocumentTypes,
  getRequiredDocumentTypes
} from '../utils/verificationRules.js';

const ENTITY_CONFIG = {
  user: {
    table: 'users',
    statusColumn: 'kyc_status',
    statusLabel: 'kycStatus'
  },
  institution: {
    table: 'institutions',
    statusColumn: 'verification_status',
    statusLabel: 'verificationStatus'
  },
  verifier: {
    table: 'verifiers',
    statusColumn: 'verification_status',
    statusLabel: 'verificationStatus'
  }
};

const getEntityConfig = (entityType) => ENTITY_CONFIG[entityType] || null;

const getLatestDocumentsByType = async (entityType, entityId) => {
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

const buildDocumentSummary = (entityType, latestDocuments) => {
  const requiredTypes = getRequiredDocumentTypes(entityType);

  const byType = latestDocuments.reduce((acc, doc) => {
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

const getEntityStatus = async (entityType, entityId) => {
  const entityConfig = getEntityConfig(entityType);
  if (!entityConfig) {
    return null;
  }

  const result = await query(
    `SELECT id, ${entityConfig.statusColumn} AS status
     FROM ${entityConfig.table}
     WHERE id = $1`,
    [entityId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].status;
};

const markEntityPendingForResubmission = async (entityType, entityId) => {
  const entityConfig = getEntityConfig(entityType);
  if (!entityConfig) {
    return;
  }

  await query(
    `UPDATE ${entityConfig.table}
     SET ${entityConfig.statusColumn} = 'pending', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND ${entityConfig.statusColumn} = 'rejected'`,
    [entityId]
  );
};

/**
 * GET /api/verification-center/status
 */
export const getVerificationCenterStatus = async (req, res) => {
  try {
    const entityType = req.user.userType;
    const entityId = req.user.id;

    const entityConfig = getEntityConfig(entityType);
    if (!entityConfig) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported user type for verification center.'
      });
    }

    const status = await getEntityStatus(entityType, entityId);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.'
      });
    }

    const latestDocuments = await getLatestDocumentsByType(entityType, entityId);
    const documentSummary = buildDocumentSummary(entityType, latestDocuments);

    res.status(200).json({
      success: true,
      data: {
        entityType,
        entityId,
        [entityConfig.statusLabel]: status,
        allowedDocumentTypes: getAllowedDocumentTypes(entityType),
        requiredDocumentTypes: documentSummary.requiredTypes,
        documents: latestDocuments,
        documentSummary
      }
    });
  } catch (error) {
    console.error('Error fetching verification center status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification status',
      error: error.message
    });
  }
};

/**
 * POST /api/verification-center/documents
 */
export const uploadVerificationDocument = async (req, res) => {
  try {
    const entityType = req.user.userType;
    const entityId = req.user.id;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required.'
      });
    }

    const allowedDocumentTypes = getAllowedDocumentTypes(entityType);
    if (!allowedDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document type. Allowed types: ${allowedDocumentTypes.join(', ')}`
      });
    }

    const insertResult = await query(
      `INSERT INTO verification_documents (
        entity_type,
        entity_id,
        document_type,
        original_file_name,
        stored_file_name,
        file_path,
        mime_type,
        file_size,
        status,
        uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
      RETURNING
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
        created_at,
        updated_at`,
      [
        entityType,
        entityId,
        documentType,
        req.file.originalname,
        req.file.filename,
        `/uploads/verification-docs/${req.file.filename}`,
        req.file.mimetype,
        req.file.size,
        entityId
      ]
    );

    await markEntityPendingForResubmission(entityType, entityId);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and queued for review.',
      data: {
        document: insertResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Error uploading verification document:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading verification document',
      error: error.message
    });
  }
};

export default {
  getVerificationCenterStatus,
  uploadVerificationDocument
};
