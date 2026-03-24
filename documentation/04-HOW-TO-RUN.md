# 04 - HOW TO RUN TRUSTVAULT

**Date:** 2026-03-24
**Phase:** Phase 2
**Status:** ✅ Complete

---

## 📝 SUMMARY

This guide provides step-by-step instructions for setting up and running the TrustVault project on your local machine. The project consists of a React frontend, Node.js/Express backend, and Supabase PostgreSQL database.

---

## 🛠️ PREREQUISITES

Before you begin, ensure you have the following installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | v18+ | `node --version` |
| npm | v8+ | `npm --version` |
| Git | Latest | `git --version` |

---

## 🚀 QUICK START

### Step 1: Clone the Repository

```bash
git clone https://github.com/sebastiankaria14/-Trustvault-Blockchain-Anchored-Verifiable-Credential-Network.git
cd -Trustvault-Blockchain-Anchored-Verifiable-Credential-Network
```

### Step 2: Set Up Supabase Database

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up with GitHub or email (free)

2. **Create a New Project**
   - Click "New Project"
   - Enter project name: `TrustVault`
   - Set a database password (remember this!)
   - Choose a region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for initialization

3. **Run Database Schema**
   - In Supabase dashboard, click **SQL Editor**
   - Click **New Query**
   - Copy the contents of `database/schema.sql`
   - Paste into the editor
   - Click **Run**
   - You should see "Success. No rows returned"

4. **Get Connection String**
   - Click **Connect** button (top right)
   - Copy the **Connection pooler** string (Session mode)
   - It looks like: `postgresql://postgres.XXXXX:PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres`

### Step 3: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Supabase) - Paste your connection string here
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-X-YOUR_REGION.pooler.supabase.com:5432/postgres

# JWT Secret (Generate a random string)
JWT_SECRET=your-super-secret-random-string-at-least-32-characters
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `YOUR_PROJECT_REF`, `YOUR_PASSWORD`, and `YOUR_REGION` with your actual Supabase values
- If your password contains special characters like `@`, URL-encode them (`@` becomes `%40`)

### Step 4: Configure Frontend Environment

```bash
cd ../frontend
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Install Dependencies

```bash
# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 6: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 TrustVault API Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
🌐 API Base URL: http://localhost:5000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready
➜ Local: http://localhost:3000/
```

### Step 7: Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend Health Check:** [http://localhost:5000/health](http://localhost:5000/health)
- **API Base URL:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 TESTING THE APPLICATION

### Test Registration

1. Open [http://localhost:3000/register](http://localhost:3000/register)
2. Select **User** tab
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Password: `Test1234` (must have uppercase, lowercase, number)
   - Confirm Password: `Test1234`
4. Click **Create User Account**
5. You should be redirected to the User Dashboard

### Test Login

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Select **User** button
3. Enter your credentials
4. Click **Sign In**
5. You should see the User Dashboard

### Test API Directly

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","userType":"user"}'
```

---

## 📂 PROJECT STRUCTURE

```
TrustVault/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, validation
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Database, JWT, password helpers
│   │   └── server.js           # Main entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/                   # React/Vite application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # Auth context
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── App.jsx             # Main app component
│   ├── .env                    # Environment variables
│   └── package.json
│
├── database/
│   └── schema.sql              # Database schema
│
├── documentation/              # Project documentation
│
└── README.md
```

---

## 🐛 TROUBLESHOOTING

### Issue: CORS Error
**Symptom:** "Access-Control-Allow-Origin" error in browser console
**Solution:** Update `FRONTEND_URL` in `backend/.env` to match your frontend port

### Issue: Database Connection Error (ENOTFOUND)
**Symptom:** "getaddrinfo ENOTFOUND" error
**Solution:**
1. Verify your Supabase project is active (not paused)
2. Use the Connection Pooler string, not direct connection
3. Check the hostname and port in your DATABASE_URL

### Issue: Port Already in Use
**Symptom:** "EADDRINUSE: address already in use :::5000"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: Authentication Error
**Symptom:** "Tenant or user not found" error
**Solution:**
1. Check if your password is correct
2. Ensure password special characters are URL-encoded
3. Verify the project reference in your connection string

### Issue: Supabase Project Paused
**Symptom:** Cannot connect to database after some time
**Solution:**
1. Go to Supabase dashboard
2. Click on your project
3. Click "Resume project" if you see that option

---

## 📋 AVAILABLE SCRIPTS

### Backend
```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | Supabase connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT signing | Random string |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 🔗 USEFUL LINKS

- **Supabase Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **React Documentation:** [https://react.dev](https://react.dev)
- **Express.js Documentation:** [https://expressjs.com](https://expressjs.com)
- **Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)

---

## 📞 SUPPORT

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review the backend console logs for errors
3. Check browser console for frontend errors
4. Verify your environment variables are correct

---

## ⏭️ NEXT STEPS AFTER SETUP

Once everything is running:
1. Create user accounts for testing
2. Explore the User Dashboard
3. Try registering as Institution or Verifier
4. Check the API endpoints using curl or Postman
