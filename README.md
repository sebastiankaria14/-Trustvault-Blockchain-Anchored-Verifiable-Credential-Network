# TrustVault 🔐

**Upload once. Verify everywhere. Instantly.**

TrustVault is a digital credential verification platform that enables institutions to issue verifiable credentials, users to store them securely in a digital wallet, and organizations to verify them instantly through blockchain-backed APIs.

---

## 🌟 Features

- **Digital Wallet** - Store all your verified credentials in one secure place
- **Instant Verification** - Verify credentials in under 2 seconds via API
- **Blockchain-Backed** - Immutable credential hashes stored on Polygon
- **Multi-Sector Support** - Education, employment, healthcare, and financial credentials
- **Consent Management** - Users control who can access their credentials
- **Audit Trail** - Complete verification history and logs

---

## 🏗️ Project Structure

```
TrustVault/
├── frontend/           # React.js frontend application
├── backend/            # Node.js Express API
├── database/           # Database schemas and migrations
├── docs/               # Documentation
├── DEVELOPMENT_PLAN.md # Detailed development roadmap
└── TrustVault_SRS.pdf  # Software Requirements Specification
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Redis** - Caching
- **JWT** - Authentication
- **Helmet** - Security

### Blockchain
- **Polygon (Mumbai Testnet)** - Blockchain network
- **ethers.js** - Blockchain interaction

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis (optional for MVP)
- Git

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TrustVault
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

#### 3. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 4. Database Setup

```bash
# Create PostgreSQL database
createdb trustvault

# Run schema
psql trustvault < database/schema.sql
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/credentials` - List user credentials
- `GET /api/users/audit-log` - Verification history

#### Institutions
- `POST /api/institutions/register` - Register institution
- `POST /api/institutions/issue-credential` - Issue new credential
- `GET /api/institutions/credentials` - List issued credentials
- `PUT /api/institutions/credentials/:id/revoke` - Revoke credential

#### Verifiers
- `POST /api/verifiers/register` - Register verifier
- `POST /api/verify/degree` - Verify education credential
- `POST /api/verify/income` - Verify income credential
- `GET /api/verifiers/reports` - Verification reports

---

## 🔐 Environment Variables

Backend `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=trustvault
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

BLOCKCHAIN_NETWORK=mumbai
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com

FRONTEND_URL=http://localhost:3000
```

---

## 🌐 Deployment

### Option 1: Free Deployment (MVP/Testing)

- **Frontend**: Vercel (Free)
- **Backend**: Render.com (Free)
- **Database**: Supabase (Free)
- **Redis**: Redis Cloud (Free)
- **Total Cost**: $0/month

See [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for detailed deployment instructions.

---

## 📋 Development Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Project setup & initialization |
| Phase 1 | 🔄 In Progress | Public website pages |
| Phase 2 | ⏳ Pending | Authentication & database |
| Phase 3 | ⏳ Pending | User wallet portal |
| Phase 4 | ⏳ Pending | Institution portal |
| Phase 5 | ⏳ Pending | Verifier portal |
| Phase 6 | ⏳ Pending | Super admin panel |
| Phase 7 | ⏳ Pending | Blockchain integration |
| Phase 8 | ⏳ Pending | Testing & optimization |
| Phase 9 | ⏳ Pending | Deployment |

Full roadmap: [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)

---

## 🤝 Contributing

This is a private/educational project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues

None yet! Check [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for updates.

---

## 📄 License

This project is for educational purposes.

---

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

## 🎯 Next Steps

1. Install dependencies for both frontend and backend
2. Set up PostgreSQL database
3. Configure environment variables
4. Start building! 🚀

See [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for detailed next steps.

---

**Built with ❤️ using React, Node.js, PostgreSQL, and Blockchain**
