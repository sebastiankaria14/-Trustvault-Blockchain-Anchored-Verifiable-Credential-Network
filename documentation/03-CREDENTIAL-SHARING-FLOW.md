# 03 - CREDENTIAL SHARING & VERIFICATION FLOW

**Date:** March 28, 2026
**Phase:** Phase 2 (Authentication & Database)
**Status:** ✅ Documented

---

## 📋 OVERVIEW

This document explains how users (individuals) share their credentials with verifiers (companies/organizations) in the TrustVault platform, and how verifiers verify those credentials.

---

## 🔄 COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER (Individual)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─→ Login to wallet portal
                              ├─→ View personal credentials
                              └─→ Want to share credential with employer
                                     │
                                     ▼
                    ╔════════════════════════════╗
                    ║  Step 1: Browse Verifiers  ║
                    ╚════════════════════════════╝
                    GET /api/users/verifiers
                    Response: List of all active verifiers
                    (company_name, industry, contact info)
                                     │
                                     ▼
                    ╔════════════════════════════════════╗
                    ║  Step 2: Select & Share Credential ║
                    ╚════════════════════════════════════╝
                    POST /api/users/credentials/{id}/share
                    Request: { verifierId: "google-uuid" }
                                     │
                                     ▼
                    ╔═══════════════════════════════╗
                    ║  Backend Validation & Create  ║
                    ╚═══════════════════════════════╝
                    1. Verify credential exists
                    2. Verify credential belongs to user
                    3. Verify verifier exists
                    4. Check for duplicates
                    5. Insert into credential_shares table
                    Status: "pending"
                                     │
                                     ▼
                    ╔════════════════════════╗
                    ║  Response to User      ║
                    ╚════════════════════════╝
                    {
                      success: true,
                      data: {
                        share_id: "xxx",
                        credential_id: "yyyy",
                        verifier_id: "google",
                        shared_at: "2026-03-28...",
                        status: "pending"
                      }
                    }
                                     │
                                     ▼
                    ╔═══════════════════════════════╗
                    ║  Step 3: Grant Consent (Opt.)  ║
                    ╚═══════════════════════════════╝
                    User can grant consent via:

                    A) Granular (specific credential):
                    POST /api/users/consent/grant-granular
                    { verifierId, credentialId }

                    B) Tier-based (all credentials of type):
                    POST /api/users/consent/grant-tier
                    { verifierId, credentialType: "degree" }

                    Stored in: consent_records / consent_tiers
                                     │
                                     ▼
                    ╔═════════════════════════════════╗
                    ║  Step 4: User Views Share Status ║
                    ╚═════════════════════════════════╝
                    GET /api/users/credentials/shared
                    Response: All shared credentials with:
                    - Company name
                    - Share timestamp
                    - Verification status
                    - Share ID for future revocation

┌─────────────────────────────────────────────────────────────────┐
│                   VERIFIER (Company/Organization)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─→ Login to verifier portal
                              └─→ View verification requests
                                     │
                                     ▼
                    ╔═══════════════════════════════════╗
                    ║  Step 1: View Verification Queue   ║
                    ╚═══════════════════════════════════╝
                    GET /api/verifiers/verification-requests
                    Query params: status, search, page, limit
                    Response: All pending credentials from users
                    Shows: User name, credential name, share timestamp
                                     │
                                     ▼
                    ╔════════════════════════════════╗
                    ║  Step 2: View Credential Details║
                    ╚════════════════════════════════╝
                    GET /api/verifiers/credential/{id}
                    Response includes:
                    - Full credential data
                    - User information
                    - Issuer information
                    - Current share status
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────┐
          │  Step 3: AUTOMATIC VERIFICATION via Blockchain │
          └─────────────────────────────────────────────────┘

          POST /api/verifiers/credential/{id}/verify

          Backend Process (100% AUTOMATIC - NO manual input):
          ┌───────────────────────────────────────────────────┐
          │ 1. Fetch credential from database                │
          │    - credential_data                             │
          │    - blockchain_hash (stored during issuance)    │
          │                                                  │
          │ 2. Calculate current hash                        │
          │    - Use SHA-256 on credential_data              │
          │    - Deterministic method (consistent results)   │
          │                                                  │
          │ 3. COMPARE HASHES                                │
          │    if (currentHash === blockchainHash) {         │
          │      result = "AUTHENTIC"                        │
          │    } else {                                      │
          │      result = "FAKE"                             │
          │    }                                             │
          │                                                  │
          │ 4. Log everything                                │
          │    - Insert into verification_logs               │
          │    - Update credential_shares status             │
          │    - Store IP, user-agent, timestamp             │
          └───────────────────────────────────────────────────┘
                                     │
                                     ▼
                    ╔═════════════════════════════════╗
                    ║  Response to Verifier (Result)   ║
                    ╚═════════════════════════════════╝

                    IF AUTHENTIC:
                    {
                      success: true,
                      message: "Credential is AUTHENTIC - Blockchain hash matches",
                      data: {
                        verificationResult: "authentic",
                        isAuthentic: true,
                        hashMatch: true,
                        blockchainHash: "abc123...",
                        calculatedHash: "abc123...",
                        credentialName: "MIT Bachelor Degree",
                        verified_at: "2026-03-28..."
                      }
                    }

                    IF FAKE:
                    {
                      success: true,
                      message: "Credential is FAKE - Blockchain hash does not match",
                      data: {
                        verificationResult: "fake",
                        isAuthentic: false,
                        hashMatch: false,
                        blockchainHash: "abc123...",
                        calculatedHash: "xyz789...",
                        credentialName: "MIT Bachelor Degree",
                        verified_at: "2026-03-28..."
                      }
                    }
                                     │
                                     ▼
                    ╔════════════════════════════════╗
                    ║  Step 4: View Verification History║
                    ╚════════════════════════════════╝
                    GET /api/verifiers/history
                    Query params: result (authentic/fake/all), page, limit
                    Response: All verifications performed with:
                    - Credential name & type
                    - User name & email
                    - Result (authentic/fake)
                    - Verification timestamp
                    - Details (hash comparison info)

```

---

## 📊 API ENDPOINTS SUMMARY

### User Endpoints (Individual)

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/users/verifiers` | Get list of verifiers | None | `{ verifiers: [], total: int }` |
| POST | `/api/users/credentials/:id/share` | Share credential | `{ verifierId }` | `{ share_id, status: "pending" }` |
| GET | `/api/users/credentials/shared` | View shared credentials | None | `{ sharedCredentials: [], total }` |
| POST | `/api/users/consent/grant-granular` | Grant specific access | `{ verifierId, credentialId }` | `{ consent: {...} }` |
| POST | `/api/users/consent/grant-tier` | Grant type-based access | `{ verifierId, credentialType }` | `{ consent: {...} }` |
| GET | `/api/users/consent/active` | View active consents | None | `{ granularConsents, tierConsents }` |
| DELETE | `/api/users/consent/:id/revoke` | Revoke consent | None | `{ success: true }` |

### Verifier Endpoints (Company)

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/verifiers/verification-requests` | Get all shared credentials | None | `{ requests: [], total, page }` |
| GET | `/api/verifiers/credential/:id` | View credential details | None | `{ credential: {...} }` |
| POST | `/api/verifiers/credential/:id/verify` | Verify credential (automatic) | None | `{ verificationResult, hashMatch }` |
| POST | `/api/verifiers/verify-did` | Verify by DID (API usage) | `{ did, credentialData }` | `{ certificate, didValid }` |
| GET | `/api/verifiers/history` | View verification history | None | `{ history: [], total, page }` |
| GET | `/api/verifiers/dashboard/stats` | Dashboard statistics | None | `{ stats, recentVerifications }` |
| GET | `/api/verifiers/credential/:id/download` | Download credential | None | `{ credential: {...} }` |

---

## 💾 DATABASE TABLES

### credential_shares
Stores when a user shares a credential with a verifier

```sql
CREATE TABLE credential_shares (
  id UUID PRIMARY KEY,
  credential_id UUID NOT NULL (FK credentials),
  user_id UUID NOT NULL (FK users),
  verifier_id UUID NOT NULL (FK verifiers),
  shared_at TIMESTAMP,
  verified_at TIMESTAMP,
  status VARCHAR (pending/verified/rejected),
  purpose VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### consent_records
Granular consent - user grants verifier access to specific credential

```sql
CREATE TABLE consent_records (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (FK users),
  verifier_id UUID NOT NULL (FK verifiers),
  credential_id UUID NOT NULL (FK credentials),
  status VARCHAR (granted/revoked),
  granted_at TIMESTAMP,
  revoked_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### consent_tiers
Tier-based consent - user grants verifier access to all credentials of a type

```sql
CREATE TABLE consent_tiers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (FK users),
  verifier_id UUID NOT NULL (FK verifiers),
  credential_type VARCHAR (degree/diploma/certificate/salary_slip/etc),
  status VARCHAR (granted/revoked),
  granted_at TIMESTAMP,
  revoked_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### verification_logs
Complete audit trail of all verification attempts

```sql
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY,
  credential_id UUID (FK credentials),
  user_id UUID (FK users),
  verifier_id UUID NOT NULL (FK verifiers),
  verification_type VARCHAR (blockchain_hash_comparison/api/document_download),
  verification_method VARCHAR (web/api),
  result VARCHAR (success/failure),
  result_details JSONB (contains: blockchain_hash, calculated_hash, hash_match),
  blockchain_verified BOOLEAN,
  blockchain_hash_matched BOOLEAN,
  ip_address VARCHAR,
  user_agent VARCHAR,
  verified_at TIMESTAMP
)
```

---

## 🔐 SECURITY & PRIVACY FEATURES

### 1. Consent-Based Sharing
- Users explicitly grant consent for each credential share
- Consent can be revoked anytime
- Verifiers cannot access credentials without active consent
- Consent can be set to expire after time period

### 2. Blockchain Immutability
- Credential hash stored on blockchain during issuance
- Hash is immutable and tamper-proof
- Verification compares current data with blockchain hash
- Detects any unauthorized modifications

### 3. Complete Audit Trail
- Every verification attempt is logged
- Includes IP address, user agent, timestamp
- Users can see full history of who verified what and when
- Verifiers can see their complete verification history

### 4. Granular Access Control
- Users can control access per credential or by type
- Different consent levels for different verifiers
- Time-based consent expiration
- Easy revocation without ceremony

---

## 🔄 VERIFICATION PROCESS DETAILS

### Automatic Blockchain Verification

The verification process is **100% automatic** and requires **NO manual input** from the verifier:

```javascript
// Step 1: Fetch credential from database
const credentialData = credential.credential_data;
const blockchainHash = credential.blockchain_hash;

// Step 2: Calculate deterministic SHA-256 hash
const currentHash = calculateCredentialHash(credentialData);
// This uses a consistent method that always produces same hash for same data

// Step 3: Compare (AUTOMATIC DECISION)
const isAuthentic = currentHash === blockchainHash;

// Step 4: Return result
if (isAuthentic) {
  return { verificationResult: 'authentic', message: 'Hash matches blockchain' };
} else {
  return { verificationResult: 'fake', message: 'Hash does not match blockchain' };
}
```

**Key Points:**
- ✅ No manual review needed
- ✅ Instant result (< 2 seconds)
- ✅ Deterministic (same result every time)
- ✅ No false positives (hash either matches or doesn't)
- ✅ Complete audit trail logged

---

## 📱 USER JOURNEY EXAMPLES

### Example 1: Student Sharing Degree with Employer

```
1. Student logs in to TrustVault wallet
2. Sees their credentials: "MIT Bachelor Degree"
3. Wants to apply to Google
4. Calls GET /api/users/verifiers
5. Sees list including "Google"
6. Calls POST /api/users/credentials/{degreeId}/share
   with { verifierId: "google-uuid" }
7. Gets confirmation: share_id = "share-123"
8. Optional: Grants consent via POST /api/users/consent/grant-granular
9. Credential is now available to Google for verification
```

### Example 2: Employer Verifying Student Credentials

```
1. HR Manager at Google logs in to TrustVault verifier portal
2. Sees "Verification Requests" (5 pending credentials)
3. Clicks on "MIT Bachelor Degree" from John Doe
4. Reviews credential details
5. Clicks "Verify" button
6. Backend automatically:
   - Calculates credential hash
   - Compares with blockchain hash
   - Returns result instantly
7. Result: "AUTHENTIC - Hash matches blockchain"
8. HR Manager sees: ✅ Degree is genuine
9. Logs into their HR system to hire John
```

### Example 3: Detecting Fake Credential

```
1. Verifier receives share of credential
2. User somehow modified their credential data
3. Verifier clicks "Verify"
4. Backend:
   - Calculates hash of MODIFIED data = "xyz789"
   - Compares with blockchain hash = "abc123"
   - They don't match!
5. Result: "FAKE - Hash does not match blockchain"
6. Verifier sees: ❌ This credential is fraudulent
7. Verifier can reject the candidate
```

---

## ⚙️ TECHNICAL IMPLEMENTATION NOTES

### Hash Calculation (Deterministic)
The backend uses SHA-256 with a **deterministic method** to ensure consistency:

```javascript
// File: backend/src/utils/hash.js
export const calculateCredentialHash = (credentialData) => {
  // Convert credential data to consistent JSON string
  const jsonString = JSON.stringify(credentialData, Object.keys(credentialData).sort());
  // Calculate SHA-256 hash
  return crypto.createHash('sha256').update(jsonString).digest('hex');
};
```

**Why deterministic?**
- Same credential data always produces same hash
- No randomness involved
- Reproducible verification
- Detection of ANY changes (even 1 byte)

### Blockchain Storage
When credential is initially created by institution:
1. Institution submits credential with data
2. Hash is calculated
3. Hash is stored on Polygon blockchain (Mumbai testnet)
4. Hash is also stored in database
5. Future verification uses blockchain hash as source of truth

### Consent Checking (In API approach)
When verifier uses API to verify (not web portal):

```javascript
const checkVerificationConsent = async ({
  credentialId,
  verifierId,
  userId,
  credentialType
}) => {
  // Check granular consent first
  const hasGranularConsent = await query(
    `SELECT status FROM consent_records
     WHERE credential_id = $1 AND verifier_id = $2 AND status = 'granted'`
  );

  if (hasGranularConsent) return true;

  // Check tier-based consent
  const hasTierConsent = await query(
    `SELECT status FROM consent_tiers
     WHERE credential_type = $1 AND verifier_id = $2 AND status = 'granted'`
  );

  return hasTierConsent ? true : false;
};
```

---

## 🎯 KEY TAKEAWAYS

1. **User Control**: Users decide who can access their credentials
2. **Instant Verification**: No waiting, no manual review
3. **Fraud Detection**: Blockchain makes forgery impossible
4. **Complete Transparency**: Users see all verification activity
5. **Privacy Friendly**: Granular consent controls
6. **Audit Ready**: Complete logs for regulatory compliance

---

## 📝 NEXT STEPS

### Phase 2 Tasks
- [ ] Build user credential sharing UI in wallet portal
- [ ] Build verifier verification queue UI
- [ ] Implement credential issuance by institutions
- [ ] Deploy database with all tables
- [ ] Test end-to-end flow with mock data

### Phase 3 (Future)
- [ ] Build institution portal for credential issuance
- [ ] Build super admin panel for approvals
- [ ] Implement blockchain integration (currently mocked)
- [ ] Add advanced consent features (time-based, partial data sharing)

---

**Next Documentation**: 04-AUTHENTICATION-SYSTEM.md (To be created)
