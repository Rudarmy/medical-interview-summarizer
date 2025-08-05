@echo off
REM Medical Interview Summarizer - Production Build Script for Windows

echo 🚀 Building Medical Interview Summarizer for Production...

REM Check if backend URL is provided
if "%1"=="" (
    echo ❌ Error: Please provide your backend URL
    echo Usage: build-production.bat https://your-backend.railway.app
    exit /b 1
)

set BACKEND_URL=%1

REM Create production environment file
echo 🔧 Setting up production environment...
echo VITE_API_URL=%BACKEND_URL%/api > .env.production

REM Build the project
echo 📦 Building project...
npm run build

echo ✅ Build complete!
echo 📁 Files ready in dist/ folder
echo 🌐 Backend URL configured: %BACKEND_URL%/api
echo.
echo 📋 Next steps:
echo 1. Test your backend health: %BACKEND_URL%/health
echo 2. Upload dist/ folder contents to https://goodtimesstudio.com/
echo 3. Test your deployed application
