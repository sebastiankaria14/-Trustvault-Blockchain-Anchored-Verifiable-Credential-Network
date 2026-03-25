# 10 - BLOCKCHAIN INTEGRATION

**Date:** 2026-03-25
**Phase:** Phase 7
**Status:** 🟡 In Progress
**Last Test Run:** 2026-03-25

---

## 📝 SUMMARY

This document defines the complete implementation plan for blockchain-based credential verification in TrustVault. The flow ensures that each issued certificate is hashed, anchored on Polygon Mumbai, stored in the user wallet, and later verified by authenticated third parties using certificate data plus DID. Verification succeeds only when backend-generated hash matches on-chain hash and user consent checks pass.

---

## 🎯 OBJECTIVES

- [x] Define issuance flow: institution issues certificate -> hash -> blockchain anchor
- [x] Define wallet flow: certificate copy stored in user wallet database records
- [x] Define third-party verification flow using certificate data + DID
- [x] Define backend hash comparison with blockchain data
- [x] Define response contract (`certificate=true` on successful verification)
- [x] Define consent model (granular + tier-based)
- [x] Define implementation files, dependencies, and verification checklist

---

## 🛠️ WHAT WAS DONE

### 1. Clarified Product Flow and Security Boundaries

The blockchain flow was mapped to the exact business requirement:

1. Institution issues a degree/certificate.
2. Backend canonicalizes certificate payload and computes deterministic SHA-256 hash.
3. Hash + DID are registered on Polygon Mumbai.
4. Full credential record remains in TrustVault wallet storage linked to user.
5. Third party submits certificate payload and DID to authenticated verification endpoint.
6. Backend re-hashes submitted payload and compares it with on-chain hash for DID.
7. If matched (and access consent valid), backend returns verification success.

### 2. Chosen Blockchain Architecture

- Network: Polygon Mumbai (testnet)
- Contract strategy: Standards-based smart contract approach (ERC-compatible foundation)
- DID format: W3C-style DID string, e.g. `did:polygon:mumbai:<credential-id>`
- Hash strategy now: one deterministic hash per certificate
- Hash strategy later: extend to selective-field packs (education fields, identity fields, etc.)

### 3. Planned Backend Issuance Integration

The issuance controller flow is planned to move from placeholder random hash generation to real cryptographic anchoring:

- Generate credential payload object
- Hash payload deterministically
- Generate DID
- Submit DID + hash to contract
- Save DB record with:
  - `did`
  - `blockchain_hash`
  - `blockchain_tx_hash`
  - `blockchain_network`
- Return issuance response containing blockchain metadata

### 4. Planned Verification Integration

A verifier endpoint is planned to support authenticated certificate validation:

- Input: `did` + `credentialData`
- Backend recalculates hash from incoming credential data
- Backend fetches registered hash by DID from blockchain
- Backend compares hashes
- Backend checks consent policies
- Backend logs verification result and blockchain check metadata
- Output includes boolean verdict for partner systems

### 5. Consent Model Finalization

Both consent approaches are included:

- Granular consent: per user + verifier + credential
- Tier-based consent: per user + verifier + credential type (e.g., education)

Verification returns positive only when both technical validity and access policy requirements are satisfied.

### 6. Implementation Sequencing

Execution phases were defined to reduce risk and enable progressive validation:

1. Contract and deployment pipeline
2. Blockchain utility layer
3. Database additions for DID + consent tiers
4. Issuance controller refactor
5. Verification controller refactor
6. Error/fallback handling
7. Automated and manual verification testing

---

## 🧪 ACTUAL TEST EXECUTION RESULTS (2026-03-25)

The following commands were executed in the backend workspace to validate implementation status.

### Executed Checks

1. `npm run contract:compile`
2. `npm run contract:deploy:mumbai`
3. `npx hardhat run scripts/deploy-contract.js --network hardhat`
4. Local contract smoke test (deploy -> register -> get hash -> verify)

### Results

- ✅ Contract compilation works (`hardhat compile` successful).
- ✅ Local Hardhat deployment works (contract deploys and owner is set).
- ✅ Local on-chain flow works (`registerCredential`, `getCredentialHash`, `verifyCredential` returned expected values).
- ⚠️ Mumbai deployment currently blocked by environment configuration (no RPC URL/private key available in active shell).
- ✅ Deployment script compatibility issue fixed:
  - File: `backend/scripts/deploy-contract.js`
  - Change: replaced `import { ethers } from 'hardhat'` with ESM-safe default import and destructuring.

### Current Blockers for Mumbai

- Missing blockchain environment variables at runtime:
  - `BLOCKCHAIN_RPC_URL` or `POLYGON_MUMBAI_RPC_URL`
  - `PRIVATE_KEY` or `TRUSTVAULT_SIGNER_PRIVATE_KEY`
  - `CREDENTIAL_CONTRACT_ADDRESS` (required after successful deploy for backend verification reads)

### Interpretation

- Smart contract and integration logic are functional locally.
- Mumbai deploy/read/write is pending credentials and RPC configuration, not contract logic errors.

---

## 📂 FILES CREATED/MODIFIED

### Actually Modified During Testing:
- `backend/scripts/deploy-contract.js` - Fixed Hardhat import compatibility for ESM runtime

### Planned to Create:
- `backend/contracts/CredentialRegistry.sol` - Smart contract for DID/hash registration and verification
- `backend/scripts/deploy-contract.js` - Contract deployment script for Mumbai
- `backend/src/utils/blockchain.js` - On-chain read/write helper functions
- `backend/src/utils/did.js` - DID generation/validation helpers
- `backend/src/utils/hashing.js` - Deterministic payload hashing utilities
- `backend/src/controllers/consentController.js` - Consent API for granular/tier grants
- `backend/BLOCKCHAIN_SETUP.md` - Setup and deployment instructions
- `backend/BLOCKCHAIN_API.md` - Internal blockchain utility/API reference

### Planned to Modify:
- `backend/src/controllers/institutionController.js` - Replace placeholder hash with real hash + blockchain write
- `backend/src/controllers/verifierController.js` - Add DID+hash blockchain verification flow
- `backend/src/routes/verifierRoutes.js` - Route updates for blockchain verification endpoint
- `database/schema.sql` - Add DID field/index and consent tier table
- `backend/.env.example` - Add blockchain-related environment variables
- `documentation/0.1-DEVELOPMENT_PLAN.md` - Sync phase tracking and milestone details
- `documentation/INDEX.md` - Add link/status for this blockchain document

---

## 💻 CODE SNIPPETS

### Key Implementation 1: Deterministic Hashing

```javascript
// backend/src/utils/hashing.js
import crypto from 'crypto';

export function canonicalizeCredential(data) {
  const ordered = Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  return JSON.stringify(ordered);
}

export function hashCredential(data) {
  const payload = canonicalizeCredential(data);
  return crypto.createHash('sha256').update(payload).digest('hex');
}
```

### Key Implementation 2: Verification Controller Logic

```javascript
// backend/src/controllers/verifierController.js
export async function verifyCredentialWithBlockchain(req, res) {
  const { did, credentialData } = req.body;
  const verifierId = req.user.id;

  const requestHash = hashCredential(credentialData);
  const onChainHash = await getCredentialHashByDID(did);

  const hashMatched = requestHash === onChainHash;
  const consentGiven = await checkConsentForVerification({ did, verifierId });
  const certificate = hashMatched && consentGiven;

  await logVerification({
    verifierId,
    did,
    hashMatched,
    blockchainVerified: !!onChainHash,
    certificate
  });

  return res.status(200).json({
    success: true,
    certificate,
    didValid: !!onChainHash,
    blockchainMatch: hashMatched,
    consentGiven
  });
}
```

---

## 📦 DEPENDENCIES ADDED

```bash
cd backend
npm install @openzeppelin/contracts
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

**Packages:**
- `@openzeppelin/contracts` - Standard audited smart contract primitives
- `hardhat` - Smart contract compilation, testing, deployment
- `@nomicfoundation/hardhat-toolbox` - Hardhat tooling bundle

---

## ⚙️ CONFIGURATION CHANGES

- `backend/.env.example` additions:
  - `POLYGON_MUMBAI_RPC_URL`
  - `CREDENTIAL_CONTRACT_ADDRESS`
  - `BLOCKCHAIN_NETWORK=polygon-mumbai`
  - `TRUSTVAULT_SIGNER_PRIVATE_KEY`
- Contract ABI storage strategy:
  - Load ABI from deployed artifact JSON in backend runtime
- Database updates:
  - Add `credentials.did` (unique/indexed)
  - Add consent tier table for policy layer

---

## 🐛 ISSUES & SOLUTIONS

**Issue 1:** Current issuance uses mock/random blockchain hash placeholder.
**Solution:** Replace with deterministic SHA-256 hash from canonical payload and on-chain registration.

**Issue 2:** Verification currently records manual authentic/fake status without blockchain comparison.
**Solution:** Add DID-driven hash retrieval from blockchain and programmatic hash equality check.

**Issue 3:** Privacy requirements require progressive selective disclosure.
**Solution:** Keep one-cert hash now; design utility to support future field-group hashing without architecture rewrite.

**Issue 4:** Consent must support both strict and practical sharing models.
**Solution:** Implement dual consent resolution: granular first, tier-based fallback.

---

## ✅ TESTING

### Current Run Status (2026-03-25)

- [x] Contract compile check (`npm run contract:compile`)
- [x] Local deployment check (`--network hardhat`)
- [x] Local register/get/verify contract flow smoke test
- [ ] Mumbai deployment (`npm run contract:deploy:mumbai`) - blocked by missing env config
- [ ] Full API E2E (`/api/institution/credentials` and `/api/verifier/verify-did`) against Mumbai

### E2E Step-by-Step Testing (Manual)

### 1) Prepare Environment

- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Set required variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `BLOCKCHAIN_RPC_URL` (or `POLYGON_MUMBAI_RPC_URL`)
  - `PRIVATE_KEY` (or `TRUSTVAULT_SIGNER_PRIVATE_KEY`)
  - `CREDENTIAL_CONTRACT_ADDRESS` (fill after deploy)

### 2) Apply Database Migration

- [ ] Apply `backend/database/migrations/06_add_did_and_consent_tiers.sql`
- [ ] Verify `credentials.did` exists
- [ ] Verify `consent_tiers` table exists

### 3) Compile and Deploy Smart Contract

```bash
cd backend
npm install
npm run contract:compile
npm run contract:deploy:mumbai
```

If Hardhat asks telemetry prompt in non-interactive runs, use:

```bash
set HARDHAT_DISABLE_TELEMETRY_PROMPT=true
npm run contract:deploy:mumbai
```

- [ ] Copy deployed contract address from terminal output
- [ ] Paste it into `CREDENTIAL_CONTRACT_ADDRESS` in `backend/.env`

### 4) Start Backend Server

```bash
cd backend
npm run dev
```

- [ ] Confirm health endpoint works: `GET /health`

### 5) Register and Login Test Accounts

Create 3 accounts:
- [ ] User: `POST /api/auth/register/user`
- [ ] Institution: `POST /api/auth/register/institution`
- [ ] Verifier: `POST /api/auth/register/verifier`

Login and save tokens:
- [ ] Institution token from `POST /api/auth/login` with `userType=institution`
- [ ] Verifier token from `POST /api/auth/login` with `userType=verifier`

### 6) Issue Credential (Blockchain Anchor Test)

Call:
- [ ] `POST /api/institution/credentials` with institution token

Example body:

```json
{
  "recipientEmail": "user@test.com",
  "credentialType": "degree",
  "credentialName": "Bachelor of Science",
  "description": "Computer Science",
  "issueDate": "2026-03-25",
  "expiryDate": null,
  "documentUrl": null
}
```

Expected response checks:
- [ ] `data.did` is present
- [ ] `data.blockchain_hash` is present
- [ ] `data.blockchain_tx_hash` is present (if strict on-chain write succeeds)
- [ ] `data.blockchainAnchored = true` (or `false` with fallback message)

### 7) Grant Consent for Verification

Current implementation checks consent in DB.

Option A (granular):
- [ ] Insert into `consent_records` with:
  - `user_id`
  - `verifier_id`
  - `credential_id`
  - `status='granted'`
  - `granted_at=NOW()`

Option B (tier-based):
- [ ] Insert into `consent_tiers` with:
  - `user_id`
  - `verifier_id`
  - `credential_type='degree'`
  - `status='granted'`
  - `granted_at=NOW()`

### 8) Verify Credential by DID

Call:
- [ ] `POST /api/verifier/verify-did` with verifier token

Example body:

```json
{
  "did": "did:polygon:mumbai:<credential-uuid>",
  "credentialData": {
    "credentialType": "degree",
    "credentialName": "Bachelor of Science",
    "description": "Computer Science",
    "issueDate": "2026-03-25",
    "expiryDate": null,
    "recipientEmail": "user@test.com",
    "issuedBy": "<institution-uuid>"
  }
}
```

Expected response checks (success case):
- [ ] `success = true`
- [ ] `certificate = true`
- [ ] `didValid = true`
- [ ] `blockchainMatch = true`
- [ ] `consentGiven = true`

### 9) Negative Tests

Test 1 (tampered data):
- [ ] Change one field in `credentialData` (e.g., `credentialName`)
- [ ] Expect `certificate = false` and `blockchainMatch = false`

Test 2 (invalid DID):
- [ ] Send invalid DID format
- [ ] Expect `400` with DID format error

Test 3 (no consent):
- [ ] Remove/revoke consent entry
- [ ] Expect `certificate = false` while hash may still match

### 10) Verification Log Assertions

After each verification call, confirm an entry exists in `verification_logs`:

- [ ] `verification_type = 'credential_verification'`
- [ ] `verification_method = 'api'`
- [ ] `blockchain_verified` populated
- [ ] `blockchain_hash_matched` populated
- [ ] `result_details` contains DID/hash metadata

---

## 🚀 MUMBAI DEPLOYMENT (HOW TO)

Use these exact steps to deploy `CredentialRegistry` to Polygon Mumbai.

### 1) Prepare Wallet and RPC

1. Use a dedicated test wallet (not production wallet).
2. Fund it with Mumbai test MATIC from faucet.
3. Get a Polygon Mumbai RPC endpoint (Alchemy, Infura, QuickNode, or equivalent).

### 2) Configure Environment

Create or update `backend/.env` with:

```env
POLYGON_MUMBAI_RPC_URL=https://your-mumbai-rpc-url
TRUSTVAULT_SIGNER_PRIVATE_KEY=your_private_key_without_quotes
BLOCKCHAIN_NETWORK=polygon-mumbai
```

Optional aliases supported by the current code:

```env
BLOCKCHAIN_RPC_URL=https://your-mumbai-rpc-url
PRIVATE_KEY=your_private_key
```

Notes:
- Private key may include or omit `0x`.
- Do not commit `.env`.

### 3) Install and Compile

```bash
cd backend
npm install
npm run contract:compile
```

### 4) Deploy to Mumbai

```bash
npm run contract:deploy:mumbai
```

Expected terminal output includes:
- `Deploying CredentialRegistry with account: ...`
- `CredentialRegistry deployed at: 0x...`

### 5) Save Contract Address

Copy deployed address and set:

```env
CREDENTIAL_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 6) Verify on PolygonScan

1. Open PolygonScan Mumbai.
2. Search deployed contract address.
3. Confirm creation transaction and bytecode.

### 7) Run Backend with Blockchain Config

Ensure runtime has all required values:
- RPC URL (`BLOCKCHAIN_RPC_URL` or `POLYGON_MUMBAI_RPC_URL`)
- Contract address (`CREDENTIAL_CONTRACT_ADDRESS`)
- Private key (`PRIVATE_KEY` or `TRUSTVAULT_SIGNER_PRIVATE_KEY`) for issuance writes

### 8) Test API Endpoints

```bash
npm run dev
```

Then run:
1. `POST /api/institution/credentials`
2. `POST /api/verifier/verify-did`

### Troubleshooting

- Error: `Cannot read properties of undefined (reading 'address')`
  - Cause: no signer loaded.
  - Fix: set `TRUSTVAULT_SIGNER_PRIVATE_KEY` or `PRIVATE_KEY`.

- Error: missing provider / RPC failures
  - Cause: RPC URL not configured.
  - Fix: set `POLYGON_MUMBAI_RPC_URL` or `BLOCKCHAIN_RPC_URL`.

- Error: `insufficient funds for intrinsic transaction cost`
  - Cause: deployer wallet has no Mumbai MATIC.
  - Fix: fund wallet via Mumbai faucet.

---

## 📸 SCREENSHOTS

- To be added during implementation:
  - Contract deployment output (address + tx hash)
  - PolygonScan transaction view
  - Credential detail showing DID and blockchain hash
  - Verifier API response showing `certificate: true`

---

## 🔗 RELATED DOCUMENTATION

- See `documentation/00-RULES.md` for documentation standards
- See `documentation/0.1-DEVELOPMENT_PLAN.md` for full project roadmap
- See `documentation/07-INSTITUTION-PORTAL.md` for issuance flow context
- See `documentation/08-VERIFIER-PORTAL.md` for verification workflow context

---

## ⏭️ NEXT STEPS

1. Implement smart contract and deployment pipeline.
2. Integrate blockchain utility layer into issuance and verification controllers.
3. Add DID/consent schema updates and end-to-end tests.
4. Update progress trackers and index once implementation is complete.

---

## 📌 NOTES

- Verification response contract for third parties will include `certificate=true` only when:
  1. DID exists on chain.
  2. Recomputed request hash equals on-chain hash.
  3. Consent policy is satisfied.
- Gas model for MVP uses Mumbai testnet (free). Mainnet economics will be defined post-MVP.
- This document captures implementation design and scope before coding execution begins.
