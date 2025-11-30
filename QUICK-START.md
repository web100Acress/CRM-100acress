# 🚀 AWS EC2 Quick Start Guide

## ⚡ Fast Deployment Steps

### 1. AWS Console (5 minutes)
```bash
# 1. Launch EC2 Instance
# - Ubuntu 22.04 LTS
# - t3.medium (2 vCPU, 4GB RAM)
# - 30GB storage
# - Security Group: HTTP(80), HTTPS(443), SSH(22)

# 2. Create IAM User
# - Username: github-actions-deployer
# - Policy: AmazonEC2FullAccess
# - Generate Access Keys
```

### 2. GitHub Repository Setup (3 minutes)
```bash
# Add these secrets to GitHub Repository Settings:
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
EC2_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
[your .pem file content]
-----END RSA PRIVATE KEY-----
```

### 3. Initial EC2 Setup (One time, 10 minutes)
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/setup-ec2.sh
chmod +x setup.sh
./setup.sh

# Clone your repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git crm
cd crm
```

### 4. Deploy! (Automatic)
```bash
# Push to main branch → Auto-deploys
git push origin main

# Or trigger manually
gh workflow run "Deploy to AWS EC2"
```

## 📁 Files Created

✅ `.github/workflows/deploy-aws.yml` - GitHub Actions workflow  
✅ `scripts/setup-ec2.sh` - EC2 initial setup script  
✅ `scripts/deploy-local.sh` - Local testing script  
✅ `.env.production` - Production environment variables  
✅ `AWS-SETUP.md` - Detailed setup guide  

## 🔧 What Gets Installed

- **Node.js 20.x** - JavaScript runtime
- **MongoDB 7.0** - Database
- **Nginx** - Web server/reverse proxy
- **PM2** - Process manager
- **Certbot** - SSL certificates
- **Firewall** - Security configuration

## 🌐 Access Your Application

After deployment:
- **Frontend**: `http://YOUR_EC2_PUBLIC_IP`
- **Backend API**: `http://YOUR_EC2_PUBLIC_IP/api`
- **Monitor**: SSH → `pm2 monit`

## 🛠️ Useful Commands

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Check application status
/var/www/crm/monitor.sh

# View PM2 processes
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all

# Create backup
/var/www/crm/backup.sh
```

## 🚨 Troubleshooting

### Deployment Failed?
1. Check GitHub Actions logs
2. Verify AWS credentials
3. Check EC2 instance is running
4. Verify security group settings

### Application Not Accessible?
1. SSH into EC2
2. Check Nginx: `sudo systemctl status nginx`
3. Check PM2: `pm2 status`
4. Check MongoDB: `sudo systemctl status mongod`

### SSH Connection Issues?
1. Check security group allows SSH
2. Verify .pem key permissions: `chmod 400 your-key.pem`
3. Check instance is running

## 💰 Cost Optimization

- **Development**: t3.micro (~$8/month)
- **Production**: t3.medium (~$50/month)
- **Enable Elastic IP**: Free static IP
- **Monitor usage**: CloudWatch alerts

## 🔒 Security Best Practices

- ✅ Use IAM roles instead of root keys
- ✅ Enable firewall (UFW)
- ✅ Use HTTPS with SSL certificates
- ✅ Regular security updates
- ✅ Monitor access logs

## 📞 Need Help?

1. Check `AWS-SETUP.md` for detailed instructions
2. Review GitHub Actions workflow logs
3. SSH into EC2 and check logs
4. Verify all configurations match

---

**🎉 Your CRM will be live on AWS in minutes!**
