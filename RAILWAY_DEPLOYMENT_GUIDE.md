# 🚂 Complete Railway.app Deployment Guide

## 📋 Prerequisites

1. ✅ Your backend folder is ready (`/backend` directory)
2. ✅ You have a GitHub account
3. ✅ Your API key: `AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848`

## 🎯 Method 1: Deploy from GitHub (Recommended)

### Step 1: Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `medical-interview-summarizer`
   - Set to Public or Private
   - Click "Create repository"

2. **Push your code** (in your main project directory):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Medical Interview Summarizer with secure backend"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/medical-interview-summarizer.git
   git push -u origin main
   ```

### Step 2: Deploy on Railway (Detailed Steps)

#### 2.1 Initial Railway Setup

1. **Go to Railway.app**:
   - Visit: https://railway.app
   - Click "Login" (top right)
   - Sign in with GitHub (recommended) or email

2. **Create New Project**:
   - After login, click "New Project" or "Start a New Project"
   - You'll see deployment options

#### 2.2 GitHub Integration (Detailed)

3. **Connect GitHub Repository**:
   - Click "Deploy from GitHub repo"
   - **If first time**: Railway will ask for GitHub permissions
     - Click "Configure GitHub App"
     - Select your GitHub account
     - Choose "All repositories" OR "Selected repositories"
     - If selected: choose `medical-interview-summarizer`
     - Click "Install & Authorize"

4. **Repository Selection**:
   - You'll see a list of your repositories
   - Find `medical-interview-summarizer`
   - Click on it to select

#### 2.3 Initial Deployment Configuration

5. **Auto-Detection Phase**:
   - Railway scans your repository
   - It will detect: "Node.js application"
   - Shows detected files: `package.json`, `server.js`
   - **⚠️ WARNING**: It will try to deploy from ROOT directory first

6. **First Deployment Attempt**:
   - Railway will start building immediately
   - **This will FAIL** because it's looking in the wrong directory
   - You'll see build errors in the logs

#### 2.4 Configure Correct Backend Path

7. **Go to Project Settings**:
   - In Railway dashboard, click your project name
   - Click "Settings" tab (gear icon)
   - Scroll to "Build & Deploy" section

8. **Set Root Directory**:
   - **Root Directory**: Change from `.` to `backend`
   - **Build Command**: Should auto-fill to `npm install`
   - **Start Command**: Should auto-fill to `npm start`
   - Click "Save Changes"

#### 2.5 Trigger Rebuild

9. **Redeploy with Correct Settings**:
   - Go to "Deployments" tab
   - Click "Deploy Latest" or wait for auto-redeploy
   - Monitor build logs in real-time

#### 2.6 Build Process Details

10. **Watch the Build**:
    - **Phase 1**: Git clone from your repository
    - **Phase 2**: Navigate to `/backend` directory
    - **Phase 3**: Run `npm install` (installs dependencies)
    - **Phase 4**: Start application with `npm start`
    - **Success**: You'll see "Deployment live" message

#### 2.7 Verify Deployment

11. **Check Deployment Status**:
    - Green checkmark = Success
    - Red X = Failed (check logs)
    - Yellow loading = Still building

12. **Get Your Railway URL**:
    - In "Settings" tab, scroll to "Networking"
    - Click "Generate Domain" if no domain exists
    - Your URL format: `https://[random-name].railway.app`
    - **Save this URL** - you'll need it for frontend!

### Step 3: Set Environment Variables

1. **In Railway Dashboard**:
   - Go to your project
   - Click "Variables" tab
   - Add these variables:

   ```
   GEMINI_API_KEY = AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848
   FRONTEND_URL = https://goodtimesstudio.com
   NODE_ENV = production
   ```

2. **Click "Add Variable" for each one**

### Step 4: Deploy and Get URL

1. **Railway will automatically deploy**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Get your URL**:
   - In Railway dashboard, click "Settings"
   - Under "Networking", click "Generate Domain"
   - You'll get a URL like: `https://medical-interview-backend-production-abc123.railway.app`

## 🎯 Method 2: Deploy from Local Files (Alternative)

### Step 1: Prepare Backend Files

1. **Create a new folder** for Railway deployment:
   ```bash
   mkdir railway-backend
   cd railway-backend
   ```

2. **Copy backend files**:
   - Copy all files from `/backend` folder to `railway-backend`
   - Make sure you have: `server.js`, `package.json`, `.env` (optional)

### Step 2: Deploy via Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize and Deploy**:
   ```bash
   railway init
   railway up
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set GEMINI_API_KEY=AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848
   railway variables set FRONTEND_URL=https://goodtimesstudio.com
   railway variables set NODE_ENV=production
   ```

## ✅ Step 5: Test Your Deployment

1. **Check Health Endpoint**:
   - Visit: `https://your-railway-url.railway.app/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Test API Endpoints**:
   - Health: `GET https://your-railway-url.railway.app/health`
   - Transcript: `POST https://your-railway-url.railway.app/api/summarize-transcript`
   - Audio: `POST https://your-railway-url.railway.app/api/summarize-audio`

## 🔧 Detailed Troubleshooting for Railway Deployment

### Common Issues During Step 2:

#### Issue 1: "Cannot find module" during build
**Symptoms**: Build fails with module not found errors
**Solutions**:
1. Check that `backend/package.json` exists
2. Verify Root Directory is set to `backend` (not `.` or empty)
3. In Railway logs, look for: `npm install` running in `/app/backend`
4. If still failing, check that all dependencies are in `package.json`

#### Issue 2: "Permission denied" or GitHub access errors
**Symptoms**: Cannot see repositories or access denied
**Solutions**:
1. Go to GitHub.com → Settings → Applications → Authorized GitHub Apps
2. Find "Railway" and click "Configure"
3. Make sure your repository is selected
4. If still issues, revoke and re-authorize Railway

#### Issue 3: Build succeeds but app won't start
**Symptoms**: Build completes but deployment fails at startup
**Solutions**:
1. Check Railway logs for error messages
2. Common fix: Ensure `server.js` uses `process.env.PORT`
3. Verify `package.json` start script: `"start": "node server.js"`
4. Check that environment variables are set (next step)

#### Issue 4: Can't find repository in Railway
**Symptoms**: Your repo doesn't appear in Railway's repository list
**Solutions**:
1. Make sure repo is pushed to GitHub (check github.com)
2. If private repo, ensure Railway has access
3. Refresh the page in Railway
4. Try disconnecting and reconnecting GitHub

#### Issue 5: Railway keeps deploying from wrong directory
**Symptoms**: Still getting "package.json not found" even after setting Root Directory
**Solutions**:
1. Settings → Build & Deploy → Root Directory → `backend`
2. Click "Save Changes" button (important!)
3. Go to Deployments → Click "Deploy Latest"
4. Watch logs to confirm it's now looking in `/app/backend`

### Railway Dashboard Navigation Guide:

1. **Overview Tab**: Shows general project info and quick stats
2. **Deployments Tab**: 
   - Lists all deployment attempts
   - Click on any deployment to see detailed logs
   - Green = success, Red = failed, Yellow = building
3. **Logs Tab**: Real-time application logs (after successful deploy)
4. **Variables Tab**: Where you'll add environment variables (Step 3)
5. **Settings Tab**: 
   - Build configuration (Root Directory here!)
   - Domain settings
   - Danger zone (delete project)

### Step-by-Step Log Watching:

When you trigger a deployment, watch these log phases:
1. **Git Clone**: `Cloning repository...`
2. **Directory Check**: Should show `/app/backend` if configured correctly
3. **Install Phase**: `npm install` with dependency downloads
4. **Build Complete**: `Build completed successfully`
5. **Start Phase**: `Starting application...`
6. **Success**: `Server is running on port...`

### What Success Looks Like:

In Railway logs, you should see:
```
✅ Git clone completed
✅ Changed directory to /app/backend
✅ Running npm install...
✅ Dependencies installed
✅ Starting with: npm start
✅ Server is running on port 3001
✅ Deployment is live at: https://your-app.railway.app
```

## 💰 Railway Pricing

- **Hobby Plan**: $5/month (recommended)
  - 500 hours of usage
  - Custom domains
  - More resources

- **Free Tier**: Limited usage
  - Good for testing
  - May sleep after inactivity

## 📝 Next Steps After Deployment

1. **Save your Railway URL**: `https://your-app.railway.app`
2. **Update frontend**: Use the build script with your Railway URL
3. **Test full application**: Frontend → Backend → Google AI
4. **Monitor logs**: Check Railway dashboard for any issues

## 🚀 Quick Deploy Checklist

- [ ] Backend files ready in `/backend` folder
- [ ] GitHub repository created and pushed
- [ ] Railway account created
- [ ] Repository connected to Railway
- [ ] Root directory set to `backend`
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Health endpoint responding
- [ ] Railway URL saved for frontend configuration

**Your Railway URL will be**: `https://[your-project-name].railway.app`
