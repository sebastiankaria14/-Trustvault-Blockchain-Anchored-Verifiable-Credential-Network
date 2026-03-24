-- =============================================
-- Phase 5: Credential Shares Table
-- Track which credentials are shared with which verifiers
-- =============================================

-- Create credential_shares table
CREATE TABLE IF NOT EXISTS credential_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Sharing details
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Optional expiry
    purpose TEXT, -- Why the credential was shared

    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'expired', 'revoked')),
    verified_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure unique sharing (one credential shared to one verifier only once at a time)
    UNIQUE(credential_id, verifier_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_credential_shares_credential_id ON credential_shares(credential_id);
CREATE INDEX IF NOT EXISTS idx_credential_shares_verifier_id ON credential_shares(verifier_id);
CREATE INDEX IF NOT EXISTS idx_credential_shares_user_id ON credential_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_credential_shares_status ON credential_shares(status);

-- Update trigger
CREATE OR REPLACE FUNCTION update_credential_shares_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_credential_shares_timestamp
    BEFORE UPDATE ON credential_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_credential_shares_timestamp();

-- Insert sample shares for testing (if credentials and verifiers exist)
-- This will create shares for existing credentials to existing verifiers
DO $$
DECLARE
    v_credential_id UUID;
    v_verifier_id UUID;
    v_user_id UUID;
BEGIN
    -- Get first verifier
    SELECT id INTO v_verifier_id FROM verifiers LIMIT 1;

    -- If verifier exists, share some credentials
    IF v_verifier_id IS NOT NULL THEN
        FOR v_credential_id, v_user_id IN
            SELECT c.id, c.user_id FROM credentials c LIMIT 10
        LOOP
            INSERT INTO credential_shares (credential_id, verifier_id, user_id, purpose, status)
            VALUES (v_credential_id, v_verifier_id, v_user_id, 'Employment verification', 'pending')
            ON CONFLICT (credential_id, verifier_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- Comments
COMMENT ON TABLE credential_shares IS 'Tracks which credentials have been shared with which verifiers';
COMMENT ON COLUMN credential_shares.status IS 'pending: awaiting verification, verified: verifier has verified, rejected: verifier rejected, expired: share period expired, revoked: user revoked access';
