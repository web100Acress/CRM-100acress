#!/bin/bash

# 🚀 Docker Deployment Fix for Production
# This script rebuilds the Docker container with proper environment variables

echo "🔧 Fixing Docker environment variables..."

# Stop current container
echo "🛑 Stopping current container..."
docker stop crm-backend

# Remove current container
echo "🗑️ Removing current container..."
docker rm crm-backend

# Rebuild with new environment variables
echo "🔨 Rebuilding Docker container..."
docker-compose build backend

# Start the container
echo "🚀 Starting Docker container..."
docker-compose up -d backend

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check container logs
echo "📋 Checking container logs..."
docker logs crm-backend

# Test the API
echo "🧪 Testing API health..."
curl -f https://bcrm.100acress.com/health || echo "❌ Health check failed"

echo "✅ Docker deployment complete!"
echo "🎯 Test: https://bcrm.100acress.com/api/website-enquiries/debug"
