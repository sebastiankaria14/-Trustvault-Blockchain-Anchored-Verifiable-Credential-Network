# Re-Verification Setup Guide

## Quick Setup Steps

### Step 1: Copy the SQL
The SQL file is here: `backend/sql/re-verification-requests-schema.sql`

### Step 2: Run in Supabase

#### Option A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase Project → SQL Editor
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create re_verification_requests table
CREATE TABLE IF NOT EXISTS re_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
  verifier_id UUID NOT NULL REFERENCES verifiers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  reason TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  response_reason TEXT,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_user_id ON re_verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_verifier_id ON re_verification_requests(verifier_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_credential_id ON re_verification_requests(credential_id);
CREATE INDEX IF NOT EXISTS idx_re_verification_requests_status ON re_verification_requests(status);
```

4. Click "Run"
5. You should see: "Success. No rows returned" for each statement

#### Option B: Using PSQL (if installed)
```bash
cd backend
psql $DATABASE_URL -f sql/re-verification-requests-schema.sql
```

#### Option C: Using the Setup Script
```bash
cd backend
bash setup-re-verification.sh
```

---

## Verify Setup Was Successful

Run this query in Supabase SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name='re_verification_requests';
```

You should see one row with `re_verification_requests` if setup was successful.

---

## What Gets Created

### Table: `re_verification_requests`
- Stores re-verification requests from verifiers to users
- Tracks status: pending, approved, declined, expired
- Includes timestamps and optional reasons

### Indexes
- `idx_re_verification_requests_user_id` - Fast lookup by user
- `idx_re_verification_requests_verifier_id` - Fast lookup by verifier
- `idx_re_verification_requests_credential_id` - Fast lookup by credential
- `idx_re_verification_requests_status` - Fast filtering by status

---

## How It Works (After Setup)

### Verifier Flow
1. Opens already-verified credential
2. Clicks "Request Re-verification" button
3. Optionally adds reason
4. Clicks "Send Request to User"
5. Request stored in database

### User Flow (Future Implementation)
1. Receives notification
2. Reviews re-verification request
3. Approves or declines
4. If approved: credential can be verified again

---

## Troubleshooting

### Error: "Table already exists"
- The table is already created (not a problem, it means it's setup correctly)

### Error: "Column 'approved_by_user_id' does not exist"
- The table wasn't created correctly, try deleting it first:
  ```sql
  DROP TABLE IF EXISTS re_verification_requests CASCADE;
  ```
  Then run the create SQL again

### 500 Error when requesting re-verification
- Verify the table exists by running the verification query above
- Check backend logs for specific error message

---

## Cleanup (If Needed)

To remove the re-verification system:

```sql
DROP TABLE IF EXISTS re_verification_requests CASCADE;
```

---

## Files Related to Re-Verification

**Backend:**
- `backend/src/controllers/reVerificationController.js` - Business logic
- `backend/src/routes/reVerificationRoutes.js` - API endpoints
- `backend/sql/re-verification-requests-schema.sql` - Database schema

**Frontend:**
- `frontend/src/services/api.js` - API calls
- `frontend/src/pages/verifier/VerificationDetailPage.jsx` - UI

---

**After setup, the re-verification feature is ready to use!** 🎉
