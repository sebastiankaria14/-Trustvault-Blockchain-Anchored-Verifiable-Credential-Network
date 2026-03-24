# 🚀 Quick Start Guide

**Get TrustVault running in 5 minutes!**

---

## ✅ Phase 0 Complete!

Your project structure is ready! Here's what we've set up:

- ✅ Git repository initialized
- ✅ Frontend (React + Vite + Tailwind CSS)
- ✅ Backend (Node.js + Express)
- ✅ Database schema (PostgreSQL)
- ✅ Landing page with full design
- ✅ Complete documentation

---

## 🎯 Next: Start Developing!

### Step 1: Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

---

### Step 2: Set Up Environment

#### Backend Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your settings (optional for now)
```

---

### Step 3: Run the Application

#### Start Frontend (Terminal 1)
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:3000

#### Start Backend (Terminal 2)
```bash
cd backend
npm run dev
```
✅ Backend: http://localhost:5000

---

## 🎨 What You'll See

Visit http://localhost:3000 to see:

- Beautiful landing page
- Navigation bar
- Hero section
- Features section (Secure, Instant, Universal)
- How It Works (3-step process)
- Call-to-action sections
- Professional footer

---

## 📝 What's Next?

Refer to **DEVELOPMENT_PLAN.md** for:

### Phase 1: Public Website (Current)
- [ ] Build "How It Works" page
- [ ] Build "For Institutions" page
- [ ] Build "For Verifiers" page
- [ ] Build "API Documentation" page
- [ ] Build "Contact" page

### Phase 2: Database & Auth
- [ ] Set up PostgreSQL
- [ ] Implement user registration
- [ ] Implement login system
- [ ] JWT authentication

---

## 💡 Tips

1. **No Database Yet?** Don't worry! You can build the frontend first.

2. **PostgreSQL Setup** (when ready):
   ```bash
   # Install PostgreSQL
   # Create database
   createdb trustvault

   # Run schema
   psql trustvault < database/schema.sql
   ```

3. **Deployment** - When ready to deploy:
   - Frontend → Vercel (free)
   - Backend → Render.com (free)
   - Database → Supabase (free)

---

## 🐛 Troubleshooting

### Frontend won't start?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start?
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use?
- Frontend: Edit `frontend/vite.config.js` to change port
- Backend: Edit `backend/.env` PORT variable

---

## 📚 Documentation

- **DEVELOPMENT_PLAN.md** - Complete roadmap with all phases
- **README.md** - Project overview and setup
- **TrustVault_SRS.pdf** - Requirements document
- **database/schema.sql** - Database structure

---

## 🎉 You're All Set!

Start with:
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 and see your landing page!

**Happy coding! 🚀**
