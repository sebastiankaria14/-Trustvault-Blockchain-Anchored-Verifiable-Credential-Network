-- =============================================
-- Phase 5: Add comments column to verification_logs
-- =============================================

-- Add comments column to store verifier notes
ALTER TABLE verification_logs
ADD COLUMN IF NOT EXISTS comments TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_logs_timestamp ON verification_logs(timestamp);
