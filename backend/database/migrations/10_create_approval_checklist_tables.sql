-- =============================================
-- Phase 6: Approval Evidence Checklist Workflow
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS approval_checklist_templates (
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('user', 'institution', 'verifier')),
    checklist_key VARCHAR(80) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    required BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (entity_type, checklist_key)
);

CREATE TABLE IF NOT EXISTS approval_checklist_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('user', 'institution', 'verifier')),
    entity_id UUID NOT NULL,
    checklist_key VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
    notes TEXT,
    reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (entity_type, entity_id, checklist_key),
    FOREIGN KEY (entity_type, checklist_key)
      REFERENCES approval_checklist_templates(entity_type, checklist_key)
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_approval_checklist_reviews_entity
ON approval_checklist_reviews(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_approval_checklist_reviews_status
ON approval_checklist_reviews(status);

INSERT INTO approval_checklist_templates (entity_type, checklist_key, title, description, required, display_order)
VALUES
  ('user', 'identity_document', 'Identity Document Verified', 'Government-issued ID has been validated and is readable.', TRUE, 1),
  ('user', 'face_match', 'Face Match Confirmed', 'Selfie or liveness proof matches submitted identity document.', TRUE, 2),
  ('user', 'dob_match', 'Date Of Birth Match', 'Date of birth in profile matches supporting documents.', TRUE, 3),
  ('user', 'risk_screening', 'Risk Screening Completed', 'Basic sanctions/fraud screening completed for user.', TRUE, 4),
  ('institution', 'registration_certificate', 'Registration Certificate Verified', 'Institution registration certificate has been validated.', TRUE, 1),
  ('institution', 'authorized_signatory', 'Authorized Signatory Confirmed', 'Authorized representative identity and authority confirmed.', TRUE, 2),
  ('institution', 'address_proof', 'Address Proof Reviewed', 'Registered address proof has been reviewed.', TRUE, 3),
  ('institution', 'compliance_screening', 'Compliance Screening Completed', 'Institution-level compliance/risk screening completed.', TRUE, 4),
  ('verifier', 'company_registration', 'Company Registration Verified', 'Verifier organization registration is validated.', TRUE, 1),
  ('verifier', 'business_use_case', 'Business Use Case Validated', 'Use case for credential verification is legitimate and documented.', TRUE, 2),
  ('verifier', 'compliance_contact', 'Compliance Contact Verified', 'Responsible compliance contact has been validated.', TRUE, 3),
  ('verifier', 'terms_acknowledged', 'Terms And Policy Acknowledged', 'Verifier accepted platform terms and policy expectations.', TRUE, 4)
ON CONFLICT (entity_type, checklist_key) DO NOTHING;

COMMENT ON TABLE approval_checklist_templates IS 'Master checklist definitions used by super admin evidence review';
COMMENT ON TABLE approval_checklist_reviews IS 'Per-entity checklist review status and reviewer notes';
