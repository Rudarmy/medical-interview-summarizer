# 🎯 Railway.app Deployment - Step by Step Screenshots Guide

## 🚀 Phase 1: Complete Git Setup (5 minutes)

### Step 1: Finish Your Git Commit
```bash
# Save and exit the commit message editor (Ctrl+X if nano, or :wq if vim)
# Then push to GitHub:

git remote add origin https://github.com/YOUR_USERNAME/medical-interview-summarizer.git
git branch -M main
git push -u origin main
```

If you don't have a GitHub repo yet:
1. Go to https://github.com/new
2. Name: `medical-interview-summarizer` 
3. Click "Create repository"
4. Copy the commands GitHub gives you

## 🚂 Phase 2: Railway Deployment (10 minutes)

### Step 1: Sign Up for Railway
1. **Go to**: https://railway.app
2. **Click**: "Start a New Project" 
3. **Sign up with GitHub** (recommended for easy repo access)

### Step 2: Create New Project
1. **Click**: "Deploy from GitHub repo"
2. **Select**: Your `medical-interview-summarizer` repository
3. **Important**: Railway will try to deploy the root folder

### Step 3: Configure for Backend Deployment
🚨 **CRITICAL**: Railway needs to know to deploy the `/backend` folder, not the root!

1. **After selecting repo**, Railway starts building
2. **Stop the build** by clicking the deployment
3. **Go to Settings** → "Build & Deploy"
4. **Set Root Directory**: `backend`
5. **Build Command**: `npm install` (should auto-detect)
6. **Start Command**: `npm start` (should auto-detect)

### Step 4: Set Environment Variables
1. **Go to**: "Variables" tab in your Railway project
2. **Add these variables one by one**:

```
Variable Name: GEMINI_API_KEY
Value: AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848

Variable Name: FRONTEND_URL  
Value: https://goodtimesstudio.com

Variable Name: NODE_ENV
Value: production
```

3. **Click "Add Variable"** for each one

### Step 5: Deploy and Get URL
1. **Trigger redeploy**: Go to "Deployments" → "Deploy Latest"
2. **Wait for build** (2-3 minutes)
3. **Generate domain**: Settings → "Networking" → "Generate Domain"
4. **Your URL**: Will be like `https://medical-interview-backend-production-abc123.railway.app`

## ✅ Phase 3: Test Your Backend (2 minutes)

### Test Health Endpoint
1. **Visit**: `https://your-railway-url.railway.app/health`
2. **Should see**: `{"status":"OK","timestamp":"2025-08-05T..."}`

### Check Logs (if issues)
1. **Railway Dashboard** → "View Logs"
2. **Look for errors** in the deployment logs
3. **Common issues**: Missing environment variables, wrong start command

## 🔧 Phase 4: Update Frontend (5 minutes)

Once your backend is deployed:

### Option A: Manual Build
1. **Update `.env.production`**:
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Upload `dist/` folder** to your website

### Option B: Use Build Script (Easier)
```bash
# Windows:
build-production.bat https://your-railway-url.railway.app

# Linux/Mac:
./build-production.sh https://your-railway-url.railway.app
```

## 🚨 Common Railway Issues & Solutions

### Issue 1: "Build Failed"
**Solution**: 
- Check Railway logs
- Ensure `backend/package.json` exists
- Verify Root Directory is set to `backend`

### Issue 2: "Server Won't Start"
**Solution**:
- Check environment variables are set correctly
- Verify `npm start` command works locally
- Check PORT is using `process.env.PORT`

### Issue 3: "CORS Errors"
**Solution**:
- Verify `FRONTEND_URL` environment variable
- Check your domain exactly matches

### Issue 4: "Health Endpoint 404"
**Solution**:
- Check if server is actually running
- Verify Railway deployment succeeded
- Check deployment logs for startup errors

## 📱 Railway Dashboard Navigation

**Main Tabs**:
- **Overview**: Project status and quick info
- **Deployments**: Build history and logs
- **Variables**: Environment variables
- **Settings**: Domain, build config, billing
- **Logs**: Real-time server output

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployments:
   ```bash
   npm install -g @railway/cli
   railway login
   railway link  # Link to existing project
   railway up    # Quick deploy
   ```

2. **Monitor your app**:
   - Check logs regularly for errors
   - Monitor CPU/memory usage in Railway dashboard
   - Set up alerts for downtime

3. **Custom Domain** (optional):
   - Railway Settings → "Networking" → "Custom Domain"
   - Add your own domain (like api.goodtimesstudio.com)

## 🎯 Success Checklist

After deployment, you should have:
- [ ] ✅ Railway project deployed successfully
- [ ] ✅ Health endpoint responding: `https://your-url.railway.app/health`
- [ ] ✅ Environment variables set correctly
- [ ] ✅ No errors in Railway logs
- [ ] ✅ Frontend updated with Railway URL
- [ ] ✅ Full app working on goodtimesstudio.com

**Your Railway URL**: `___________________________`
*(Write it down - you'll need it for frontend configuration)*
