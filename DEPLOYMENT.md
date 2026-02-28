# DEPLOYMENT GUIDE

## Production Deployment Architecture

This guide covers deploying the Restaurant Order Management System to production using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon (PostgreSQL)

---

## Prerequisites

1. **Vercel Account**: https://vercel.com/signup
2. **Render Account**: https://render.com/
3. **Neon Account**: https://console.neon.tech/
4. **Git Repository**: GitHub repository with code pushed

---

## 1. Database Setup (Neon)

### Step 1.1: Create Neon Project

1. Go to https://console.neon.tech/
2. Click "Create Project"
3. Enter project name: `restaurant-system`
4. Select region closest to your users
5. Set database name: `restaurant_db`
6. Store the connection string

### Step 1.2: Get Connection String

Connection string format:
```
postgresql://user:password@host:port/database?sslmode=require
```

### Step 1.3: Initialize Database

```bash
export DATABASE_URL="your-neon-connection-string"
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
```

---

## 2. Backend Deployment (Render)

### Step 2.1: Prepare Backend for Deployment

Create `.env` file in backend:
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_SECRET=very-secure-random-key-here
JWT_EXPIRY=24h
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 2.2: Create Render Web Service

1. Go to https://render.com/dashboard
2. Click "Create +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `restaurant-system-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Root Directory**: `/`

### Step 2.3: Set Environment Variables

In Render dashboard:
1. Go to Web Service settings
2. Add "Environment" variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: (Neon connection string)
   - `JWT_SECRET`: (generate random secure key)
   - `JWT_EXPIRY`: `24h`
   - `REFRESH_TOKEN_SECRET`: (generate random secure key)
   - `FRONTEND_URL`: (your Vercel frontend URL)
   - `CORS_ORIGIN`: (your Vercel frontend URL)

### Step 2.4: Deploy

Push to main branch and Render will auto-deploy:
```bash
git push origin main
```

Monitor deployment in Render dashboard.

**Backend URL**: Will be like `https://restaurant-system-api.onrender.com`

---

## 3. Frontend Deployment (Vercel)

### Step 3.1: Prepare Frontend

Create `frontend/.env.production` (or set via Vercel):
```
NEXT_PUBLIC_API_URL=https://restaurant-system-api.onrender.com
NEXT_PUBLIC_WS_URL=https://restaurant-system-api.onrender.com
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

### Step 3.2: Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Project Name**: `restaurant-system-frontend`
   - **Framework**: `Next.js`
   - **Root Directory**: `frontend/`

### Step 3.3: Set Environment Variables

In Vercel project settings → "Environment Variables":
- `NEXT_PUBLIC_API_URL`: `https://restaurant-system-api.onrender.com`
- `NEXT_PUBLIC_WS_URL`: `https://restaurant-system-api.onrender.com`
- `NEXT_PUBLIC_APP_NAME`: `Restaurant System`

### Step 3.4: Deploy

Vercel automatically deploys on git push to main:
```bash
git push origin main
```

**Frontend URL**: Will be like `https://restaurant-system-frontend.vercel.app`

---

## 4. Post-Deployment Configuration

### Step 4.1: Test Endpoints

```bash
# Check backend health
curl https://restaurant-system-api.onrender.com/health

# Test login
curl -X POST https://restaurant-system-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'
```

### Step 4.2: Database Backups

Enable automated backups in Neon:
1. Go to Neon Console
2. Select project
3. Go to "Backups"
4. Enable automatic daily backups

### Step 4.3: Monitor Performance

**Render Monitoring**:
- Go to Web Service → "Metrics"
- Monitor CPU, Memory, Response Times

**Neon Monitoring**:
- Go to Console → "Monitoring"
- Check query performance

---

## 5. Database Migrations in Production

When making schema changes:

```bash
# Locally
cd backend
npx prisma migrate dev --name feature_name

# Push to repository
git add prisma/migrations
git commit -m "Add migration: feature_name"
git push origin main
```

**Render will automatically**:
1. Pull latest code
2. Run build command
3. Deploy new version

**Before schema changes**:
1. Backup database in Neon
2. Test on development database
3. Create migration in development
4. Test migration locally

---

## 6. Scaling Considerations

### Render Scaling
- **Auto-scaling**: Enable in Render settings (Pro plan)
- **Replicas**: Scale up by adding environment variables

### Neon Scaling
- **Connection Pooling**: Automatically managed
- **Read Replicas**: Available on paid plans

### Vercel Scaling
- **Automatic**: Handled by Vercel's CDN
- **Auto-scaling**: Built-in for Next.js

---

## 7. Security Best Practices

1. **API Keys**: Never commit to git, use environment variables
2. **Database**: Use Neon SSL connections only
3. **CORS**: Restrict to your frontend domain
4. **Rate Limiting**: Backend implements 100 req/15min per IP
5. **JWT Secrets**: Use 32+ character random strings
6. **HTTPS**: All connections encrypted automatically

---

## 8. Troubleshooting

### Backend won't start
```bash
# Check logs in Render
# Verify DATABASE_URL is correct
# Check all environment variables are set
```

### Database connection errors
```bash
# Test connection locally
DATABASE_URL="..." npx prisma db execute --stdin < test.sql

# Verify network access
# Check Neon settings for IP allowlist
```

### Frontend can't connect to backend
```bash
# Check CORS settings: should be FRONTEND_URL
# Verify WebSocket is enabled
# Check API URL in .env.production
```

---

## 9. Domain Setup

### Add Custom Domain to Vercel
1. Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown by Vercel

### Add Custom Domain to Render
1. Web Service → Settings → Custom Domains
2. Add domain and configure DNS

---

## 10. Continuous Deployment

Every time you push to `main`:

**Frontend (Vercel)**:
- Builds Next.js app
- Runs tests
- Deploys to CDN
- ~2-3 minutes

**Backend (Render)**:
- Builds Docker image
- Runs migrations
- Deploys new version
- ~5 minutes

---

## Production Checklist

- [ ] Database backed up
- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Error tracking set up
- [ ] Logging configured
- [ ] Rate limiting active
- [ ] Database indexes optimized
- [ ] API documentation accessible

---

## Support & Monitoring

- **Status Page**: Create via StatusPage.io
- **Error Tracking**: Consider Sentry.io
- **API Monitoring**: Use Uptime Robot or Freshping
- **Logs**: Check Render and Vercel dashboards

For issues, check:
1. Render logs (backend)
2. Vercel logs (frontend)
3. Neon metrics (database)
