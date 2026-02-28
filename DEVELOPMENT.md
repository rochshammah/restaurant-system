# Development Guide

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon account)
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd restaurant-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your values
# DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db
# JWT_SECRET=your-secret-key

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## Development Workflow

### Creating New Features

1. **Branch**
```bash
git checkout -b feature/feature-name
```

2. **Backend changes** (if needed)
   - Create/update services in `src/services/`
   - Create/update controllers in `src/controllers/`
   - Create/update routes in `src/routes/`
   - Update types in `src/types/`

3. **Frontend changes** (if needed)
   - Create components in `components/`
   - Create pages in `app/`
   - Create hooks in `lib/hooks/`

4. **Test locally**
```bash
# Backend: npm run dev
# Frontend: npm run dev
# Test manually in browser
```

5. **Commit and Push**
```bash
git add .
git commit -m "feat: description"
git push origin feature/feature-name
```

6. **Create Pull Request** on GitHub

---

## Local Database Setup

### Using Local PostgreSQL

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Windows: https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql

# Create database
createdb restaurant_db

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/restaurant_db"

# Run migrations
cd backend
npx prisma migrate dev
```

### Using Neon (Cloud)

1. Create account at https://console.neon.tech/
2. Create new project
3. Copy connection string
4. Update `.env`
```
DATABASE_URL="postgresql://..."
```

5. Run migrations
```bash
npx prisma migrate dev
```

---

## Database Management

### View Database UI
```bash
cd backend
npx prisma studio
```

Opens Prisma Studio at `http://localhost:5555`

### Create Migrations
```bash
# Make schema changes in schema.prisma
# Then create migration
npx prisma migrate dev --name descriptive_name
```

### Reset Database (Dev only!)
```bash
npx prisma migrate reset
```

---

## Testing

### Backend

```bash
cd backend

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Frontend

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test -- --watch
```

---

## Linting & Formatting

### Backend
```bash
cd backend

# Lint
npm run lint

# Format
npx prettier --write src/
```

### Frontend
```bash
cd frontend

# Lint
npm run lint

# Format
npx prettier --write app/ components/ lib/
```

---

## Common Commands

### Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database UI (optional)
cd backend && npx prisma studio
```

### Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### View Logs
```bash
# Backend logs automatically printed to console
# Frontend logs in browser console (F12)
```

### Debug in VS Code

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

Then press F5 to debug.

---

## Environment Variables

### Backend (.env)

```
# Required
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=dev-secret

# Optional
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## Project Structure

```
restaurant-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth, validation
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helpers
│   │   ├── types/          # TypeScript types
│   │   ├── websocket/      # Real-time
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & hooks
│   ├── styles/             # CSS
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
│
└── README.md
```

---

## Contributing Guidelines

1. **Code Style**: Use Prettier & ESLint
2. **Commit Messages**: Use conventional commits (feat:, fix:, etc.)
3. **Branch Naming**: feature/name or bugfix/name
4. **Tests**: Write tests for new features
5. **Documentation**: Update docs if changing API

---

## Troubleshooting

### Backend won't start
```bash
# Check if database is running
# Check .env variables
# Check port 5000 is available
lsof -i :5000  # on macOS/Linux
netstat -ano | findstr :5000  # on Windows
```

### Database connection failed
```bash
# Test connection
psql postgresql://user:password@host:port/database

# Check DATABASE_URL format
# Check PostgreSQL is running
```

### Frontend can't connect to backend
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
# Check backend is running on correct port
# Check CORS is enabled
```

### Port already in use
```bash
# Backend (5000)
kill -9 $(lsof -t -i :5000)  # macOS/Linux
netstat -ano | findstr :5000 | taskkill /PID /F  # Windows

# Frontend (3000)
kill -9 $(lsof -t -i :3000)  # macOS/Linux
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Socket.io Docs](https://socket.io/docs)

---

## Getting Help

1. Check existing GitHub issues
2. Search documentation files
3. Check error messages carefully
4. Ask in development discussions
5. Create new issue with details

---

## Next Steps

1. Set up development environment
2. Create feature branch
3. Make changes locally
4. Test thoroughly
5. Submit pull request
6. Wait for code review
7. Merge to main
8. Deploy to production
