#!/bin/bash

# AWS EC2 Initial Setup Script
# This script sets up a fresh EC2 instance for CRM deployment

set -e

echo "🚀 Setting up AWS EC2 instance for CRM deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential

# Install Node.js 20.x
print_status "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
print_status "Verifying Node.js installation..."
node --version
npm --version

# Install MongoDB 7.0
print_status "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
print_status "Starting MongoDB service..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB installation
print_status "Verifying MongoDB installation..."
mongod --version | head -n 1

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 globally
print_status "Installing PM2..."
sudo npm install -g pm2

# Install additional useful packages
print_status "Installing additional packages..."
sudo apt install -y htop zip unzip

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /var/www/crm
sudo mkdir -p /var/www/crm/logs
sudo chown -R ubuntu:ubuntu /var/www/crm

# Setup firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Create swap file (if needed)
if [ ! -f /swapfile ]; then
    print_status "Creating swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Optimize system settings for production
print_status "Optimizing system settings..."
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Create log rotation for PM2
print_status "Setting up log rotation..."
cat << EOF | sudo tee /etc/logrotate.d/pm2
/var/www/crm/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Install Certbot for SSL (optional)
print_status "Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Create monitoring script
print_status "Creating monitoring script..."
cat << 'EOF' > /var/www/crm/monitor.sh
#!/bin/bash

# Monitor script for CRM application
echo "=== CRM Application Status ==="
echo "Date: $(date)"
echo ""

echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""
echo "CPU Load:"
uptime
echo ""

echo "=== Services Status ==="
echo "MongoDB:"
sudo systemctl is-active mongod
echo "Nginx:"
sudo systemctl is-active nginx
echo ""

echo "=== PM2 Processes ==="
pm2 status
echo ""

echo "=== Recent Logs ==="
echo "Backend errors (last 10 lines):"
tail -n 10 /var/www/crm/logs/backend-error.log 2>/dev/null || echo "No backend error logs"
echo ""
echo "Frontend errors (last 10 lines):"
tail -n 10 /var/www/crm/logs/frontend-error.log 2>/dev/null || echo "No frontend error logs"
EOF

chmod +x /var/www/crm/monitor.sh

# Create backup script
print_status "Creating backup script..."
cat << 'EOF' > /var/www/crm/backup.sh
#!/bin/bash

# Backup script for CRM application
BACKUP_DIR="/var/backups/crm"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Creating backup..."

# Backup MongoDB
mongodump --db crm --out $BACKUP_DIR/mongodb_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www/crm .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongodb_*" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/crm/backup.sh

# Setup cron jobs
print_status "Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/crm/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Print system information
print_status "Setup completed! Here's your system information:"
echo ""
echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "IP Address: $(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo 'Unable to get IP')"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "MongoDB: $(mongod --version | head -n 1)"
echo "Nginx: $(nginx -v 2>&1)"
echo "PM2: $(pm2 --version)"
echo ""

echo "=== Service Status ==="
echo "MongoDB: $(sudo systemctl is-active mongod)"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo ""

echo "=== Next Steps ==="
echo "1. Clone your repository: git clone <your-repo> /var/www/crm"
echo "2. Install dependencies and build your application"
echo "3. Configure environment variables"
echo "4. Start services with PM2"
echo "5. Configure Nginx for your domain"
echo "6. Setup SSL certificate with certbot"
echo ""

echo "=== Useful Commands ==="
echo "Monitor application: /var/www/crm/monitor.sh"
echo "Backup application: /var/www/crm/backup.sh"
echo "PM2 status: pm2 status"
echo "PM2 logs: pm2 logs"
echo "Nginx config test: sudo nginx -t"
echo "Restart Nginx: sudo systemctl restart nginx"
echo ""

print_status "EC2 setup completed successfully! 🎉"
