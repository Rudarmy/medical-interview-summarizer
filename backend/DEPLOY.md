# Backend Deployment Guide

## 🚀 Deploy to Railway (Recommended)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select this repository** and choose the `/backend` folder
5. **Set Environment Variables**:
   - `GEMINI_API_KEY` = `AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848`
   - `FRONTEND_URL` = `https://goodtimesstudio.com`
   - `PORT` = `3001` (Railway will override this)

6. **Deploy** - Railway will automatically:
   - Install dependencies
   - Start your server
   - Give you a URL like: `https://your-app-name.railway.app`

## 🚀 Alternative: Deploy to Render

1. **Go to [Render.com](https://render.com)**
2. **Create Web Service** from GitHub
3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     - `GEMINI_API_KEY` = `AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848`
     - `FRONTEND_URL` = `https://goodtimesstudio.com`

## 🚀 Alternative: Deploy to Heroku

1. **Install Heroku CLI**
2. **In backend folder**:
   ```bash
   heroku create your-app-name
   heroku config:set GEMINI_API_KEY=AIzaSyBD3V4aNlW-2MPC4b4S8e1fsoGxPs5E848
   heroku config:set FRONTEND_URL=https://goodtimesstudio.com
   git init
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## 📝 After Deployment

1. **Note your backend URL** (e.g., `https://your-app.railway.app`)
2. **Test the health endpoint**: `https://your-app.railway.app/health`
3. **Update frontend** to use this URL (Step 2 below)
