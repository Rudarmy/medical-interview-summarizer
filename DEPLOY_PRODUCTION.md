# Production Deployment Guide for Frontend

## 📋 Prerequisites
1. Deploy your backend first (see `/backend/DEPLOY.md`)
2. Get your backend URL (e.g., `https://your-app.railway.app`)

## 🔧 Step 1: Configure Production Environment

1. **Update `.env.production`**:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Or set in build environment** (Netlify/Vercel):
   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

## 🚀 Step 2: Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

## 📁 Step 3: Deploy to Your Website

### Option A: Manual Upload (Your Current Setup)
1. **Upload `dist/` contents** to your web server
2. **Replace existing files** on `https://goodtimesstudio.com/`

### Option B: Netlify (Automated)
1. **Connect GitHub repo** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-backend-url.railway.app/api`

### Option C: Vercel (Automated)
1. **Connect GitHub repo** to Vercel
2. **Set environment variables**:
   - `VITE_API_URL=https://your-backend-url.railway.app/api`

## ✅ Testing Your Deployment

1. **Frontend**: Should load without errors
2. **Backend**: Visit `https://your-backend-url.railway.app/health`
3. **Full Test**: Try summarizing a transcript in your app

## 🔧 Troubleshooting

**CORS Errors**: Update `FRONTEND_URL` in backend environment variables
**Connection Errors**: Check backend URL in frontend environment variables
**API Errors**: Verify backend is running and health endpoint responds
