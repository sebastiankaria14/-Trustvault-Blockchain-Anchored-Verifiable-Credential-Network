# TrustVault Phase 2 - Authentication & Database Setup Guide

## 🎉 Phase 2 Complete!

Phase 2 implementation is complete with the following features:

### ✅ Backend Features
- User, Institution, and Verifier registration APIs
- Login API with JWT authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- Authentication middleware
- Role-based access control
- Database connection with Supabase PostgreSQL

### ✅ Frontend Features
- Login page with user type selection
- Registration page with tabs for different user types
- Auth context for state management
- Protected routes
- User, Institution, and Verifier dashboards
- API service for backend communication

---

## 🚀 Setup Instructions

### 1. Set Up Supabase Database

#### Step 1: Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

#### Step 2: Create a New Project
1. Click "New Project"
2. Enter project details:
   - **Name**: trustvault
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Plan**: Free tier is fine for development
3. Wait 2-3 minutes for project to be created

#### Step 3: Get Database Connection Details
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **Database** tab
3. Scroll to **Connection string** section
4. Copy the **URI** connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you created

#### Step 4: Run Database Schema
1. In Supabase dashboard, click **SQL Editor** from sidebar
2. Click **New Query**
3. Open the file `database/schema.sql` from your project
4. Copy all the contents and paste into the SQL Editor
5. Click **Run** to execute the schema
6. You should see success message

### 2. Configure Backend Environment

1. Navigate to `backend/` folder
2. Create a new file named `.env` (copy from `.env.example`)
3. Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Secret (Change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `[YOUR-PASSWORD]` with your Supabase database password
- Replace `[YOUR-PROJECT-REF]` with your project reference from Supabase
- Change `JWT_SECRET` to a random secure string

### 3. Configure Frontend Environment

1. Navigate to `frontend/` folder
2. The `.env` file should already exist with:

```env
VITE_API_URL=http://localhost:5000/api
```

If it doesn't exist, create it with the content above.

### 4. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 5. Start the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:3000

#### Option 2: Run with Concurrently (Coming Soon)
We'll add a root-level script to run both simultaneously.

---

## 🧪 Testing the Application

### 1. Test Backend API

Visit http://localhost:5000/health - You should see:
```json
{
  "status": "OK",
  "message": "TrustVault API is running",
  "timestamp": "..."
}
```

### 2. Test Frontend

Visit http://localhost:3000 - You should see the TrustVault landing page

### 3. Test Registration & Login

#### Register a User:
1. Go to http://localhost:3000/register
2. Stay on "User" tab
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: (optional)
   - Date of Birth: (optional)
   - Password: Test1234 (must have uppercase, lowercase, number)
   - Confirm Password: Test1234
4. Click "Create User Account"
5. You should be redirected to `/user/dashboard`

#### Login:
1. Go to http://localhost:3000/login
2. Select "User" button
3. Enter:
   - Email: john@example.com
   - Password: Test1234
4. Click "Sign In"
5. You should be redirected to `/user/dashboard`

#### Test Other User Types:
- Register as Institution with type "Institution" tab
- Register as Verifier with type "Verifier" tab
- Login with appropriate user type selected

---

## 📊 Database Tables Created

The following tables are now in your Supabase database:

- ✅ `users` - End users (individuals)
- ✅ `institutions` - Organizations that issue credentials
- ✅ `verifiers` - Organizations that verify credentials
- ✅ `institution_staff` - Additional staff for institutions
- ✅ `verifier_api_keys` - API keys for verifiers
- ✅ `credentials` - Issued credentials
- ✅ `consent_records` - User consent for sharing
- ✅ `verification_logs` - Audit trail of verifications

You can view and manage these tables in Supabase:
1. Go to **Table Editor** in Supabase dashboard
2. Click on any table to view data
3. You can manually add/edit/delete records for testing

---

## 🔐 API Endpoints Available

### Authentication Endpoints

#### 1. Register User
```
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

#### 2. Register Institution
```
POST /api/auth/register/institution
Content-Type: application/json

{
  "name": "MIT",
  "type": "education",
  "email": "admin@mit.edu",
  "password": "Password123",
  "registrationNumber": "REG12345",
  "phone": "+1234567890",
  "website": "https://mit.edu"
}
```

#### 3. Register Verifier
```
POST /api/auth/register/verifier
Content-Type: application/json

{
  "companyName": "Google Inc",
  "email": "verify@google.com",
  "password": "Password123",
  "industry": "Technology",
  "phone": "+1234567890",
  "website": "https://google.com"
}
```

#### 4. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "userType": "user"  // or "institution" or "verifier"
}
```

#### 5. Get Current User
```
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists in `backend/` folder
- Make sure `DATABASE_URL` in `.env` is correct
- Run `npm install` in backend folder

### Frontend won't start
- Check if port 3000 is available
- Verify `.env` file exists in `frontend/` folder
- Run `npm install` in frontend folder

### Database connection errors
- Verify Supabase project is running
- Check DATABASE_URL in backend `.env`
- Make sure you replaced [YOUR-PASSWORD] and [YOUR-PROJECT-REF]
- Test connection in Supabase dashboard

### Login/Registration not working
- Check browser console for errors
- Verify backend is running on port 5000
- Check that VITE_API_URL in frontend `.env` is correct
- Make sure database schema was executed successfully

### JWT Token errors
- Make sure `JWT_SECRET` is set in backend `.env`
- Check that token is being sent in Authorization header
- Token expires after 7 days by default

---

## 📝 Next Steps (Phase 3)

Phase 3 will implement the User Wallet Portal:
- User KYC verification
- View credentials in wallet
- Consent management
- Audit log
- Profile management

---

## 💡 Tips

1. **View Backend Logs**: Watch the backend terminal for API request logs
2. **Inspect Database**: Use Supabase Table Editor to view registered users
3. **Test with Postman**: Import API endpoints to Postman for testing
4. **Clear Token**: If you get auth errors, clear localStorage in browser DevTools
5. **Check Network Tab**: Use browser DevTools Network tab to debug API calls

---

## ✅ Phase 2 Checklist

- [x] Database schema design
- [x] Create Supabase tables
- [x] User registration API
- [x] Login API (JWT)
- [x] Password hashing (bcrypt)
- [x] Login page (all roles)
- [x] Registration pages (User, Institution, Verifier)
- [x] Protected routes setup
- [x] Auth context/state management
- [ ] Email verification (Optional - Coming later)
- [ ] Forgot password flow (Optional - Coming later)

---

🎉 **Phase 2 Complete! Ready for Phase 3!**
