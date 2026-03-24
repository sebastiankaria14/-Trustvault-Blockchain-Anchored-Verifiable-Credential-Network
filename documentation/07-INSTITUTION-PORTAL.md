# 07 - INSTITUTION PORTAL (PHASE 4)

**Date:** 2026-03-24
**Status:** ✅ Complete
**Progress:** 67% (4/6 phases)

---

## 📋 Overview

Phase 4 implements the **Institution Portal** - a comprehensive credential management system for institutions to issue digital credentials to users, manage issued credentials, revoke them, and track issuance history with photo/document support.

---

## 🎯 Features Implemented

### 1. **Dashboard** (`InstitutionDashboard.jsx`)
- **Statistics Cards**:
  - Total Credentials Issued
  - Total Users Served
  - Credentials Issued Last 30 Days
  - Credentials Expiring Soon
- **Recent Credentials Table**: Quick view of last 5 issued credentials with user email
- **Sidebar Navigation**: Easy access to all institution portal features
- **Real-time Data**: Fetches stats from backend API
- **Loading States**: Displays loading indicator while fetching data

### 2. **Issue Credential** (`IssueCredentialPage.jsx`)
- **Credential Form Fields**:
  - Recipient Email (autocomplete with existing users)
  - Credential Type (degree, certificate, etc.)
  - Credential Name
  - Description (optional)
  - Issue Date
  - Expiry Date (optional)
  - Lifetime Validity Checkbox (disables expiry date when selected)
  - Document/Photo Upload (up to 2MB, base64 encoded)
- **File Upload Integration**:
  - Accepts image files (PNG, JPG, etc.)
  - File size validation (max 2MB)
  - Base64 encoding for database storage
  - Image preview display
  - Dashed border upload area
- **Conditional Field Rendering**: Expiry date disabled when lifetime validity is selected
- **Success/Error Messages**: Feedback on credential issuance
- **Duplicate Prevention**: Prevents issuing same credential twice to same user

### 3. **Manage Credentials** (`ManageCredentialsPage.jsx`)
- **Credentials Table**: Display all credentials issued by institution
  - Credential Name
  - Recipient Email
  - Status Badge (Active/Revoked)
  - Created Date
  - Actions
- **Search Functionality**: Search by credential name or user email
- **Status Filter**: Filter credentials by active/revoked status
- **Revoke Button**: One-click revocation of active credentials
- **Revoke Confirmation**: Confirmation dialog before revoking
- **Automatic Refresh**: Table updates after revoke action

### 4. **History** (`HistoryPage.jsx`)
- **Timeline View**: Chronological list of all issued credentials
- **Credential Details**: Credential name, recipient email, status, timestamp
- **Status Badges**: Color-coded status indicators (green for active, gray for revoked)
- **Formatted Timestamps**: Human-readable date/time format
- **Empty State**: Helpful message when no credentials issued yet
- **Recent First**: Displays most recent credentials first (up to 50)

---

## 🔧 Backend Implementation

### API Routes (`/api/institution/`)

```
GET    /institution/dashboard/stats   - Get dashboard statistics & recent credentials
POST   /institution/credentials        - Issue new credential to user
GET    /institution/credentials        - Get all credentials issued by institution
DELETE /institution/credentials/:id    - Revoke a credential
GET    /institution/history            - Get credential issuance history
```

### Controllers (`institutionController.js`)

- `getInstitutionStats()` - Calculate and return dashboard statistics with recent credentials
- `issueCredential()` - Create and issue new credential with document URL support
- `getInstitutionCredentials()` - Fetch all credentials with user details
- `revokeCredential()` - Revoke credential (change status to 'revoked')
- `getInstitutionHistory()` - Get credential issuance history timeline

### Key Business Logic

#### Issue Credential Flow:
1. Validate recipient email exists in users table
2. Check for duplicate issuance (same credential name to same user)
3. Create credential_data JSONB object with all details
4. Insert credential with all fields including document_url
5. Return created credential with ID

#### Revoke Credential Flow:
1. Verify credential belongs to requesting institution
2. Update status to 'revoked' and set revoked_at timestamp
3. Store revoke reason

### Database Integration

Tables used:
- `credentials` - Main credential storage (modified to support document_url as TEXT)
- `users` - User lookup by email
- `institutions` - Institution data (implied via auth context)

---

## 🎨 Frontend Components

### Shared Sidebar Navigation
- Dashboard link
- Issue Credential link
- Manage Credentials link
- History link
- Logout button

All pages use consistent sidebar (fixed left 64px) + main content (ml-64) layout with blue-900 sidebar theme.

### API Service Functions (`api.js`)

New functions added:
- `getInstitutionStats()` - GET /institution/dashboard/stats
- `issueCredential(credentialData)` - POST /institution/credentials
- `getInstitutionCredentials()` - GET /institution/credentials
- `revokeCredential(credentialId)` - DELETE /institution/credentials/{id}
- `getInstitutionHistory()` - GET /institution/history

### Styling & UX

- **Tailwind CSS**: Utility-first styling
- **Sidebar Design**: Fixed left sidebar with top navigation links
- **Status Colors**:
  - Active: Green (#10b981)
  - Revoked: Gray (#6b7280)
- **Forms**: Clean form layout with labeled inputs and validation
- **File Upload**: Dashed border area with drag-drop indication
- **Tables**: Responsive table with hover effects
- **Loading States**: Loading text with animation
- **Empty States**: Helpful messages when no data available
- **Success/Error Messages**: Toast-style notifications

---

## 🗂️ Files Created/Modified

### Backend
```
✅ backend/src/controllers/institutionController.js  [NEW - 223 lines]
✅ backend/src/routes/institutionRoutes.js           [NEW - 27 lines]
✅ backend/src/server.js                            [MODIFIED - registered routes, increased body limits]
✅ backend/scripts/migrate-document-url-column.js   [NEW - database migration]
```

### Frontend
```
✅ frontend/src/pages/institution/InstitutionDashboard.jsx      [NEW - 141 lines]
✅ frontend/src/pages/institution/IssueCredentialPage.jsx       [NEW - 226 lines]
✅ frontend/src/pages/institution/ManageCredentialsPage.jsx     [NEW - 251 lines]
✅ frontend/src/pages/institution/HistoryPage.jsx              [NEW - 85 lines]
✅ frontend/src/services/api.js                                 [MODIFIED - added 5 functions]
✅ frontend/src/App.jsx                                         [MODIFIED - added 4 new routes]
```

### Database
```
✅ Database migration to change document_url from VARCHAR(500) to TEXT
```

### Documentation
```
✅ documentation/07-INSTITUTION-PORTAL.md                        [NEW - this file]
```

**Total New Lines of Code**: ~950 lines

---

## 🚀 How to Use

### 1. Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 3. Test the Features

**Login as Institution:**
- Email: `harvard@institution.com` (or any institution account)
- Password: `Institution123`

**Access Institution Pages:**
- Dashboard: `http://localhost:3000/institution/dashboard`
- Issue Credential: `http://localhost:3000/institution/issue`
- Manage Credentials: `http://localhost:3000/institution/manage`
- History: `http://localhost:3000/institution/history`

### 4. Test Photo Upload Feature

**Issue Credential with Photo:**
1. Navigate to `/institution/issue`
2. Fill in recipient email (e.g., test@example.com)
3. Select credential type (degree, certificate, etc.)
4. Enter credential name and description
5. Set issue date
6. **Optional**: Check "Lifetime Validity" to skip expiry date
7. **Click upload area** or drop a photo to upload (max 2MB)
8. Click "Issue Credential"
9. View issued credential in "Manage Credentials" page

**View Photo in User's Wallet:**
1. Login as recipient user
2. Go to `/user/wallet`
3. Click on the credential
4. Photo displays in "Document / Certificate Photo" section

---

## 🔐 Authentication

All endpoints require:
- Valid JWT token in `Authorization` header
- User type must be `'institution'` (not user or verifier)
- Token attached automatically via `authenticate` middleware

---

## 📊 Database Schema

### credentials table (modified for Phase 4)
```sql
- id (UUID)
- user_id (UUID) - References users table
- institution_id (UUID) - References institutions table
- credential_type (VARCHAR) - degree, certificate, etc.
- credential_name (VARCHAR) - Display name
- description (TEXT) - Optional description
- credential_data (JSONB) - Full credential details (required)
- issue_date (DATE) - When issued
- expiry_date (DATE, nullable) - When expires (null for lifetime)
- status (VARCHAR) - active, revoked, expired, pending
- blockchain_hash (VARCHAR, nullable) - For blockchain integration
- document_url (TEXT) - Base64-encoded document/photo (EXPANDED from VARCHAR(500))
- created_at, updated_at (TIMESTAMP)
- revoked_at (TIMESTAMP, nullable) - When revoked
- revoke_reason (VARCHAR, nullable) - Why revoked
```

**Key Changes:**
- `document_url` changed from `VARCHAR(500)` to `TEXT` (unlimited size)
- Added `credential_data` JSONB field (required)
- Added `revoked_at` and `revoke_reason` fields

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Dashboard loads with statistics
- [ ] Recent credentials display in dashboard
- [ ] Issue Credential form renders all fields
- [ ] File upload accepts images up to 2MB
- [ ] File upload rejects files over 2MB
- [ ] Lifetime validity checkbox disables expiry date
- [ ] Issuing credential with photo succeeds
- [ ] Successfully issued credential appears in Manage page
- [ ] Photo displays in user wallet
- [ ] Manage Credentials table displays all issued credentials
- [ ] Search filters credentials by name/email
- [ ] Status filter works (active, revoked)
- [ ] Revoke button successfully revokes credential
- [ ] Revoked credential status changes to 'revoked'
- [ ] History page shows chronological list
- [ ] History shows only institution's credentials
- [ ] Sidebar navigation works on all pages
- [ ] Logout button works
- [ ] API calls include token in header
- [ ] Non-institutions cannot access these routes
- [ ] Empty states display when no data

---

## 🔄 API Flow

```
Institution Login
    ↓
Receive JWT Token (user_type = 'institution')
    ↓
Navigate to Dashboard
    ↓
GET /institution/dashboard/stats (with token)
    ↓
Display Statistics & Recent Credentials
    ↓
Click "Issue Credential"
    ↓
Fill form with recipient email, credential details, photo
    ↓
Click "Issue Credential"
    ↓
POST /institution/credentials {recipientEmail, credentialType, credentialName, description, issueDate, expiryDate, documentUrl} (with token)
    ↓
Backend finds user by email, validates, inserts credential with base64 photo
    ↓
Success message displays
    ↓
Click "Manage Credentials"
    ↓
GET /institution/credentials (with token)
    ↓
Display all issued credentials in table
    ↓
Click revoke button on credential
    ↓
DELETE /institution/credentials/{id} (with token)
    ↓
Backend verifies ownership, updates status to 'revoked'
    ↓
Credential status updates in table
    ↓
Click "History"
    ↓
GET /institution/history (with token)
    ↓
Display timeline of all issuances
```

---

## 🐛 Issues Fixed During Implementation

### Issue 1: Database Column Size Exceeded
**Error**: `value too long for type character varying(500)`
**Cause**: Base64-encoded images (~2.7MB from 2MB binary) exceeded VARCHAR(500) limit
**Fix**: Migrated `document_url` column to TEXT type (unlimited)

### Issue 2: Missing credential_data Field
**Error**: `null value in column "credential_data" violates not-null constraint`
**Cause**: issueCredential function didn't populate required credential_data JSONB field
**Fix**: Created credential_data object with all details and passed as JSON.stringify()

### Issue 3: Body Too Large (413 Error)
**Error**: `Payload Too Large - 413`
**Cause**: Base64 images exceeded Express default request body limit (100KB)
**Fix**: Increased express.json() and express.urlencoded() limits to 10MB in server.js

---

## 📝 Key Design Decisions

1. **Base64 Image Storage**: Images encoded to base64 and stored directly in database
   - Pro: Simple implementation, works immediately
   - Con: Not ideal for production (should use S3/object storage)

2. **Lifetime Validity Checkbox**: Disables expiry date field when selected
   - Allows credentials with no expiration date
   - Null expiryDate in database indicates lifetime credential

3. **Duplicate Prevention**: Prevents issuing same credential name to same user from same institution
   - Prevents accidental duplicates
   - Useful for recurring credential types

4. **Status Changes**: Uses UPDATE instead of DELETE for revocation
   - Maintains audit trail
   - Allows reversal if needed (future enhancement)

5. **Sidebar-based Navigation**: Consistent with user portal design
   - Mobile-friendly with fixed sidebar
   - Easy to add additional pages

---

## 🎓 Learning Points

### React Concepts Used
- `useState` - Component state management
- `useEffect` - Data fetching on component mount
- `useAuth` - Custom hook for auth context
- `useNavigate` - Programmatic navigation
- FileReader API - Reading uploaded files
- Base64 encoding - Converting binary to text

### File Handling in React
```javascript
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    setFormData(prev => ({
      ...prev,
      documentUrl: event.target.result  // Base64 data URL
    }));
  };
  reader.readAsDataURL(file);  // Converts to base64
};
```

### Conditional Form Fields
```javascript
{/* Expiry date disabled when lifetime is true */}
<input
  type="date"
  name="expiryDate"
  disabled={formData.lifetime}
  value={formData.expiryDate}
  onChange={handleChange}
/>
```

### API Request with File Data
```javascript
const response = await issueCredential({
  ...formData,
  expiryDate: formData.lifetime ? null : formData.expiryDate,
  documentUrl: formData.documentUrl  // Base64 string (2-3MB)
});
```

### Database Migration Scripts
```javascript
// Run migration to alter column type
await client.query(`
  ALTER TABLE credentials
  ALTER COLUMN document_url SET DATA TYPE TEXT;
`);
```

---

## 🔮 Future Enhancements (Phase 5+)

- **Verifier Portal**: Allow external verifiers to check credentials
- **Cloud Storage**: Move from base64 to AWS S3 / Google Cloud Storage
- **Batch Issuance**: Upload CSV to issue multiple credentials at once
- **Email Notifications**: Send credential issued/revoked notifications
- **QR Codes**: Generate QR codes linking to credential verification
- **Blockchain Integration**: Anchor credentials on blockchain
- **Digital Signatures**: Enable credential signing
- **Credential Templates**: Pre-built credential types with mandatory fields
- **API Keys**: Allow institutions to issue credentials via API
- **Webhooks**: Notify third parties of credential events

---

## 🔧 Technical Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT with Bearer tokens
- **Middleware**: express.json, express.urlencoded, helmet, cors, rate-limiting

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios/Fetch with token injection
- **File Handling**: FileReader API, base64 encoding
- **State Management**: useAuth context hook

### Database
- **Type**: PostgreSQL 12+
- **Platform**: Supabase (managed PostgreSQL)
- **Column Types**: UUID, VARCHAR, TEXT, DATE, TIMESTAMP, JSONB, BOOLEAN

---

## 📞 Support & Troubleshooting

### Issue: Photo appears too large when uploaded
- Solution: Compress image before uploading (use online tools or image editing software)
- Limit: Maximum 2MB file size enforced

### Issue: "User not found with this email"
- Check: Email must exist in users table (user must be registered)
- Solution: Ensure recipient has account in TrustVault

### Issue: "This credential has already been issued to this user"
- Cause: Same credential_name already issued from this institution to this user
- Solution: Use different credential name or revoke previous one first

### Issue: Backend not connecting to database
- Check: DATABASE_URL in .env file
- Check: Supabase project is running and accessible
- Check: Network allows connection to Supabase

### Issue: Photos not displaying in user wallet
- Check: User is logged in with correct account
- Check: Institution that issued has sent document_url (base64 data)
- Check: Frontend CredentialDetailPage.jsx has photo display code

---

## 📁 File Structure Summary

```
backend/
├── src/
│   ├── controllers/
│   │   ├── institutionController.js  [NEW]
│   │   └── ...other controllers
│   ├── routes/
│   │   ├── institutionRoutes.js      [NEW]
│   │   └── ...other routes
│   ├── middleware/
│   ├── utils/
│   └── server.js                     [MODIFIED]
├── scripts/
│   └── migrate-document-url-column.js [NEW]
└── database/
    └── migrations/

frontend/
├── src/
│   ├── pages/
│   │   └── institution/              [NEW FOLDER]
│   │       ├── InstitutionDashboard.jsx
│   │       ├── IssueCredentialPage.jsx
│   │       ├── ManageCredentialsPage.jsx
│   │       └── HistoryPage.jsx
│   ├── services/
│   │   └── api.js                    [MODIFIED]
│   ├── context/
│   ├── App.jsx                       [MODIFIED]
│   └── ...other files

documentation/
└── 07-INSTITUTION-PORTAL.md          [NEW - this file]
```

---

## ✅ Phase 4 Status: COMPLETE

**Completed Features:**
- ✅ Institution Dashboard with statistics
- ✅ Credential Issuance with form validation
- ✅ Photo/Document Upload with base64 encoding
- ✅ Lifetime Validity Option
- ✅ Credential Management
- ✅ Credential Revocation
- ✅ Issuance History Timeline
- ✅ Integration with User Wallet
- ✅ Database Schema Updates
- ✅ API Endpoints
- ✅ Error Handling & Validation
- ✅ Authentication & Authorization

**Total Development Time**: Single session
**Total Code Added**: ~950 new lines
**Database Migrations**: 1 (document_url column type change)

---

**Next Phase: Phase 5 - Verifier Portal** (Credential Verification & Access Control)

For updates or issues, refer to backend logs and frontend console (F12 Developer Tools).
