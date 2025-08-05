#!/bin/bash

# Railway Deployment Checker Script
# Run this to verify your backend is ready for Railway

echo "🔍 Railway Deployment Readiness Check"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found"
    echo "   Make sure you're in the project root directory"
    exit 1
fi

echo "✅ Backend folder structure: OK"

# Check package.json
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: backend/package.json not found"
    exit 1
fi

echo "✅ Package.json exists: OK"

# Check for start script
if grep -q '"start"' backend/package.json; then
    echo "✅ Start script found: OK"
else
    echo "❌ Warning: No start script in package.json"
    echo "   Add: \"start\": \"node server.js\""
fi

# Check server.js for PORT configuration
if grep -q "process.env.PORT" backend/server.js; then
    echo "✅ Dynamic PORT configuration: OK"
else
    echo "❌ Warning: Server should use process.env.PORT"
    echo "   Current: const PORT = process.env.PORT || 3001;"
fi

# Check for environment variables template
if [ -f "backend/.env" ]; then
    echo "✅ Environment file exists: OK"
    echo "📝 Remember to set these in Railway:"
    echo "   - GEMINI_API_KEY"
    echo "   - FRONTEND_URL"
    echo "   - NODE_ENV=production"
else
    echo "⚠️  No .env file (this is OK for Railway)"
fi

# Check dependencies
echo ""
echo "📦 Required dependencies in package.json:"
if grep -q '"express"' backend/package.json; then
    echo "✅ express: Found"
else
    echo "❌ express: Missing"
fi

if grep -q '"cors"' backend/package.json; then
    echo "✅ cors: Found"
else
    echo "❌ cors: Missing"
fi

if grep -q '"@google/generative-ai"' backend/package.json; then
    echo "✅ @google/generative-ai: Found"
else
    echo "❌ @google/generative-ai: Missing"
fi

echo ""
echo "🚂 Railway Deployment Checklist:"
echo "1. [ ] Push code to GitHub"
echo "2. [ ] Create Railway project"
echo "3. [ ] Set Root Directory to 'backend'"
echo "4. [ ] Add environment variables:"
echo "       GEMINI_API_KEY=your_api_key"
echo "       FRONTEND_URL=https://goodtimesstudio.com"
echo "       NODE_ENV=production"
echo "5. [ ] Deploy and test health endpoint"
echo ""
echo "🔗 After deployment, test:"
echo "   https://your-railway-url.railway.app/health"
echo ""
echo "✅ Your backend appears ready for Railway deployment!"
