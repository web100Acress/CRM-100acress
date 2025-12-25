#!/bin/bash

# AWS EC2 CRM Deployment Script
echo "🚀 Starting AWS CRM Deployment..."

# Variables
PROJECT_DIR="/var/www/crm"
REPO_URL="YOUR_GITHUB_REPO_URL"  # Replace with your repo URL

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install other software
echo "📦 Installing Nginx, PM2, Git..."
sudo apt install nginx git -y
sudo npm install -g pm2 serve

# Start MongoDB
echo "🔧 Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Clone project
echo "📥 Cloning project..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR
git clone $REPO_URL $PROJECT_DIR
cd $PROJECT_DIR

# Install dependencies and build
echo "🔨 Building application..."
cd acre-flow-crm
npm ci
npm run build

cd ../crm-backend
npm ci

# Start with PM2
echo "🚀 Starting services..."
cd $PROJECT_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp nginx-crm.conf /etc/nginx/sites-available/crm
sudo ln -s /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh

echo "✅ Deployment completed!"
echo "🌐 Access your CRM at: http://$(curl -s ifconfig.me)"
echo "📊 Backend API: http://$(curl -s ifconfig.me)/api"
