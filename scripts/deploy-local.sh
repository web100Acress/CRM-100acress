#!/bin/bash

# Local deployment script for testing
# This script simulates the deployment process locally

set -e

echo "🚀 Starting local deployment test..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "acre-flow-crm" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
if [ -d "acre-flow-crm" ]; then
    cd acre-flow-crm
    npm ci
    npm run build
    cd ..
else
    print_warning "Frontend directory not found, skipping frontend build"
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
if [ -d "crm-backend" ]; then
    cd crm-backend
    npm ci
    cd ..
else
    print_warning "Backend directory not found, skipping backend setup"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    npm install -g pm2
fi

# Check if MongoDB is running (local development)
if command -v mongod &> /dev/null; then
    print_status "MongoDB is installed"
    if ! pgrep mongod > /dev/null; then
        print_warning "MongoDB is not running. Start it with: mongod"
    else
        print_status "MongoDB is running"
    fi
else
    print_warning "MongoDB is not installed. Please install MongoDB for local development"
fi

# Start services with PM2 (if ecosystem.config.js exists)
if [ -f "ecosystem.config.js" ]; then
    print_status "Starting services with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    print_status "Services started. Check status with: pm2 status"
else
    print_warning "ecosystem.config.js not found, skipping PM2 start"
fi

# Check if Nginx is available
if command -v nginx &> /dev/null; then
    print_status "Nginx is installed"
    if [ -f "nginx-crm.conf" ]; then
        print_status "Nginx configuration file found"
        print_warning "To use Nginx, copy nginx-crm.conf to /etc/nginx/sites-available/ and enable it"
    fi
else
    print_warning "Nginx is not installed"
fi

print_status "Local deployment test completed! 🎉"
echo ""
echo "=== Next Steps ==="
echo "1. Start MongoDB if not running: mongod"
echo "2. Start backend: cd crm-backend && npm start"
echo "3. Start frontend: cd acre-flow-crm && npm start"
echo "4. Or use PM2: pm2 start ecosystem.config.js"
echo "5. Access application at: http://localhost:3000"
echo "6. Access API at: http://localhost:5000/api"
echo ""
echo "=== Useful Commands ==="
echo "PM2 status: pm2 status"
echo "PM2 logs: pm2 logs"
echo "Stop PM2: pm2 stop all"
echo "Restart PM2: pm2 restart all"
