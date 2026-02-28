# Quick Start Guide - Restaurant Order Management System

## 🚀 Get Started in 5 Minutes

This guide will help you run the complete Restaurant Order Management System locally.

---

## Prerequisites

- **Node.js 18+** (download from https://nodejs.org)
- **Git** (download from https://git-scm.com)
- **PostgreSQL 14+** OR use Neon (serverless PostgreSQL)

---

## Option 1: Run Locally with PostgreSQL

### 1. Clone / Open Project

Navigate to your project directory:
```bash
cd restaurant-system
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.backend/.env`** and add your PostgreSQL connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_dev"
JWT_SECRET="your-secret-key-change-this"
REFRESH_TOKEN_SECRET="your-refresh-secret-change-this"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate deploy

# Seed with demo data
npx prisma db seed

# Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Backend Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

Backend health check: `http://localhost:5000/api/health`

---

### 5. Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

**Edit `frontend/.env.local`**:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_WS_URL="http://localhost:5000"
NEXT_PUBLIC_APP_NAME="Restaurant System"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend will start at `http://localhost:3000`

---

## 🔐 Demo Credentials

Once the app loads, use these credentials to login:

### Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@restaurant.com | admin123 |
| Waiter | waiter@restaurant.com | user123 |
| Kitchen | kitchen@restaurant.com | user123 |
| Manager | manager@restaurant.com | user123 |
| Delivery | delivery@restaurant.com | user123 |

---

## 📊 What You Can Do

### Admin
- View all orders and analytics
- Manage menu (add/edit/delete items)
- Add order items and variants
- View all users
- Full system access

### Waiter
- Create new orders
- Assign orders to tables
- Update order status (to kitchen, ready)
- View menu and current orders
- Process payments

### Kitchen
- View ready orders (Kitchen Display System)
- Mark items as done
- See special instructions
- Real-time order updates via WebSocket

### Manager
- Full analytics dashboard
- Revenue reports
- Popular items analysis
- Order trends
- Refund management

---

## 🧪 Test the System

### 1. Create an Order

1. Go to **Dashboard** (redirects after login)
2. Or navigate to **Orders** page
3. Click **Create Order**
4. Select items from menu
5. Complete the order

### 2. View in Kitchen

1. Open Kitchen tab in same browser OR new browser
2. Login with kitchen user
3. See real-time orders appearing

### 3. Update Order Status

1. From Waiter account, click order
2. Update status (Confirmed → Preparing → Ready)
3. Kitchen sees updates in real-time

### 4. View Analytics

1. Login as Manager or Admin
2. Go to Analytics page
3. See revenue, orders, popular items, trends

---

## 🗂️ Project Structure

```
restaurant-system/
├── backend/                  # Express.js + Prisma API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Auth, error handling
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helpers, errors
│   │   └── websocket/       # Socket.io real-time
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Demo data
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js 15 + React 19
│   ├── app/
│   │   ├── (auth)/          # Login page
│   │   ├── (dashboard)/     # Dashboard pages
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   └── layouts/         # Layout components
│   ├── lib/
│   │   ├── api.ts           # Axios HTTP client
│   │   ├── store.ts         # Zustand state
│   │   ├── types.ts         # TypeScript types
│   │   └── hooks/           # Custom hooks
│   ├── styles/
│   ├── package.json
│   └── tsconfig.json
│
└── Documentation/
    ├── README.md            # Features overview
    ├── QUICK_START.md       # This file
    ├── ARCHITECTURE.md      # System design
    ├── API.md               # API endpoints
    ├── DATABASE.md          # Database schema
    ├── DEPLOYMENT.md        # Deployment guide
    └── DEVELOPMENT.md       # Dev setup guide
```

---

## 🚨 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is in use:

```bash
# Find process using port
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 PID          # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error

```bash
# Check PostgreSQL is running (if local)
pg_isready -h localhost -p 5432

# Or check connection string in .env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### WebSocket Connection Failed

- Ensure backend is running
- Check `NEXT_PUBLIC_WS_URL` in frontend `.env.local`
- Open browser DevTools → Network → WS tab

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Read Documentation**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [API.md](./API.md) - All API endpoints
   - [DATABASE.md](./DATABASE.md) - Database schema

2. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Vercel, Render, Neon

3. **Add Features**
   - See DEVELOPMENT.md for how to add new features
   - Common tasks like adding a new API endpoint

4. **Customize**
   - Change restaurant name in database
   - Add your menu items
   - Customize branding

---

## 🆘 Getting Help

- **API Issues?** See [API.md](./API.md)
- **Database Issues?** See [DATABASE.md](./DATABASE.md) 
- **Deploy Issues?** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Dev Questions?** See [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## ✅ Verification Checklist

After following this guide:

- ✅ Backend running at `http://localhost:5000`
- ✅ Frontend running at `http://localhost:3000`
- ✅ Can login with demo credentials
- ✅ Can see orders in real-time
- ✅ Can create and update orders
- ✅ Database populated with demo data

---

Ready to deploy? See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel + Render + Neon setup!
