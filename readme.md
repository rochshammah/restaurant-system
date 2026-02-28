# Restaurant Order Management System

A complete, production-ready SaaS platform for restaurant operations built with modern architecture, enterprise-grade security, and real-time capabilities.

## Features

✅ **Complete Order Management**
- Dine-in, Takeaway, and Delivery order types
- Real-time order tracking and status updates
- Multi-item orders with customization options
- Special instructions and notes

✅ **Kitchen Display System (KDS)**
- Real-time order cards with preparation timers
- Color-coded status indicators
- Large, touch-optimized interface
- One-click status updates

✅ **Role-Based Access Control**
- Admin, Manager, Waiter, Kitchen, Delivery roles
- Secure JWT authentication
- Permission-based API access

✅ **Advanced Menu Management**
- Categories and hierarchical organization
- Item variants (size, extras, etc.)
- Availability toggling
- Search functionality

✅ **Real-time Features**
- WebSocket integration for live updates
- Instant order notifications
- Live kitchen display updates

✅ **Modern UI/UX (2026 Standards)**
- Clean, minimal design with glassmorphism
- Dark/Light mode support
- Responsive mobile-first design
- Smooth animations and micro-interactions

## Tech Stack

### Frontend
- React 19 + Next.js 15 (App Router)
- TypeScript + TailwindCSS
- Framer Motion + Socket.io

### Backend
- Node.js + Express.js
- TypeScript + Prisma ORM
- PostgreSQL (Neon) + Socket.io

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon

## Quick Start

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

**Demo Credentials:**
- Admin: `admin@restaurant.com` / `admin123`
- Waiter: `waiter@restaurant.com` / `user123`
- Kitchen: `kitchen@restaurant.com` / `user123`

## Documentation

- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Development Guide](./DEVELOPMENT.md)

## License

MIT License
