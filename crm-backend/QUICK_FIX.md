# 🚀 Quick Fix for Production Website Leads

## 📋 Step-by-Step Instructions

### Step 1: Get Fresh Token (2 minutes)

1. **Open**: https://bcrm.100acress.com (CRM Login - NOT 100acress.com)
2. **Login**: 
   - Email: `info@100acress.com`
   - Password: `[Your CRM boss password]`
3. **DevTools**: Press `F12`
4. **Application Tab** → **Local Storage** → **https://bcrm.100acress.com**
5. **Find**: `token` key and **copy** the full value (starts with `eyJhbGciOiJIUzI1NiIs...`)

### Step 2: Update SERVICE_TOKEN (1 minute)

**Option A: Use the Script (Recommended)**
```bash
cd C:\Users\admin\OneDrive\Desktop\App\100-CRM\CRM-100acress\crm-backend
node update-service-token.js "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste_actual_token_here...rest_of_token"
```

**IMPORTANT**: Replace the entire token string, NOT the placeholder text!

**Option B: Manual Update**
Edit your `.env` file and replace:
```bash
# OLD (Expired)
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU1MGYwNDYzNzU1MzU0Yzc4ZGFkN2YiLCJlbWFpbCI6ImluZm9AMTAwYWNyZXNzLmNvbSIsInJvbGUiOiJib3NzIiwiaWF0IjoxNzY5NDkyNjcxLCJleHAiOjE3Njk1NzkwNzF9.usmOH7Vgt17pMzaDd6mNDGPtwJ48GwtCi6L5j9dJky4

# NEW (Fresh token from step 1)
SERVICE_TOKEN=<paste_fresh_token_here>
```

### Step 3: Add Missing Variables (if not present)
```bash
NODE_ENV=production
FRONTEND_URL=https://bcrm.100acress.com
```

### Step 4: Restart Backend (30 seconds)
```bash
pm2 restart crm-backend
```

### Step 5: Test (1 minute)
1. **Open**: https://bcrm.100acress.com
2. **Login** as boss
3. **Check console** for:
   ```
   ✅ Desktop: Website enquiries loaded: 3684 enquiries
   ✅ Desktop: All leads loaded successfully: 3695 total leads
   ```

4. **Test debug endpoint**:
   ```
   https://bcrm.100acress.com/api/website-enquiries/debug
   ```

## 🎯 Expected Results

### ✅ Before Fix:
```
❌ Desktop: Website enquiries response status: 500
❌ Total leads found for boss: 11 (only regular leads)
```

### ✅ After Fix:
```
✅ Desktop: Website enquiries loaded: 3684 enquiries
✅ Desktop: All leads loaded successfully: 3695 total leads
```

## 🚨 Troubleshooting

### If still not working:
1. **Check debug endpoint** for details
2. **Verify token is not expired**
3. **Ensure 100acress backend is running**
4. **Check CORS settings**

### Debug endpoint should show:
```json
{
  "success": true,
  "debug": {
    "environment": {
      "hasServiceToken": true,
      "serviceTokenLength": 233,
      "backendUrl": "https://api.100acress.com",
      "isProduction": true
    },
    "backendTest": {
      "status": 200,
      "ok": true
    }
  }
}
```

## ⏱️ Total Time: 5 minutes

This will fix the production website leads issue immediately! 🎯
