# TrustVault System Architecture

**Last Updated**: March 25, 2026

---

## 🏗️ Core Architecture Principles

TrustVault is built on **three core principles**:

1. **Only Institutions Can Issue** - Users cannot create their own credentials
2. **Users Control Access** - Users decide who can verify their credentials
3. **Blockchain Proves Authenticity** - Verification is automatic, based on blockchain hashes

---

## 📊 Complete Credential Lifecycle

### Phase 1: Institution Issues (Immutable)

```
Institution:
  1. Issues credential (e.g., "Bachelor of Science")
  2. Prepares credential data (name, date, details)
  3. Calculates SHA-256 hash of credential data
  4. Submits hash to blockchain (Polygon Mumbai testnet)
  5. Stores blockchain record in database:
     - credentials.blockchain_hash = "0x1a2b3c..."
     - credentials.blockchain_transaction_id = "0xabc123..."
```

**Result**: Credential is cryptographically hashed and stored on immutable blockchain.

---

### Phase 2: User Receives (Secure Storage)

```
Institution Backend → POST /api/institution/issue-credential
  ↓
Backend:
  1. Creates credential in database
  2. Links to user by user_id
  3. Stores blockchain_hash from Phase 1
  4. Stores document_url (photo/image)
  ↓
User Mobile/Frontend:
  1. Receives notification: "Institution issued new credential"
  2. Clicks to accept in wallet
  3. Credential now stored in user's wallet
  4. User can view anytime
  5. User can share with companies
```

**Database State**:
```sql
credentials table:
- id: UUID
- user_id: UUID (links to user)
- institution_id: UUID (who issued it)
- credential_data: JSONB (the actual credential details)
- blockchain_hash: VARCHAR (hash stored on blockchain)
- blockchain_transaction_id: VARCHAR (blockchain proof)
- document_url: VARCHAR (image/photo of credential)
- status: VARCHAR (active, revoked, expired)
- created_at: TIMESTAMP
```

**Result**: User has credential in secure wallet with blockchain proof.

---

### Phase 3: User Shares (Selective Access)

```
User Dashboard:
  1. Views "My Credentials"
  2. Finds credential to share
  3. Clicks "Share with Company"
  4. Selects companies from list (e.g., "Amazon", "Google")
  ↓
Backend:
  1. Creates entry in credential_shares table:
     - credential_id: UUID
     - verifier_id: UUID (company ID)
     - shared_at: TIMESTAMP
     - status: "pending"
  ↓
Company (Verifier):
  1. Receives notification
  2. Can now access this credential (and ONLY this one)
```

**Database State**:
```sql
credential_shares table:
- id: UUID
- credential_id: UUID (which credential)
- verifier_id: UUID (which company)
- shared_at: TIMESTAMP
- status: VARCHAR (pending, verified, rejected, expired, revoked)
- verified_at: TIMESTAMP (when company verified)
```

**Security**: Company can ONLY see credentials explicitly shared by user. Cannot access any others.

---

### Phase 4: Company Verifies (Automatic, No Manual Input)

```
Company/Verifier:
  1. Logs into TrustVault Verifier Portal
  2. Goes to "Verification Requests"
  3. Sees all credentials shared with them (from credential_shares)
  4. Clicks on credential to view details
  5. Clicks "Run Blockchain Verification" button
  ↓
Backend Process (AUTOMATIC - No verifier input):
  1. Fetch credential data from database
  2. Fetch blockchain_hash stored by institution
  3. Calculate SHA-256 hash of current credential data
  4. Compare:
     - blockchain_hash == calculated_hash?
     - YES → result = "authentic"
     - NO  → result = "fake"
  5. Create entry in verification_logs:
     - credential_id: UUID
     - verifier_id: UUID
     - result: "success" or "failure" (AUTO, not user decision)
     - verification_type: "blockchain_hash_comparison"
     - verified_at: TIMESTAMP
     - result_details: JSONB (blockchain info)
  6. Update credential_shares:
     - status = "verified"
     - verified_at = NOW()
  ↓
Display to Company:
  "✓ AUTHENTIC - This credential matches the blockchain record"
  OR
  "✗ FAKE - This credential does NOT match the blockchain record"
```

**Database State**:
```sql
verification_logs table:
- id: UUID
- credential_id: UUID
- verifier_id: UUID
- verification_type: VARCHAR ("blockchain_hash_comparison")
- result: VARCHAR ("success" or "failure") - AUTOMATIC
- result_details: JSONB (blockchain details)
- verified_at: TIMESTAMP
- blockchain_verified: BOOLEAN
- blockchain_hash_matched: BOOLEAN
- ip_address: VARCHAR
- user_agent: VARCHAR

credential_shares table:
- status: "verified" (updated from "pending")
- verified_at: NOW() (when verified)
```

**Key Points**:
- ✅ Result is AUTOMATIC (based on blockchain hash comparison)
- ✅ Company CANNOT manually say "authentic" or "fake"
- ✅ Company CANNOT add comments or notes
- ✅ Result is purely algorithmic and unbiased
- ✅ Result is recorded in immutable logs with timestamp and company ID

---

### Phase 5: User Sees Verification Status

```
User Dashboard → "My Credentials" → Click credential:
  1. Sees original credential details
  2. Sees new section: "Verification History"
  3. Shows all companies that verified:
     - Company name: "Amazon HR"
     - Result: "✓ Authentic on March 25, 2026"
     - Can see timestamp and verifier details
  ↓
User has PROOF:
  ✓ Institution issued it (blockchain proof)
  ✓ Company verified it (verified_at timestamp)
  ✓ Both are immutable records
```

**Data Flow**:
```
User Wallet displays:
  credentials.credential_data (original)
  +
  verification_logs (all verifications performed by any company)
  +
  verifiers.company_name (which company verified)
```

---

## 🔐 Security Architecture

### 1. **Access Control**

| User Type | Can Do | Cannot Do |
|---|---|---|
| **Institution** | Issue credentials | See other institutions' credentials |
| **User** | Share credentials with select companies | Create their own credentials |
| **Company/Verifier** | See ONLY shared credentials, run verification | See credentials not shared with them |
| | Result is automatic | Modify verification results |

### 2. **Blockchain Immutability**

```
Timestamp T0 (Issue):
  blockchain_hash = SHA256(diploma_data) = "0x1a2b3c..."
  stored on blockchain

Timestamp T1 (Verify):
  current_credential_data = same diploma data
  calculated_hash = SHA256(same data) = "0x1a2b3c..."

  Match? ✓ AUTHENTIC

If diploma was modified between T0 and T1:
  current_credential_data = modified data
  calculated_hash = SHA256(modified) = "0xdead21..."

  No Match? ✗ FAKE
```

### 3. **Audit Trail**

Every action is logged:
- Who issued (institution_id in credentials)
- Who received (user_id in credentials)
- Who shared (credential_shares.shared_at)
- Who verified (verification_logs.verifier_id, verified_at)
- What was the result (verification_logs.result)

---

## 🎯 Why This Architecture?

### Problem: How do we prevent forgery?
**Solution**: Blockchain stores immutable hash. Company verifies against it.

### Problem: How do we prevent company from faking verification?
**Solution**: Verification is automatic (hash comparison), not manual. Company cannot decide result.

### Problem: How do we prevent user from sharing credentials they don't own?
**Solution**: Only institution can issue. User cannot create credentials.

### Problem: How do we prevent unauthorized companies from seeing credentials?
**Solution**: Users explicitly share with credential_shares table. Companies can only access what's shared.

---

## 🚀 Future Enhancements

### Phase 6: Super Admin Portal
- Admin dashboard to monitor system
- Approve/reject new institutions and verifiers
- Monitor verification activity

### Phase 7: Enhanced Blockchain Integration
- Move from Polygon Mumbai (testnet) to mainnet
- Add Merkle tree for batch verification
- Add timestamp oracle for official time proof

### Phase 8: Advanced Features
- Credential revocation on blockchain
- Credential expiration tracking
- Batch verification API for companies
- Webhook notifications

---

## 📝 Summary Table

| Component | Responsibility | Cannot Do |
|---|---|---|
| **Institution** | Issue credentials, calculate hashes, store on blockchain | Verify (shouldn't be biased) |
| **User** | Receive credentials, share selectively | Create credentials, fake verification |
| **Company/Verifier** | Compare hashes automatically | Manually decide result, add comments |
| **Blockchain** | Store immutable hash | Can be modified, can be forged |
| **Backend** | Coordinate all flows, maintain access control | Trust unverified inputs |

---

**This architecture ensures TrustVault is secure, transparent, and tamper-proof.**
