# TrustVault - Comprehensive Testing Checklist

## Phase 5 Complete Testing Document
**Created:** 2024
**Purpose:** Test all 3 portals and every feature thoroughly

---

## 🔧 PRE-TESTING SETUP

### Start Services
- [ ] Backend: `cd backend && npm start` (should show "Server running on port 5000")
- [ ] Frontend: `cd frontend && npm run dev` (should show localhost URL)
- [ ] Verify database connection (no errors in backend console)

### Test Accounts to Use
| Portal | Email | Password | Notes |
|--------|-------|----------|-------|
| User | user@example.com | Test@123 | Regular user with credentials |
| Verifier | verifier@example.com | Test@123 | Company/org verifier |
| Institution | institution@example.com | Test@123 | Credential issuer |

---

## 📱 USER PORTAL TESTING

### 1. Authentication
- [ ] **Login Page** (`/login`)
  - [ ] Can access login page
  - [ ] Form validates empty fields
  - [ ] Shows error for wrong credentials
  - [ ] Successful login redirects to user dashboard
  - [ ] JWT token is stored in localStorage

- [ ] **Registration** (`/register`)
  - [ ] Can access registration page
  - [ ] Form validates required fields
  - [ ] Password strength requirements work
  - [ ] Successful registration creates account
  - [ ] Can login with new account

### 2. User Dashboard (`/user/dashboard`)
- [ ] Dashboard loads without errors
- [ ] Shows correct statistics:
  - [ ] Total credentials count
  - [ ] Active credentials count
  - [ ] Pending credentials count
  - [ ] Expired credentials count
  - [ ] Recent verifications count
- [ ] Shows recent credentials list
- [ ] Navigation sidebar works

### 3. Wallet/Credentials (`/user/wallet`)
- [ ] Credentials list loads
- [ ] Shows credential cards with:
  - [ ] Credential name
  - [ ] Type
  - [ ] Issuer name
  - [ ] Status badge (active/pending/expired/revoked)
  - [ ] Issue date
- [ ] Search functionality works
- [ ] Filter by type works
- [ ] Pagination works (if more than 10 credentials)

### 4. Credential Detail Page (`/user/wallet/:id`)
- [ ] Page loads without errors
- [ ] **Details Tab:**
  - [ ] Shows credential number
  - [ ] Shows issue date
  - [ ] Shows expiry date
  - [ ] Shows blockchain hash (if available)
  - [ ] Shows description
  - [ ] Shows additional data (JSON)
- [ ] **Issuer Info Tab:**
  - [ ] Shows issuer name
  - [ ] Shows issuer type
  - [ ] Shows issuer email
  - [ ] Shows issuer phone
  - [ ] Shows issuer website
- [ ] **Verification History Tab:** ⭐ (NEW - Important!)
  - [ ] Shows list of verifications
  - [ ] Each verification shows:
    - [ ] Verifier name
    - [ ] Status badge ("✓ Authentic" or "✗ Fake")
    - [ ] Verifier industry
    - [ ] Verification date/time
    - [ ] Comments (if any)
  - [ ] Empty state shows correctly when no verifications
- [ ] Download PDF button works
- [ ] Share button works

### 5. Audit Log (`/user/audit-log`)
- [ ] Audit log page loads
- [ ] Shows all verification activities
- [ ] Each log entry shows:
  - [ ] Credential name
  - [ ] Verifier name
  - [ ] Action type
  - [ ] Date/time
  - [ ] Result (authentic/fake)
- [ ] Empty state shows correctly

### 6. User Profile (`/user/profile`)
- [ ] Profile page loads
- [ ] Shows user information:
  - [ ] First name
  - [ ] Last name
  - [ ] Email
  - [ ] Phone
  - [ ] Date of birth
  - [ ] KYC status
- [ ] Can edit profile fields
- [ ] Save button updates profile
- [ ] Success message shows after save

### 7. Logout
- [ ] Logout button works
- [ ] Clears JWT token
- [ ] Redirects to login page
- [ ] Cannot access dashboard after logout

---

## ✅ VERIFIER PORTAL TESTING

### 1. Authentication
- [ ] **Login** with verifier account
  - [ ] Login page accessible
  - [ ] Successful login as verifier
  - [ ] Redirects to verifier dashboard

- [ ] **Registration** (`/register/verifier`)
  - [ ] Verifier registration page loads
  - [ ] Company name field works
  - [ ] Industry dropdown works
  - [ ] Registration creates verifier account

### 2. Verifier Dashboard (`/verifier/dashboard`)
- [ ] Dashboard loads without errors
- [ ] Shows correct statistics:
  - [ ] Total verified count
  - [ ] Today's verifications count
  - [ ] Authentic count
  - [ ] Fake count
  - [ ] Pending requests count
- [ ] Shows recent verifications list
- [ ] Shows verifier company info
- [ ] Quick action buttons work

### 3. Verification Requests (`/verifier/verification-requests`)
- [ ] Page loads without errors
- [ ] Shows credentials shared with this verifier
- [ ] Each request shows:
  - [ ] User name
  - [ ] Credential name
  - [ ] Credential type
  - [ ] Issuer name
  - [ ] **Status (pending/verified/rejected)** ⭐
  - [ ] Shared date
- [ ] Search by user name/email works
- [ ] Filter by status works:
  - [ ] "All" shows all
  - [ ] "Pending" shows only pending
  - [ ] "Verified" shows only verified
  - [ ] "Rejected" shows only rejected
- [ ] Pagination works
- [ ] Click on credential opens detail page

### 4. Verification Detail Page (`/verifier/verify/:id`)
- [ ] Page loads without errors
- [ ] **Details Tab:**
  - [ ] Shows credential number
  - [ ] Shows credential name
  - [ ] Shows credential type
  - [ ] Shows issue date
  - [ ] Shows expiry date
  - [ ] Shows description
  - [ ] Shows additional data
- [ ] **Issuer Info Tab:**
  - [ ] Shows issuer name
  - [ ] Shows issuer type
  - [ ] Shows issuer email
  - [ ] Shows issuer website
- [ ] **Verify Tab:**
  - [ ] Can select "Authentic" option
  - [ ] Can select "Fake" option
  - [ ] Can add comments (optional)
  - [ ] Submit verification button works
  - [ ] Success message shows after submission
  - [ ] Redirects to requests page

### 5. Verification Flow Test ⭐ (CRITICAL)
1. [ ] Go to Verification Requests
2. [ ] Click on a "pending" credential
3. [ ] Go to "Verify" tab
4. [ ] Select "Authentic" or "Fake"
5. [ ] Add a comment
6. [ ] Click "Submit Verification"
7. [ ] Verify success message appears
8. [ ] Go to Verification Requests
9. [ ] **Verify status changed from "pending" to "verified" or "rejected"**
10. [ ] Go to Verification History
11. [ ] **Verify the verification appears in history**

### 6. Verification History (`/verifier/history`)
- [ ] Page loads without errors
- [ ] Shows timeline of verifications
- [ ] Each entry shows:
  - [ ] Credential name
  - [ ] Credential type
  - [ ] User name
  - [ ] User email
  - [ ] Verification result (authentic/fake)
  - [ ] Comments
  - [ ] Date/time
- [ ] Filter by result works:
  - [ ] "All" shows all
  - [ ] "Authentic" shows only authentic
  - [ ] "Fake" shows only fake
- [ ] Pagination works
- [ ] Empty state shows correctly

### 7. Verifier Profile (`/verifier/profile`)
- [ ] Profile page loads
- [ ] Shows verifier information:
  - [ ] Company name
  - [ ] Industry
  - [ ] Contact email
  - [ ] Phone
  - [ ] Website
- [ ] Can edit fields
- [ ] Save button works
- [ ] Success message shows

### 8. Logout
- [ ] Logout works
- [ ] Redirects to login

---

## 🏛️ INSTITUTION PORTAL TESTING

### 1. Authentication
- [ ] **Login** with institution account
  - [ ] Successful login
  - [ ] Redirects to institution dashboard

- [ ] **Registration** (if available)
  - [ ] Institution registration works
  - [ ] All required fields validate

### 2. Institution Dashboard (`/institution/dashboard`)
- [ ] Dashboard loads
- [ ] Shows statistics:
  - [ ] Total issued credentials
  - [ ] Active credentials
  - [ ] Pending credentials
  - [ ] Recent activities
- [ ] Navigation works

### 3. Issue Credential (`/institution/issue`)
- [ ] Issue credential page loads
- [ ] Form fields:
  - [ ] User email/ID
  - [ ] Credential type dropdown
  - [ ] Credential name
  - [ ] Description
  - [ ] Issue date
  - [ ] Expiry date (optional)
  - [ ] Additional data (JSON)
- [ ] Form validation works
- [ ] Submit creates credential
- [ ] Success message shows

### 4. Issued Credentials List (`/institution/credentials`)
- [ ] List of issued credentials loads
- [ ] Shows credential info
- [ ] Search works
- [ ] Filter by status works
- [ ] Pagination works

### 5. Credential Management
- [ ] Can view credential details
- [ ] Can revoke credential (if implemented)
- [ ] Status changes reflect correctly

### 6. Institution Profile
- [ ] Profile page loads
- [ ] Can edit institution info
- [ ] Save works

### 7. Logout
- [ ] Logout works

---

## 🔗 CROSS-PORTAL INTEGRATION TESTS ⭐

### Test 1: Institution Issues → User Receives
1. [ ] Login as Institution
2. [ ] Issue a new credential to a user
3. [ ] Logout
4. [ ] Login as that User
5. [ ] Go to Wallet
6. [ ] **Verify new credential appears**

### Test 2: User Shares → Verifier Sees
1. [ ] Login as User
2. [ ] Share a credential with a verifier (if implemented)
3. [ ] Logout
4. [ ] Login as Verifier
5. [ ] Go to Verification Requests
6. [ ] **Verify shared credential appears**

### Test 3: Verifier Verifies → User Sees Status ⭐ (CRITICAL)
1. [ ] Login as Verifier
2. [ ] Go to Verification Requests
3. [ ] Click on a pending credential
4. [ ] Verify it as "Authentic" with comments "Verified by company"
5. [ ] Logout
6. [ ] Login as the User who owns that credential
7. [ ] Go to My Wallet
8. [ ] Click on the verified credential
9. [ ] Go to "Verification History" tab
10. [ ] **Verify you can see:**
    - [ ] Verifier company name
    - [ ] "✓ Authentic" badge
    - [ ] "Verified by company" comment
    - [ ] Verification date/time

### Test 4: Multiple Verifiers
1. [ ] Have multiple verifiers verify the same credential
2. [ ] Check user sees ALL verifications in history
3. [ ] Check each has correct details

---

## 🐛 ERROR HANDLING TESTS

### API Errors
- [ ] Invalid token shows appropriate error
- [ ] Expired token redirects to login
- [ ] 404 pages show correctly
- [ ] Network errors show user-friendly message

### Edge Cases
- [ ] Empty states display correctly (no credentials, no verifications)
- [ ] Long text truncates properly
- [ ] Special characters in names/comments work
- [ ] Large numbers display correctly

---

## 📊 DATABASE VERIFICATION

After running tests, verify in database:
- [ ] `verification_logs` table has entries for verifications
- [ ] `credential_shares` table status updates after verification
- [ ] All timestamps are correct
- [ ] No orphaned records

---

## 🎯 CRITICAL TESTS SUMMARY

**Must Pass Before Release:**
1. [ ] User can see verification history ✓
2. [ ] Verifier can verify credentials ✓
3. [ ] Status updates correctly after verification ✓
4. [ ] Institution can issue credentials ✓
5. [ ] All authentication works ✓
6. [ ] Cross-portal data flows correctly ✓

---

## 📝 TESTING NOTES

**Date Tested:** _______________
**Tested By:** _______________
**Environment:** _______________

### Issues Found:
| # | Description | Portal | Severity | Status |
|---|-------------|--------|----------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Notes:
_____________________________________________
_____________________________________________
_____________________________________________

---

## ✅ SIGN-OFF

- [ ] All critical tests passed
- [ ] All portals functional
- [ ] Data flows correctly between portals
- [ ] Ready for production/next phase

**Approved By:** _______________
**Date:** _______________
