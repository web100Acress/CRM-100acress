.# AWS EC2 Deployment Setup Guide

## 🚀 Complete AWS Deployment Steps

### 1. AWS Console Setup

#### Create EC2 Instance
1. Login to [AWS Console](https://console.aws.amazon.com/)
2. Go to EC2 Service
3. Click "Launch Instances"
4. **Instance Details:**
   - Name: `crm-production`
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: `t3.medium` (2 vCPU, 4GB RAM)
   - Key Pair: Create new key pair (download .pem file)

#### Security Group Configuration
1. Create Security Group: `crm-sg`
2. Inbound Rules:
   - HTTP (80) - Source: 0.0.0.0/0
   - HTTPS (443) - Source: 0.0.0.0/0
   - SSH (22) - Source: Your IP
   - Custom TCP (3000) - Source: 0.0.0.0/0

#### Storage Configuration
- Root Volume: 30GB GP3
- Add Volume: 20GB GP3 for MongoDB data

### 2. IAM User Setup

#### Create IAM User for GitHub Actions
1. Go to IAM Service → Users → Create User
2. Username: `github-actions-deployer`
3. Permissions: Attach existing policy → `AmazonEC2FullAccess`
4. Create Access Key:
   - Use case: Command Line Interface (CLI)
   - Save **Access Key ID** and **Secret Access Key**

### 3. GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
EC2_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
[your private key content here]
-----END RSA PRIVATE KEY-----
```

**Note:** Get EC2_INSTANCE_ID from your EC2 instance details in AWS console.

### 4. Repository Configuration

#### Update Repository URL
Edit `aws-deploy.sh` line 8:
```bash
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
```

#### Ensure Required Files
Make sure these files exist in your repository:
- `.github/workflows/deploy-aws.yml` ✅ (created)
- `aws-deploy.sh` ✅ (exists)
- `ecosystem.config.js` ✅ (exists)
- `nginx-crm.conf` ✅ (exists)

### 5. Initial Manual Setup (First Time Only)

SSH into your EC2 instance and run:
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git /var/www/crm
cd /var/www/crm

# Run initial setup script
chmod +x aws-deploy.sh
./aws-deploy.sh
```

### 6. Deploy with GitHub Actions

#### Automatic Deployment
- Push to `main` or `master` branch → Auto-deploys
- Pull request to main → Tests deployment
- Manual trigger → Go to Actions → Deploy to AWS EC2 → Run workflow

#### Manual Deployment
```bash
# Trigger workflow manually
gh workflow run "Deploy to AWS EC2"
```

## 🔧 Configuration Files

### ecosystem.config.js (PM2 Configuration)
```javascript
module.exports = {
  apps: [
    {
      name: 'crm-backend',
      script: './crm-backend/server.js',
      cwd: '/var/www/crm',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'crm-frontend',
      script: 'serve',
      cwd: '/var/www/crm/acre-flow-crm',
      args: '-s build -l 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    }
  ]
};
```

### nginx-crm.conf (Nginx Configuration)
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring & Management

### Check Application Status
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Check PM2 processes
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all

# Check Nginx status
sudo systemctl status nginx

# Check MongoDB status
sudo systemctl status mongod
```

### SSL Certificate Setup (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚨 Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
- Check security group allows SSH from your IP
- Verify .pem key permissions (chmod 400)
- Check instance is running

#### 2. Deployment Fails
- Check GitHub Actions logs
- Verify AWS credentials
- Check EC2 instance has enough disk space
- Verify all required files exist in repository

#### 3. Application Not Accessible
- Check Nginx status: `sudo systemctl status nginx`
- Check PM2 status: `pm2 status`
- Check ports: `sudo netstat -tlnp`
- View logs: `pm2 logs`

#### 4. MongoDB Connection Issues
- Check MongoDB status: `sudo systemctl status mongod`
- Verify MongoDB is running on port 27017
- Check firewall rules

### Cost Optimization
- Use `t3.medium` for production, `t3.micro` for testing
- Enable Elastic IP for static IP
- Set up CloudWatch alarms for monitoring
- Consider using RDS for MongoDB in production

## 🔄 CI/CD Pipeline

The GitHub Actions workflow includes:
1. ✅ Code checkout
2. ✅ AWS authentication
3. ✅ EC2 instance management
4. ✅ Application deployment
5. ✅ Health checks
6. ✅ Service restart
7. ✅ Cleanup

## 🌐 Access Your Application

After successful deployment:
- **Frontend**: `http://YOUR_EC2_PUBLIC_IP`
- **Backend API**: `http://YOUR_EC2_PUBLIC_IP/api`
- **Monitor**: SSH → `pm2 monit`

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. SSH into EC2 and check logs
3. Verify all configurations
4. Check AWS CloudTrail for API errors
