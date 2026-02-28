# 🚀 Deployment Checklist

Complete this checklist before and after deploying to production.

---

## ✅ Pre-Deployment Checklist

### Local Testing (Backend)

- [ ] Backend dependencies installed: `npm install`
- [ ] Database connected (PostgreSQL running)
- [ ] `.env` file configured with all variables
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Database seeded: `npx prisma db seed`
- [ ] Backend starts: `npm run dev`
- [ ] Health endpoint works: `http://localhost:5000/api/health`
- [ ] Can login with demo credentials (Postman or curl)
- [ ] WebSocket connects without errors

### Local Testing (Frontend)

- [ ] Frontend dependencies installed: `npm install`
- [ ] `.env.local` file configured with API_URL and WS_URL
- [ ] Frontend starts: `npm run dev`
- [ ] Login page loads at `http://localhost:3000`
- [ ] Can login with demo credentials
- [ ] Dashboard displays without errors
- [ ] Orders page loads and displays
- [ ] Menu page loads and displays
- [ ] Kitchen Display System shows orders
- [ ] Analytics page loads with stats
- [ ] WebSocket shows "Connected" indicator

### End-to-End Testing

- [ ] Create order as Waiter
  - [ ] Select items from menu
  - [ ] Choose table or delivery option
  - [ ] Order appears in Kitchen Display with 0s delay
  - [ ] Can update status (Confirmed → Preparing → Ready)
- [ ] See real-time updates
  - [ ] Kitchen sees order updates in real-time
  - [ ] Order list updates without page refresh
  - [ ] Table status updates immediately
- [ ] Process payment
  - [ ] Create payment for order
  - [ ] Payment shows in order detail
  - [ ] Order marked as completed
- [ ] View analytics
  - [ ] Dashboard shows 1 new order
  - [ ] Revenue increased
  - [ ] Popular items updated

### Code Quality

- [ ] No TypeScript errors: `npm run build`
- [ ] ESLint passes (if configured)
- [ ] Prettier formatting applied (if configured)
- [ ] All sensitive data in `.env` (not in code)
- [ ] No `console.log` statements left (debug mode off)

---

## 📦 Production Deployment Phase 1: Database (Neon)

### Setup

- [ ] Create Neon account at https://console.neon.tech
- [ ] Create project and database
- [ ] Get PostgreSQL connection string
- [ ] Note: CONNECTION_POOLER_URL (not DATABASE_URL) for serverless

### Configuration

- [ ] Copy connection string to Render environment
- [ ] Verify format: `postgresql://user:password@... ?schema=public`
- [ ] Test connection from Render console (if possible)
- [ ] Set backup retention to 7+ days in Neon

### Verification

- [ ] Backup exists in Neon dashboard
- [ ] Connection pooler enabled (5 connections)
- [ ] Regional datacenter noted for latency

---

## 🖥️ Production Deployment Phase 2: Backend (Render)

### Setup

- [ ] Create Render account at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Branch to `main`
- [ ] Set Runtime to `Node`

### Configuration

- [ ] Set Start Command:
  ```bash
  npm install && npx prisma migrate deploy && npm run build && npm start
  ```
- [ ] Set Environment Variables:
  ```
  NODE_ENV=production
  DATABASE_URL=<NEON_CONNECTION_POOLER_URL>
  JWT_SECRET=<generate-strong-secret>
  REFRESH_TOKEN_SECRET=<generate-strong-secret>
  FRONTEND_URL=<https://your-frontend.vercel.app>
  PORT=5000
  ```
- [ ] Verify all environment variables are set

### Deployment

- [ ] Deploy from Render dashboard
- [ ] Monitor deployment logs for errors
- [ ] Check that migrations run successfully
- [ ] Check that seed runs (if on first deploy)

### Post-Deployment

- [ ] Access health endpoint: `https://<backend>.onrender.com/api/health`
- [ ] Health check returns 200 + status
- [ ] Can call auth endpoints (Postman)
- [ ] No database connection errors in logs
- [ ] WebSocket connects successfully

---

## 🌐 Production Deployment Phase 3: Frontend (Vercel)

### Setup

- [ ] Create Vercel account at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set Framework to Next.js
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Directory: `.next`

### Configuration

- [ ] Set Environment Variables:
  ```
  NEXT_PUBLIC_API_URL=https://<backend>.onrender.com/api
  NEXT_PUBLIC_WS_URL=https://<backend>.onrender.com
  NEXT_PUBLIC_APP_NAME=Restaurant System
  NEXT_PUBLIC_APP_URL=https://<frontend>.vercel.app
  ```
- [ ] Ensure all NEXT_PUBLIC_ variables are set (they're public)

### Deployment

- [ ] Trigger Vercel deployment
- [ ] Monitor build logs for errors
- [ ] Build should complete in < 2 minutes
- [ ] Check build output doesn't have warnings

### Post-Deployment

- [ ] Production URL loads without 404
- [ ] Login page displays
- [ ] Can login with demo credentials
- [ ] Dashboard loads without CORS errors
- [ ] API calls work (check Network tab)
- [ ] WebSocket connects (check WS in Network tab)
- [ ] No console errors in browser DevTools

---

## 🏥 Production Health Check

### Backend Health

Open terminal and run:
```bash
# Health endpoint
curl https://<backend>.onrender.com/api/health

# Expected response:
# {"ok":true,"timestamp":"2024-01-01T...","uptime":123}

# Test authentication
curl -X POST https://<backend>.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'

# Should return token (no 401 error)
```

### Frontend Health

- [ ] Visit frontend URL - loads without errors
- [ ] Can navigate all pages
- [ ] No 404 errors in Network tab
- [ ] API requests return 200 (not CORS errors)
- [ ] WebSocket shows as `101 Switching Protocols`

### Database Health

In Neon Dashboard:
- [ ] Active connections visible
- [ ] Query statistics available
- [ ] No error rates showing
- [ ] Connection pool stable

---

## 🔐 Security Verification

### Secrets

- [ ] JWT_SECRET is NOT in git history
- [ ] DATABASE_URL is NOT in git history
- [ ] All secrets stored only in Render + Vercel
- [ ] No `.env` files committed to git

### CORS

- [ ] Backend CORS allows Vercel domain
- [ ] No `*` in CORS allow-origin (specific domain only)
- [ ] Frontend can call backend API

### Authentication

- [ ] Tokens expire after set time (default 1 hour)
- [ ] Refresh token endpoint works
- [ ] Logout clears token
- [ ] Expired token returns 401 (not silent failure)

### HTTPS

- [ ] Backend uses HTTPS (Render provides)
- [ ] Frontend uses HTTPS (Vercel provides)
- [ ] No mixed content warnings
- [ ] API calls use https:// not http://

---

## 🚨 Common Issues & Resolution

### Issue: 401 Unauthorized
- [ ] Check JWT_SECRET matches between backend code and env
- [ ] Check token is being sent with request
- [ ] Check token hasn't expired

### Issue: CORS Error
- [ ] Check FRONTEND_URL environment variable is set
- [ ] Check CORS middleware is enabled in Express
- [ ] Check no `*` in CORS (should be specific URL)

### Issue: WebSocket Won't Connect
- [ ] Check WS_URL points to backend (without /api)
- [ ] Check WebSocket is not blocked by proxy
- [ ] Check Socket.io version matches frontend/backend

### Issue: Database Connection Error
- [ ] Check DATABASE_URL is CONNECTION_POOLER_URL for Neon
- [ ] Check connection string includes `?schema=public`
- [ ] Check database is not locked/crashed in Neon dashboard
- [ ] Test connection with: `psql <CONNECTION_STRING>`

### Issue: Migrations Didn't Run
- [ ] Check Render start command includes: `npx prisma migrate deploy`
- [ ] Check database is accessible
- [ ] Run manually in Render CLI if needed

---

## 📊 Post-Deployment Monitoring

### Daily Tasks

- [ ] Check Render logs for errors
- [ ] Check Vercel deployment status
- [ ] Check Neon database is responsive
- [ ] Monitor API response times (should be < 500ms)

### Weekly Tasks

- [ ] Review error logs
- [ ] Check database size growth
- [ ] Verify backups completing
- [ ] Monitor active user count

### Monthly Tasks

- [ ] Review analytics
- [ ] Check cost/usage
- [ ] Update dependencies (if needed)
- [ ] Test disaster recovery

---

## 📈 Performance Verification

### Frontend Performance

- [ ] First Contentful Paint (FCP): < 1.5s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Check with Vercel Analytics or PageSpeed Insights

### Backend Performance

- [ ] API response time: < 500ms (avg)
- [ ] WebSocket latency: < 100ms
- [ ] Database query time: < 200ms
- [ ] Monitor with Render metrics or Sentry

---

## 🔄 Rollback Plan

If deployment has critical issues:

### Quick Rollback (Render)

- [ ] Go to Render dashboard → Deployments
- [ ] Click previous successful deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment complete

### Quick Rollback (Vercel)

- [ ] Go to Vercel dashboard → Deployments
- [ ] Click previous successful deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment complete

---

## ✨ Success Indicators

Your deployment is successful when:

- ✅ Frontend loads without errors: `https://<app>.vercel.app`
- ✅ Can login with demo credentials
- ✅ Dashboard displays key metrics
- ✅ Can create orders and see in Kitchen Display
- ✅ Real-time updates work (WebSocket)
- ✅ Analytics show data
- ✅ No errors in browser console
- ✅ No errors in Render logs
- ✅ API response times are fast (< 500ms)
- ✅ Database is stable and backing up

---

## 🎉 Deployment Complete!

Your Restaurant Order Management System is now live!

**Next Steps:**
1. Share the URL with your team
2. Create production menu items
3. Set up staff accounts
4. Configure restaurants/tables
5. Train staff on using the system
6. Monitor performance and logs daily

**Support:**
- Frontend issues? Check [DEVELOPMENT.md](./DEVELOPMENT.md)
- Backend issues? Check [API.md](./API.md)
- Database issues? Check [DATABASE.md](./DATABASE.md)
- Architecture questions? Check [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📋 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Local setup (5 min) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [API.md](./API.md) | API endpoint reference |
| [DATABASE.md](./DATABASE.md) | Database schema |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development workflow |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |
| [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) | What was built |

---

Print this checklist and check off items as you deploy. Share with your team!
