# 03 - AUTHENTICATION SYSTEM

**Date:** 2026-03-24
**Phase:** Phase 2
**Status:** ✅ Complete

---

## 📝 SUMMARY

Implemented a complete authentication system for TrustVault with user registration, login, and JWT-based authentication. The system supports three user types: Users (individuals), Institutions (credential issuers), and Verifiers (organizations that verify credentials). Database is hosted on Supabase PostgreSQL.

---

## 🎯 OBJECTIVES

- [x] Set up Supabase PostgreSQL database
- [x] Create backend authentication APIs (register, login, logout)
- [x] Implement JWT token generation and verification
- [x] Password hashing with bcrypt
- [x] Input validation with express-validator
- [x] Build frontend Login page
- [x] Build frontend Registration pages for all user types
- [x] Create Auth Context for state management
- [x] Set up protected routes
- [x] Create user dashboards for each role

---

## 🛠️ WHAT WAS DONE

### 1. Database Setup (Supabase)

- Created Supabase project in ap-southeast-2 region
- Ran database schema to create all required tables
- Configured connection pooler for reliable connections
- Tables created: users, institutions, verifiers, credentials, consent_records, verification_logs

### 2. Backend Authentication APIs

Built RESTful API endpoints for authentication:
- `POST /api/auth/register/user` - Register new user
- `POST /api/auth/register/institution` - Register new institution
- `POST /api/auth/register/verifier` - Register new verifier
- `POST /api/auth/login` - Login (all user types)
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### 3. Security Implementation

- JWT tokens with 7-day expiration
- Password hashing using bcrypt (10 salt rounds)
- Input validation on all endpoints
- Role-based access control middleware
- CORS configuration for frontend access

### 4. Frontend Authentication

- Login page with user type selector (User/Institution/Verifier)
- Registration page with tabbed forms for each user type
- Auth Context for global authentication state
- Protected routes that redirect unauthenticated users
- Dashboard pages for each user type

---

## 📂 FILES CREATED/MODIFIED

### Backend - Created:

| File | Description |
|------|-------------|
| `backend/src/utils/database.js` | Supabase PostgreSQL connection utility |
| `backend/src/utils/jwt.js` | JWT token generation and verification |
| `backend/src/utils/password.js` | Password hashing utilities |
| `backend/src/middleware/auth.js` | Authentication middleware |
| `backend/src/middleware/validation.js` | Input validation rules |
| `backend/src/controllers/authController.js` | Authentication logic |
| `backend/src/routes/authRoutes.js` | API route definitions |
| `backend/.env` | Environment configuration |

### Frontend - Created:

| File | Description |
|------|-------------|
| `frontend/src/services/api.js` | API service for HTTP requests |
| `frontend/src/context/AuthContext.jsx` | Authentication state management |
| `frontend/src/components/ProtectedRoute.jsx` | Route protection component |
| `frontend/src/pages/auth/LoginPage.jsx` | Login page |
| `frontend/src/pages/auth/RegisterPage.jsx` | Registration page |
| `frontend/src/pages/user/UserDashboard.jsx` | User dashboard |
| `frontend/src/pages/institution/InstitutionDashboard.jsx` | Institution dashboard |
| `frontend/src/pages/verifier/VerifierDashboard.jsx` | Verifier dashboard |

### Modified:

| File | Changes |
|------|---------|
| `backend/src/server.js` | Added auth routes import |
| `frontend/src/App.jsx` | Added AuthProvider, protected routes |
| `backend/.env.example` | Added Supabase configuration |

---

## 💻 CODE SNIPPETS

### JWT Token Generation
```javascript
export const generateAuthToken = (user, userType = 'user') => {
  const payload = {
    id: user.id,
    email: user.email,
    userType: userType,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
```

### Authentication Middleware
```javascript
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
};
```

### Protected Route Component
```jsx
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }
  return children;
};
```

---

## 📦 DEPENDENCIES ADDED

**Backend:**
```bash
npm install pg bcryptjs jsonwebtoken express-validator dotenv
```

| Package | Version | Purpose |
|---------|---------|---------|
| `pg` | ^8.x | PostgreSQL client for Node.js |
| `bcryptjs` | ^2.x | Password hashing |
| `jsonwebtoken` | ^9.x | JWT token handling |
| `express-validator` | ^7.x | Input validation |

**Frontend:**
- No new dependencies (uses existing React Router)

---

## ⚙️ CONFIGURATION CHANGES

### Backend `.env` Configuration

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

### Frontend `.env` Configuration

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 ISSUES & SOLUTIONS

### Issue 1: CORS Error
**Problem:** Frontend couldn't reach backend API due to CORS blocking
**Solution:** Updated `FRONTEND_URL` in backend `.env` to match frontend port (3001)

### Issue 2: Database Connection - ENOTFOUND
**Problem:** Backend couldn't resolve Supabase hostname
**Solution:** Used Supabase Connection Pooler instead of direct connection

### Issue 3: Wrong Connection String
**Problem:** Incorrect hostname and port in connection string
**Solution:** Changed from `aws-0...port:6543` to `aws-1...port:5432` as per Supabase dashboard

### Issue 4: Password with Special Characters
**Problem:** Password `trustvault@123` contains `@` which conflicts with URL format
**Solution:** URL-encoded the password as `trustvault%40123`

---

## ✅ TESTING

- [x] User registration via API (curl)
- [x] User registration via frontend
- [x] Institution registration
- [x] Verifier registration
- [x] Login for all user types
- [x] JWT token generation
- [x] Protected route access
- [x] Redirect to login for unauthenticated users

**How to test:**
```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Test API directly
curl -X POST http://localhost:5000/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","firstName":"Test","lastName":"User"}'
```

---

## 🌐 API ENDPOINTS

### Register User
```http
POST /api/auth/register/user
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

### Register Institution
```http
POST /api/auth/register/institution
Content-Type: application/json

{
  "name": "MIT",
  "type": "education",
  "email": "admin@mit.edu",
  "password": "Password123",
  "registrationNumber": "REG12345"
}
```

### Register Verifier
```http
POST /api/auth/register/verifier
Content-Type: application/json

{
  "companyName": "Google Inc",
  "email": "verify@google.com",
  "password": "Password123",
  "industry": "Technology"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "userType": "user"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

---

## 🔗 RELATED DOCUMENTATION

- See `01-PROJECT-SETUP.md` for initial project setup
- See `02-PUBLIC-WEBSITE-PAGES.md` for public website pages
- See `database/schema.sql` for complete database schema

---

## ⏭️ NEXT STEPS

1. **Phase 3:** User Wallet Portal
   - KYC verification flow
   - View credentials in wallet
   - Consent management
   - Audit log

2. **Phase 4:** Institution Portal
   - Issue credentials
   - Manage issued credentials
   - API key management

3. **Phase 5:** Verifier Portal
   - Run verifications
   - View reports
   - API integration

---

## 📌 NOTES

- Password requirements: minimum 8 characters, must include uppercase, lowercase, and number
- JWT tokens expire after 7 days
- All passwords are hashed with bcrypt (10 salt rounds)
- Database uses Supabase Connection Pooler for better reliability
- Free tier Supabase projects may pause after inactivity - check dashboard if connection fails
