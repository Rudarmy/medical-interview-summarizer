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

### Step 2: Deploy on Railway

1. **Go to Railway.app**:
   - Visit: https://railway.app
   - Click "Start a New Project"

2. **Connect GitHub**:
   - Click "Deploy from GitHub repo"
   - If not connected, click "Configure GitHub App"
   - Authorize Railway to access your repositories

3. **Select Repository**:
   - Find your `medical-interview-summarizer` repository
   - Click on it

4. **Configure Deployment**:
   - Railway will auto-detect it's a Node.js project
   - It will automatically run `npm install` and `npm start`
   - **IMPORTANT**: Railway will deploy the ROOT directory by default

5. **Configure Root Path for Backend**:
   - In Railway dashboard, go to "Settings"
   - Under "Build & Deploy", set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

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

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Railway build logs
   - Ensure `package.json` has correct start script
   - Verify Node.js version compatibility

2. **Server Won't Start**:
   - Check environment variables are set
   - Verify PORT is using `process.env.PORT`
   - Check Railway deployment logs

3. **CORS Errors**:
   - Verify `FRONTEND_URL` environment variable
   - Check your domain is listed in CORS origins

4. **API Key Errors**:
   - Verify `GEMINI_API_KEY` environment variable
   - Test API key works in Google AI Studio

### Railway Dashboard Navigation:

1. **Deployments**: See build and deployment history
2. **Logs**: Real-time server logs and errors
3. **Metrics**: CPU, memory, and request metrics
4. **Variables**: Environment variables
5. **Settings**: Domain, build settings, danger zone

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
