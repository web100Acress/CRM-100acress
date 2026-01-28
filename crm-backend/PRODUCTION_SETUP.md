# Production Environment Setup for Website Enquiries

## Permanent Solution for Production Website Enquiries

This setup provides multiple authentication methods to ensure website enquiries work reliably in production.

## Environment Variables

Add these to your production environment (.env or hosting platform):

```bash
# Core Configuration
PORT=5001
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT Configuration  
JWT_SECRET=your_jwt_secret_key_min_32_chars

# 100acress Backend Integration (Primary)
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Admin JWT from 100acress
BACKEND_URL=https://your-100acress-backend.com        # Production 100acress URL

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="CRM <your-email@gmail.com>"

# Frontend URL
FRONTEND_URL=https://bcrm.100acress.com
```

## Authentication Methods (Fallback System)

The system now supports multiple authentication methods in order of preference:

### Method 1: Service Token (Primary)
```bash
SERVICE_TOKEN=<admin_jwt_from_100acress>
```
- Uses dedicated service token
- Most reliable method
- Recommended for production

### Method 2: User Token (Fallback)
- Uses current user's JWT token
- Works if user is admin in 100acress
- Automatic fallback

### Method 3: No Token (Public Access)
- Tries without authentication
- Works if 100acress allows public admin access
- Last resort fallback

## Role-Based Access

Allowed roles for website enquiries:
- `boss` ✅
- `admin` ✅  
- `super-admin` ✅
- `head-admin` ✅

## How to Get SERVICE_TOKEN

### Option A: From 100acress Application
1. Login to 100acress as admin
2. Open Browser DevTools (F12)
3. Go to Application → Local Storage
4. Copy the `token` value
5. Paste as `SERVICE_TOKEN`

### Option B: From API
```bash
curl -X POST https://your-100acress-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@100acress.com","password":"admin_password"}'
```

## Production Deployment

### For Vercel/Render/Heroku:
```bash
# Set environment variables in hosting platform
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BACKEND_URL=https://your-100acress-backend.com
NODE_ENV=production
```

### For Docker:
```dockerfile
ENV SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ENV BACKEND_URL=https://your-100acress-backend.com
ENV NODE_ENV=production
```

### For PM2/Server:
```bash
# In .env file
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BACKEND_URL=https://your-100acress-backend.com
NODE_ENV=production
```

## Testing the Integration

### 1. Check Configuration
```bash
curl -H "Authorization: Bearer <your_crm_token>" \
  https://bcrm.100acress.com/api/website-enquiries?limit=10
```

### 2. Expected Response
```json
{
  "success": true,
  "message": "Enquiries fetched successfully",
  "data": [...],
  "total": 1234,
  "meta": {
    "source": "100acress.com",
    "authMethod": "service-token",
    "apiBase": "https://your-100acress-backend.com",
    "fetchedAt": "2025-01-27T10:30:00.000Z",
    "userRole": "boss",
    "isProduction": true
  }
}
```

## Troubleshooting

### Common Issues and Solutions:

#### 1. "Service token not configured"
**Solution**: Add SERVICE_TOKEN to environment variables

#### 2. "Authentication failed" 
**Solution**: Check if SERVICE_TOKEN is valid and not expired

#### 3. "Access denied"
**Solution**: Ensure user has admin role in 100acress

#### 4. "API endpoint not found"
**Solution**: Verify BACKEND_URL is correct and 100acress is running

### Debug Information

The system provides detailed debug information in error responses:
```json
{
  "debug": {
    "authMethod": "user-token",
    "apiBase": "https://your-100acress-backend.com", 
    "hasServiceToken": true,
    "isProduction": true
  }
}
```

## Monitoring

Check backend logs for these messages:
```
🔍 Website Enquiries: User admin@100acress.com (boss) requesting data
🌐 Fetching from: https://your-100acress-backend.com/crm/enquiries?limit=10000
🔐 Auth method: service-token
✅ Successfully fetched 1234 enquiries from 100acress
```

## Security Notes

- SERVICE_TOKEN should be a long-lived admin JWT
- Regularly rotate SERVICE_TOKEN for security
- Monitor access logs for unauthorized attempts
- Use HTTPS in production

This permanent solution ensures website enquiries work reliably in production with multiple fallback mechanisms!
