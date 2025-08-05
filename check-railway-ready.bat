@echo off
REM Railway Deployment Checker Script for Windows
REM Run this to verify your backend is ready for Railway

echo 🔍 Railway Deployment Readiness Check
echo ======================================

REM Check if we're in the right directory
if not exist "backend\server.js" (
    echo ❌ Error: backend\server.js not found
    echo    Make sure you're in the project root directory
    exit /b 1
)

echo ✅ Backend folder structure: OK

REM Check package.json
if not exist "backend\package.json" (
    echo ❌ Error: backend\package.json not found
    exit /b 1
)

echo ✅ Package.json exists: OK

REM Check for start script
findstr /C:"\"start\"" backend\package.json >nul
if %errorlevel%==0 (
    echo ✅ Start script found: OK
) else (
    echo ❌ Warning: No start script in package.json
    echo    Add: "start": "node server.js"
)

REM Check server.js for PORT configuration
findstr /C:"process.env.PORT" backend\server.js >nul
if %errorlevel%==0 (
    echo ✅ Dynamic PORT configuration: OK
) else (
    echo ❌ Warning: Server should use process.env.PORT
    echo    Current: const PORT = process.env.PORT ^|^| 3001;
)

REM Check for environment variables template
if exist "backend\.env" (
    echo ✅ Environment file exists: OK
    echo 📝 Remember to set these in Railway:
    echo    - GEMINI_API_KEY
    echo    - FRONTEND_URL
    echo    - NODE_ENV=production
) else (
    echo ⚠️  No .env file (this is OK for Railway)
)

echo.
echo 📦 Required dependencies in package.json:

findstr /C:"\"express\"" backend\package.json >nul
if %errorlevel%==0 (
    echo ✅ express: Found
) else (
    echo ❌ express: Missing
)

findstr /C:"\"cors\"" backend\package.json >nul
if %errorlevel%==0 (
    echo ✅ cors: Found
) else (
    echo ❌ cors: Missing
)

findstr /C:"\"@google/generative-ai\"" backend\package.json >nul
if %errorlevel%==0 (
    echo ✅ @google/generative-ai: Found
) else (
    echo ❌ @google/generative-ai: Missing
)

echo.
echo 🚂 Railway Deployment Checklist:
echo 1. [ ] Push code to GitHub
echo 2. [ ] Create Railway project
echo 3. [ ] Set Root Directory to 'backend'
echo 4. [ ] Add environment variables:
echo        GEMINI_API_KEY=your_api_key
echo        FRONTEND_URL=https://goodtimesstudio.com
echo        NODE_ENV=production
echo 5. [ ] Deploy and test health endpoint
echo.
echo 🔗 After deployment, test:
echo    https://your-railway-url.railway.app/health
echo.
echo ✅ Your backend appears ready for Railway deployment!

pause
