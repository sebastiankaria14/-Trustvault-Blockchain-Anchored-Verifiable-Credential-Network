-- =============================================
-- Phase 7: DID + Consent Tiers + Blockchain indexes
-- =============================================

-- Add DID column for W3C-style identifier
ALTER TABLE credentials
ADD COLUMN IF NOT EXISTS did VARCHAR(255);

-- Ensure DID uniqueness and lookup performance
CREATE UNIQUE INDEX IF NOT EXISTS uq_credentials_did ON credentials(did);
CREATE INDEX IF NOT EXISTS idx_credentials_did ON credentials(did);

-- Consent tiers for type-level sharing approvals
CREATE TABLE IF NOT EXISTS consent_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'revoked', 'expired')),
    granted_at TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, verifier_id, credential_type)
);

CREATE INDEX IF NOT EXISTS idx_consent_tiers_user_id ON consent_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_tiers_verifier_id ON consent_tiers(verifier_id);
CREATE INDEX IF NOT EXISTS idx_consent_tiers_credential_type ON consent_tiers(credential_type);
CREATE INDEX IF NOT EXISTS idx_consent_tiers_status ON consent_tiers(status);

-- Updated_at trigger for consent tiers
CREATE OR REPLACE FUNCTION update_consent_tiers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_consent_tiers_timestamp ON consent_tiers;
CREATE TRIGGER trigger_update_consent_tiers_timestamp
    BEFORE UPDATE ON consent_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_consent_tiers_timestamp();

COMMENT ON TABLE consent_tiers IS 'User consent grants at credential-type level for verifier access';
