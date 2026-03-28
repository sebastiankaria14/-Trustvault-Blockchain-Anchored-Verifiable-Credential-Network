-- =============================================
-- Phase 7: Add Blockchain Columns to Credentials
-- =============================================

-- Add blockchain columns if they don't exist
ALTER TABLE credentials
ADD COLUMN IF NOT EXISTS blockchain_hash VARCHAR(255);

ALTER TABLE credentials
ADD COLUMN IF NOT EXISTS blockchain_tx_hash VARCHAR(255);

ALTER TABLE credentials
ADD COLUMN IF NOT EXISTS blockchain_network VARCHAR(50) DEFAULT 'polygon-mumbai';

-- Create indexes for blockchain fields
CREATE INDEX IF NOT EXISTS idx_credentials_blockchain_hash ON credentials(blockchain_hash);
CREATE INDEX IF NOT EXISTS idx_credentials_blockchain_tx_hash ON credentials(blockchain_tx_hash);

COMMENT ON COLUMN credentials.did IS 'W3C Decentralized Identifier (DID) for the credential';
COMMENT ON COLUMN credentials.blockchain_hash IS 'SHA-256 hash of credential data stored on blockchain';
COMMENT ON COLUMN credentials.blockchain_tx_hash IS 'Transaction hash from blockchain anchor';
COMMENT ON COLUMN credentials.blockchain_network IS 'Blockchain network where credential is anchored (e.g., polygon-mumbai)';
