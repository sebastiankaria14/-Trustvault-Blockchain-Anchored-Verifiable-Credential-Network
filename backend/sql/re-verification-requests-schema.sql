-- Re-verification Requests Table
-- Tracks requests from verifiers to re-verify already-verified credentials

CREATE TABLE IF NOT EXISTS re_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
  verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, declined, expired
  reason TEXT, -- Optional reason from verifier for requesting re-verification
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  response_reason TEXT, -- Optional reason from user for approval/decline
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_user_id ON re_verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_verifier_id ON re_verification_requests(verifier_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_credential_id ON re_verification_requests(credential_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_status ON re_verification_requests(status);
