#!/bin/bash

# Vercel Deployment Verification Checklist
# Run this script to verify that your project is ready for Vercel deployment

echo "🔍 TMDb Movie Explorer - Vercel Deployment Verification"
echo "========================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

echo "📁 Checking Directory Structure..."
check_dir "api"
check_dir "api/movies"
check_dir "api/services"
check_dir "api/utils"
check_dir "frontend"
check_dir "backend"
echo ""

echo "📄 Checking Configuration Files..."
check_file "vercel.json"
check_file "tsconfig.json"
check_file "package.json"
check_file ".env.example"
check_file ".env.local"
check_file ".env.development"
check_file ".gitignore"
echo ""

echo "🔧 Checking API Files..."
check_file "api/movies.ts"
check_file "api/movies/[id].ts"
check_file "api/services/tmdb.service.ts"
check_file "api/utils/mapper.ts"
echo ""

echo "📦 Checking Frontend Files..."
check_file "frontend/src/api/movies.api.ts"
check_file "frontend/vite.config.ts"
check_file "frontend/package.json"
echo ""

echo "📚 Checking Documentation..."
check_file "README.md"
check_file "DEPLOYMENT.md"
check_file "QUICKSTART.md"
echo ""

echo "✨ Deployment Readiness Checklist"
echo "=================================="
echo ""
echo "Before deploying to Vercel, make sure:"
echo ""
echo -e "${YELLOW}[ ]${NC} API key added to .env.local:"
echo "    TMDB_API_KEY=your_actual_api_key"
echo ""
echo -e "${YELLOW}[ ]${NC} Tested locally:"
echo "    npm run dev (from root directory)"
echo ""
echo -e "${YELLOW}[ ]${NC} Pushed to GitHub:"
echo "    git add . && git commit -m 'Ready for Vercel' && git push"
echo ""
echo -e "${YELLOW}[ ]${NC} Created Vercel project at:"
echo "    https://vercel.com/new"
echo ""
echo -e "${YELLOW}[ ]${NC} Added TMDB_API_KEY to Vercel Environment Variables"
echo ""
echo -e "${GREEN}✓${NC} All files are in place!"
echo ""
echo "🚀 Ready to deploy? Visit: https://vercel.com/new"
echo ""
