-- =============================================
-- Phase 3: User Wallet Portal - Database Tables
-- =============================================

-- Table: credentials
-- Stores all credentials issued to users
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issuer_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL, -- 'degree', 'certificate', 'license', 'employment', 'income', 'medical'
    credential_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL, -- e.g., "Bachelor of Science in Computer Science"
    description TEXT,
    credential_data JSONB NOT NULL, -- Full credential details
    issued_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'pending')),
    blockchain_hash VARCHAR(255), -- For future blockchain integration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: credential_consents
-- Manages who can verify user's credentials
CREATE TABLE IF NOT EXISTS credential_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE CASCADE,
    permission_level VARCHAR(20) DEFAULT 'view' CHECK (permission_level IN ('view', 'verify', 'download')),
    granted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(credential_id, verifier_id)
);

-- Table: verification_logs
-- Audit trail of all credential access/verification
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'viewed', 'verified', 'downloaded', 'shared'
    ip_address VARCHAR(45),
    user_agent TEXT,
    verification_result VARCHAR(20), -- 'success', 'failed', 'expired'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_issuer_id ON credentials(issuer_id);
CREATE INDEX IF NOT EXISTS idx_credentials_status ON credentials(status);
CREATE INDEX IF NOT EXISTS idx_credentials_type ON credentials(credential_type);

CREATE INDEX IF NOT EXISTS idx_consents_credential_id ON credential_consents(credential_id);
CREATE INDEX IF NOT EXISTS idx_consents_verifier_id ON credential_consents(verifier_id);

CREATE INDEX IF NOT EXISTS idx_logs_credential_id ON verification_logs(credential_id);
CREATE INDEX IF NOT EXISTS idx_logs_verifier_id ON verification_logs(verifier_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON verification_logs(timestamp);

-- Update trigger for credentials
CREATE OR REPLACE FUNCTION update_credentials_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_credentials_timestamp
    BEFORE UPDATE ON credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_credentials_timestamp();

-- Comments
COMMENT ON TABLE credentials IS 'Stores all digital credentials issued to users';
COMMENT ON TABLE credential_consents IS 'Manages verifier access permissions to user credentials';
COMMENT ON TABLE verification_logs IS 'Audit trail of all credential verification activities';
