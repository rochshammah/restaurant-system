# Restaurant Order Management System - Architecture Document

## 🎯 System Overview

A complete, production-ready SaaS platform for restaurant operations, built with modern cloud-native architecture and enterprise-grade security.

**Tech Stack:**
- **Frontend:** Next.js 15+ (App Router), React 19+, TypeScript, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma
- **Real-time:** WebSocket (Socket.io) + Server-Sent Events
- **Authentication:** JWT + Secure cookies
- **Deployment:** Vercel (frontend), Render (backend), Neon (database)

---

## 📋 Architectural Principles

1. **Microservice-Ready:** Backend designed for eventual microservice migration
2. **API-First:** Clean RESTful API with clear separation of concerns
3. **Scalability:** Connection pooling, caching, database indexing
4. **Security:** Defense-in-depth with JWT, role-based access, input validation
5. **Real-time First:** Live updates across all components via WebSockets
6. **DX Focused:** Clear folder structure, documentation, seed data
7. **Performance:** Server-side rendering, code splitting, optimized images

---

## 🏗️ Folder Structure

```
restaurant-system/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration & environment
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── middlewares/         # Auth, validation, error handling
│   │   ├── models/              # Data models & schema
│   │   ├── routes/              # API routes
│   │   ├── utils/               # Helper utilities
│   │   ├── types/               # TypeScript types
│   │   ├── websocket/           # Real-time handlers
│   │   ├── database/            # Prisma schema, migrations
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Data schema
│   │   └── seed.ts              # Seed data
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── menu/
│   │   │   ├── orders/
│   │   │   ├── tables/
│   │   │   ├── kitchen/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   ├── layouts/             # Layout components
│   │   ├── forms/               # Form components
│   │   └── features/            # Feature-specific components
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   ├── websocket.ts         # WebSocket client
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   └── types.ts             # Shared TypeScript types
│   ├── styles/                  # Global styles
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── .env.example
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── DATABASE.md              # Database schema docs
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── DEVELOPMENT.md           # Development setup
│   └── CONTRIBUTING.md          # Contribution guidelines
│
├── docker-compose.yml           # Local development
├── .gitignore
├── README.md
└── ARCHITECTURE.md
```

---

## 🗄️ Database Schema Overview

**Core Tables:**
- `users` - Team members with authentication
- `roles` - RBAC roles (Admin, Waiter, Kitchen, Customer)
- `menu_categories` - Menu organization
- `menu_items` - Food/beverage items
- `menu_variants` - Item variations (size, extras)
- `tables` - Dining table management
- `orders` - Order headers
- `order_items` - Individual items in orders
- `payments` - Payment records
- `order_timeline` - Audit trail for status changes
- `restaurant_settings` - Configuration

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, menu management, staff management, analytics |
| **Manager** | Analytics, reporting, staff scheduling |
| **Waiter** | Create orders, manage tables, process payments |
| **Kitchen** | View KDS, update order status |
| **Customer** | Browse menu, place order, track status |

---

## 🔄 API Architecture

**Base Endpoints:**
- `GET/POST /api/auth/*` - Authentication
- `GET/POST /api/menu/*` - Menu management
- `GET/POST /api/orders/*` - Order operations
- `GET/POST /api/tables/*` - Table management
- `GET/POST /api/payments/*` - Payment processing
- `GET /api/analytics/*` - Dashboard & analytics
- `WS /api/ws` - WebSocket real-time connection

---

## 🔐 Security Architecture

```
Request Flow:
┌─────────────┐
│ HTTP Request│
└──────┬──────┘
       │
       ▼
┌────────────────────────┐
│ CORS & Rate Limiting   │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ JWT Token Verification │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ RBAC Middleware        │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Input Validation       │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Request Handler        │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Database Query         │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ WebSocket Broadcast    │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ JSON Response          │
└────────────────────────┘
```

---

## ⚡ Real-time Flow

```
Order Creation:
┌──────────────────────────────────────────────────┐
│ 1. Waiter creates order in POS                   │
├──────────────────────────────────────────────────┤
│ 2. Backend validates & saves to database         │
├──────────────────────────────────────────────────┤
│ 3. Broadcast "order:created" via WebSocket       │
├──────────────────────────────────────────────────┤
│ 4. Kitchen display updates in real-time          │
│ 5. Waiter dashboard updates in real-time         │
│ 6. Payment dashboard updated in real-time        │
└──────────────────────────────────────────────────┘
```

---

## 🌐 Frontend Architecture

**State Management:**
- React Context API for global state
- React Query (TanStack Query) for server state caching
- WebSocket context for real-time updates

**Component Structure:**
- Presentational components (UI)
- Container components (logic)
- Custom hooks for business logic
- Error boundaries for error handling

**Styling:**
- TailwindCSS for utility-first styling
- CSS-in-JS for dynamic styles (if needed)
- Dark/Light mode support
- Mobile-first responsive design

---

## 🚀 Deployment Strategy

**Frontend (Vercel):**
- Automatic deployments from main branch
- Edge functions for API prefix rewrites
- Built-in CDN & caching
- Environment variables management

**Backend (Render):**
- Docker containerized Node.js app
- Auto-deployment from main branch
- Environment variables management
- Health check monitoring

**Database (Neon):**
- Serverless PostgreSQL with connection pooling
- Automatic backups
- Replication for high availability
- Read replicas for scaling

---

## 📊 Key Features Implementation

### 1. Authentication & Authorization
- JWT tokens with 24h expiration
- Refresh tokens for long sessions
- Secure password hashing (bcrypt)
- Session management

### 2. Menu Management
- Hierarchical categories
- Image uploads to cloud storage
- Variant system for customization
- Real-time availability updates

### 3. Order Workflow
- Multi-order type support (dine-in, takeaway, delivery)
- Item customization with extras
- Auto-calculated totals with tax
- Order timer tracking

### 4. Kitchen Display System
- Large, touch-optimized cards
- Color-coded status indicators
- Preparation timers
- Ability to split orders

### 5. Payment System
- Multiple payment methods
- Digital receipts
- Split billing support
- Automated invoicing

### 6. Analytics Dashboard
- Real-time metrics
- Historical reporting
- Staff performance tracking
- Popular items analysis

---

## 🛠️ Development Workflow

1. **Local Setup:**
   ```bash
   git clone <repo>
   cd backend && npm install && npm run dev
   cd frontend && npm install && npm run dev
   ```

2. **Database:**
   ```bash
   npx prisma migrate dev --name <migration-name>
   npx prisma db seed
   ```

3. **Commit & Deploy:**
   - Commits to `main` auto-deploy to production
   - Use `develop` branch for feature work

---

## 📈 Performance Targets

- Page load time: < 2s (First Contentful Paint)
- API response time: < 200ms (p95)
- WebSocket latency: < 100ms
- Database query time: < 50ms (p95)
- Concurrent users: 1000+ per server instance

---

## Next Steps

1. Initialize backend with Express & Prisma
2. Create database schema with migrations
3. Implement authentication & middleware layer
4. Build core APIs
5. Initialize Next.js frontend
6. Create reusable component library
7. Implement real-time WebSocket connection
8. Configure deployment pipelines
