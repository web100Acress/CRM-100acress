#!/bin/bash

# CRM Production Deployment Script
# This script handles the complete deployment process

echo "🚀 Starting CRM Production Deployment..."

# Set environment variables
export NODE_ENV=production

# Backend Deployment
echo "📦 Deploying Backend..."
cd crm-backend

# Load environment variables
if [ -f ".env" ]; then
    echo "📝 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️ No .env file found, using production defaults"
fi

# Install dependencies
echo "📥 Installing backend dependencies..."
npm ci

# Start backend in background
echo "🔧 Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID
    exit 1
fi

# Frontend Deployment
echo "🎨 Deploying Frontend..."
cd ../acre-flow-crm

# Install dependencies
echo "📥 Installing frontend dependencies..."
npm ci

# Build frontend
echo "🔨 Building frontend for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Frontend built successfully!"
else
    echo "❌ Frontend build failed"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend (if needed)
echo "🌐 Starting frontend server..."
npm run preview &
FRONTEND_PID=$!

# Final check
echo "🔍 Performing final health checks..."

# Check backend
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    kill $BACKEND_PID $FRONTEND_PID
    exit 1
fi

# Check frontend
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "⚠️ Frontend might not be running on default port"
fi

echo "🎉 CRM Application deployed successfully!"
echo "📊 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:4173"
echo "📝 Backend PID: $BACKEND_PID"
echo "📝 Frontend PID: $FRONTEND_PID"

# Keep the script running to maintain services
echo "🔄 Keeping services alive... (Press Ctrl+C to stop)"
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
