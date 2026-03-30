-- =============================================
-- Phase 6: Verification Document Upload Workflow
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('user', 'institution', 'verifier')),
    entity_id UUID NOT NULL,
    document_type VARCHAR(80) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    mime_type VARCHAR(120),
    file_size BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    uploaded_by UUID,
    reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_documents_entity
ON verification_documents(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_verification_documents_status
ON verification_documents(status);

CREATE INDEX IF NOT EXISTS idx_verification_documents_document_type
ON verification_documents(document_type);

COMMENT ON TABLE verification_documents IS 'Verification documents uploaded by users/institutions/verifiers for account approval.';
