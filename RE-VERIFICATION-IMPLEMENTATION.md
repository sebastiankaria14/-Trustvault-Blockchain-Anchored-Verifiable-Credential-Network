# Re-Verification Request System - Implementation Guide

## Overview
Added a complete feature that allows verifiers to request re-verification of already-verified credentials. Users receive these requests and can approve/decline them.

## Files Created

### 1. Database Schema
**File**: `backend/sql/re-verification-requests-schema.sql`
- Creates the `re_verification_requests` table
- Tracks all re-verification requests with status (pending, approved, declined, expired)
- Includes fields for:
  - credential_id, verifier_id, user_id
  - reason (why verifier is requesting)
  - status and timestamps
  - expires_at (30 days default)

**To Apply Schema**:
```bash
# Execute the SQL file in your Supabase database
# You can use the Supabase admin panel or run via psql
```

### 2. Backend Components

**Controller**: `backend/src/controllers/reVerificationController.js`
- `requestReVerification()` - Verifier requests re-verification
- `getUserReVerificationRequests()` - Get pending requests for user
- `approveReVerification()` - User approves request
- `declineReVerification()` - User declines request
- `getReVerificationStatus()` - Check status of specific request

**Routes**: `backend/src/routes/reVerificationRoutes.js`
- `/user/re-verification-requests` - GET/POST endpoints
- `/verifier/credentials/:credentialId/request-re-verification` - POST to request

**Server Update**: `backend/src/server.js`
- Added import for reVerificationRoutes
- Mounted at `/api/re-verification`

### 3. Frontend Components

**API Service**: `frontend/src/services/api.js`
- New functions:
  - `requestReVerification()` - Send request
  - `getUserReVerificationRequests()` - Get user's requests
  - `getReVerificationStatus()` - Check status
  - `approveReVerification()` - User approves
  - `declineReVerification()` - User declines

**UI Update**: `frontend/src/pages/verifier/VerificationDetailPage.jsx`
- When credential is already verified:
  - Shows "Request Re-verification" button (amber color)
  - Optional form to enter reason
  - Sends request to user
  - Shows confirmation message

## How It Works

### Verifier Workflow
1. Opens an already-verified credential
2. Sees "ALREADY VERIFIED" status
3. Clicks "Request Re-verification" button
4. (Optional) Enters reason why (e.g., "Document conditions changed")
5. Clicks "Send Request to User"
6. User receives notification

### User Workflow
1. Receives request notification
2. Sees list of re-verification requests (in dashboard/audit log)
3. Reviews which company requested and why
4. Can approve or decline with optional reason
5. If approved:
   - credential_shares.status changes from 'verified' back to 'pending'
   - Verifier can now verify again
6. If declined:
   - Request marked as declined
   - Verifier cannot verify again (until they request again)

## Database Cleanup Instructions

**File**: `backend/cleanup-demo-data.js`

This script removes all demo credentials except the latest "TWE":

```bash
cd backend
node cleanup-demo-data.js
```

**What it does**:
- Finds the latest credential named "TWE"
- Deletes all other credentials
- CASCADE delete removes related credential_shares and verification_logs
- Shows confirmation of deleted items

**Output Example**:
```
✓ Found latest TWE credential: {UUID}
✓ Found 8 credentials to delete

Credentials to be deleted:
  1. Demo Degree 1 (3/22/2026, 2:30 PM)
  2. Demo Degree 2 (3/23/2026, 4:15 PM)
  ...

✓ Deleted batch 1, total deleted: 8

✅ Cleanup complete!
   - Kept: 1 credential (TWE)
   - Deleted: 8 credentials
   - Related credential_shares and verification_logs automatically deleted (cascade)
```

## API Endpoints Summary

### For Verifiers
```
POST /api/re-verification/verifier/credentials/{credentialId}/request-re-verification
Body: { reason?: string }
Response: { success, data: { request details } }
```

### For Users
```
GET /api/re-verification/user/re-verification-requests?status=pending
Response: { success, data: [requests] }

GET /api/re-verification/user/re-verification-requests/{requestId}
Response: { success, data: { request details } }

POST /api/re-verification/user/re-verification-requests/{requestId}/approve
Body: { reason?: string }
Response: { success, updates credential_shares status back to pending }

POST /api/re-verification/user/re-verification-requests/{requestId}/decline
Body: { reason?: string }
Response: { success }
```

## Next Steps (For Complete User Experience)

1. **Add User UI for managing requests**:
   - Create notification icon in user dashboard
   - Show pending re-verification requests count
   - Allow approve/decline with reasons

2. **Add email notifications**:
   - Notify user when new request comes in
   - Notify verifier when request approved/declined

3. **User dashboard widget**:
   - Show recent re-verification requests
   - Quick action buttons

## Testing

### Test Re-verification Request
1. Logout and come back as verifier
2. Open an already-verified credential
3. Click "Request Re-verification"
4. Optionally add reason
5. Submit request
6. (Pending: Test user approval side)

### Test Database Cleanup
1. Run `node cleanup-demo-data.js`
2. Verify only "TWE" credential remains
3. Check that related records are deleted
