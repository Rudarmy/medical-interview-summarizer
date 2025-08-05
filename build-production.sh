#!/bin/bash

# Medical Interview Summarizer - Production Build Script

echo "🚀 Building Medical Interview Summarizer for Production..."

# Check if backend URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your backend URL"
    echo "Usage: ./build-production.sh https://your-backend.railway.app"
    exit 1
fi

BACKEND_URL="$1"

# Create production environment file
echo "🔧 Setting up production environment..."
echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production

# Build the project
echo "📦 Building project..."
npm run build

echo "✅ Build complete!"
echo "📁 Files ready in dist/ folder"
echo "🌐 Backend URL configured: ${BACKEND_URL}/api"
echo ""
echo "📋 Next steps:"
echo "1. Test your backend health: ${BACKEND_URL}/health"
echo "2. Upload dist/ folder contents to https://goodtimesstudio.com/"
echo "3. Test your deployed application"
