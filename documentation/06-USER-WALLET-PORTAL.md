# 06 - USER WALLET PORTAL (PHASE 3)

**Date:** 2026-03-24
**Status:** ✅ Complete
**Progress:** 50% (3/6 phases)

---

## 📋 Overview

Phase 3 implements the **User Wallet Portal** - a complete credential management system where users can view, manage, download, and track access to their digital credentials.

---

## 🎯 Features Implemented

### 1. **Dashboard** (`UserDashboard.jsx`)
- **Stats Cards**: Total, Active, Pending, and Recently Verified credentials
- **Recent Credentials**: Quick view of last 5 credentials
- **Quick Actions**: KYC verification and audit log shortcuts
- **Sidebar Navigation**: Easy access to all user portal features
- **Real-time Data**: Fetches stats from backend API

### 2. **Wallet** (`WalletPage.jsx`)
- **Credential Grid**: Display all user credentials as beautiful cards
- **Search & Filter**: Search by name/issuer and filter by status
- **Status Badges**: Visual indicators (Active, Pending, Expired, Revoked)
- **Credential Icons**: Different icons for degree, certificate, employment
- **Issue Date**: Display when credential was issued
- **Click to Details**: Navigate to full credential details

### 3. **Credential Details** (`CredentialDetailPage.jsx`)
- **Three Tabs**:
  - **Details**: Full credential information, issue date, expiry, blockchain hash
  - **Issuer Info**: Institution details, contact info, website
  - **History**: Verification logs showing who accessed the credential
- **Quick Actions**: Download PDF and Share buttons
- **Status Display**: Current credential status with visual badge
- **Verification History**: Complete audit trail of all verifications

### 4. **Profile Management** (`ProfilePage.jsx`)
- **Edit Profile**: Update firstName, lastName, phone, dateOfBirth
- **KYC Status**: Display current verification status
- **Email Display**: Read-only email field (cannot be changed)
- **Success Messages**: Feedback on profile updates
- **Future Features**: Change password and delete account placeholders

### 5. **Audit Log** (`AuditLogPage.jsx`)
- **Activity Timeline**: Chronological list of all credential access
- **Action Types**: Verified, Viewed, Downloaded with color-coded icons
- **Verifier Info**: Show which organization accessed credentials
- **Action Details**: Action type and credential name with verification result
- **IP Address**: Log IP addresses for security audit
- **Filter Options**: Filter by action type (All, Verified, Viewed, Downloaded)

---

## 🔧 Backend Implementation

### API Routes (`/api/user/`)

```
GET    /user/dashboard/stats        - Get dashboard statistics
GET    /user/credentials             - Get all user credentials
GET    /user/credentials/:id         - Get specific credential
GET    /user/credentials/:id/logs    - Get verification history
GET    /user/audit-log               - Get full audit log
GET    /user/profile                 - Get user profile
PUT    /user/profile                 - Update profile
```

### Controllers (`credentialController.js`)

- `getUserCredentials()` - Fetch all credentials with issuer info
- `getCredentialById()` - Get single credential with full details
- `getCredentialLogs()` - Get verification logs for credential
- `getUserAuditLog()` - Get complete audit trail for user
- `getDashboardStats()` - Calculate and return dashboard statistics
- `getProfile()` - Fetch user profile
- `updateProfile()` - Update user information

### Database Integration

Tables used:
- `credentials` - Main credential storage
- `verification_logs` - Audit trail of all access
- `institutions` - Issuer information (joined)
- `verifiers` - Verifier information (joined)
- `users` - User profile data

---

## 🎨 Frontend Components

### Shared Sidebar Navigation
- Dashboard link
- My Wallet link
- Audit Log link
- Profile link
- Logout button

All pages use consistent sidebar + main content layout.

### API Service Functions (`api.js`)

New functions added:
- `getDashboardStats()`
- `getUserCredentials()`
- `getCredentialById(id)`
- `getCredentialLogs(id)`
- `getUserAuditLog()`
- `getUserProfile()`
- `updateUserProfile(profileData)`

### Styling & UX

- **Tailwind CSS**: Utility-first styling
- **Icons**: SVG icons from Heroicons
- **Status Colors**:
  - Active: Green (#10b981)
  - Pending: Yellow (#f59e0b)
  - Expired: Red (#ef4444)
  - Revoked: Gray (#6b7280)
- **Loading States**: Skeleton loaders with animation
- **Empty States**: Helpful messages when no data
- **Responsive Design**: Works on mobile, tablet, desktop

---

## 🗂️ Files Created/Modified

### Backend
```
✅ backend/src/controllers/credentialController.js  [NEW - 311 lines]
✅ backend/src/routes/userRoutes.js                 [NEW - 42 lines]
✅ backend/src/server.js                            [MODIFIED - added route]
✅ backend/database/migrate.js                      [NEW - migration script]
✅ backend/database/migrations/03_credentials_tables.sql [NEW - schema]
```

### Frontend
```
✅ frontend/src/pages/user/UserDashboard.jsx        [MODIFIED - full rewrite]
✅ frontend/src/pages/user/WalletPage.jsx           [NEW - 297 lines]
✅ frontend/src/pages/user/CredentialDetailPage.jsx [NEW - 354 lines]
✅ frontend/src/pages/user/ProfilePage.jsx          [NEW - 264 lines]
✅ frontend/src/pages/user/AuditLogPage.jsx         [NEW - 280 lines]
✅ frontend/src/services/api.js                     [MODIFIED - added 8 functions]
✅ frontend/src/App.jsx                             [MODIFIED - added 4 new routes]
```

### Documentation
```
✅ documentation/06-USER-WALLET-PORTAL.md           [NEW - this file]
```

**Total New Lines of Code**: ~1,800 lines

---

## 🚀 How to Use

### 1. Start Backend
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 3. Test the Features

**Login as User:**
- Email: `test@example.com` (or any user you registered)
- Password: `Test1234`

**Access User Pages:**
- Dashboard: `http://localhost:3000/user/dashboard`
- Wallet: `http://localhost:3000/user/wallet`
- Audit Log: `http://localhost:3000/user/audit-log`
- Profile: `http://localhost:3000/user/profile`
- Credential Detail: `http://localhost:3000/user/credentials/{id}`

---

## 🔐 Authentication

All endpoints require:
- Valid JWT token in `Authorization` header
- User type must be `'user'` (not institution or verifier)
- Token attached automatically via `authenticate` middleware

---

## 📊 Database Schema

### credentials table
```sql
- id (UUID)
- user_id (UUID) - References users table
- institution_id (UUID) - References institutions table
- credential_type (VARCHAR) - degree, certificate, license, employment, etc.
- credential_name (VARCHAR) - Display name
- credential_data (JSONB) - Full credential details
- status (VARCHAR) - active, pending, expired, revoked
- issue_date (DATE) - When issued
- expiry_date (DATE, nullable)
- blockchain_hash (VARCHAR, nullable) - For blockchain integration
- created_at, updated_at (TIMESTAMP)
```

### verification_logs table
```sql
- id (UUID)
- credential_id (UUID) - References credentials
- verifier_id (UUID) - Which verifier accessed
- action (VARCHAR) - viewed, verified, downloaded, shared
- verification_result (VARCHAR) - success, failed, expired
- ip_address (VARCHAR, nullable)
- user_agent (TEXT, nullable)
- timestamp (TIMESTAMP)
```

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Dashboard loads with statistics
- [ ] Wallet displays all credentials
- [ ] Search filters credentials by name
- [ ] Status filter works (active, pending, etc.)
- [ ] Clicking credential opens detail page
- [ ] Detail page shows tabs: Details, Issuer, History
- [ ] Download PDF button works
- [ ] Share button functional
- [ ] Profile page loads user data
- [ ] Profile page updates work
- [ ] Audit log shows verification history
- [ ] Sidebar navigation works on all pages
- [ ] Logout button works
- [ ] API calls include token in header
- [ ] Empty states display when no data

---

## 🔄 API Flow

```
User Login
    ↓
Receive JWT Token
    ↓
Navigate to Dashboard
    ↓
GET /user/dashboard/stats (with token)
    ↓
Display Statistics & Recent Credentials
    ↓
Click "My Wallet"
    ↓
GET /user/credentials (with token)
    ↓
Display All Credentials in Grid
    ↓
Click Credential Card
    ↓
GET /user/credentials/{id} + GET /user/credentials/{id}/logs
    ↓
Display Details & Verification History
    ↓
Click "Audit Log"
    ↓
GET /user/audit-log (with token)
    ↓
Display Complete Activity Timeline
```

---

## 📝 Key Design Decisions

1. **Sidebar Navigation**: Consistent navigation across all user pages
2. **Tab Interface**: Credential details organized in tabs for clarity
3. **Real-time Data**: All data fetched from API, not hardcoded
4. **Empty States**: Helpful messages when user has no credentials
5. **Loading Skeletons**: Better UX than spinners for data loading
6. **Color Coding**: Status shown via color for quick scanning
7. **Breadcrumbs**: Back buttons for easy navigation

---

## 🎓 Learning Points

### React Hooks Used
- `useState` - Component state management
- `useEffect` - Data fetching on component mount
- `useParams` - Get URL parameters (credential ID)
- `useNavigate` - Programmatic navigation
- `useAuth` - Custom hook for auth context

### API Patterns
- Authorization header with JWT token
- Error handling with try/catch
- Loading states during data fetch
- Empty state handling

### Styling Patterns
- Tailwind utility classes
- Flex & Grid layouts
- Responsive design (md: breakpoints)
- Color states for badge/status

---

## 🔮 Future Enhancements (Phase 4+)

- KYC verification workflow
- Credential issuance (Institution Side)
- Verification workflow (Verifier Side)
- Blockchain integration
- Email notifications
- Two-factor authentication
- Advanced search filters
- Export credentials
- Credential sharing links

---

## 📞 Support

For issues or questions about Phase 3:
1. Check the console errors (F12)
2. Verify backend is running on port 5000
3. Verify frontend is running on port 3000
4. Check database connection in backend logs
5. Ensure JWT token is valid (not expired)

---

**Phase 3 Status**: ✅ **COMPLETE**

Next Phase: **Phase 4 - Institution Portal** (Credential Issuance)
