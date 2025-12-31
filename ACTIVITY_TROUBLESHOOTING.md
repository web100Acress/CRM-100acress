# Activity Hub - Troubleshooting Guide

## Error: net::ERR_CONNECTION_REFUSED

### What This Means
The frontend cannot connect to the backend server. The backend is either not running or not accessible at the expected URL.

### Root Cause
Backend server on `https://bcrm.100acress.com` is not running or crashed.

### Solution

#### Step 1: Check Backend Status
```bash
# Terminal 1 - Check if backend is running
cd crm-backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5001
MongoDB connected
```

#### Step 2: If Backend Crashed with Module Error
**Error Message:**
```
Error: Cannot find module '../middlewares/auth.middleware'
```

**Fix Applied:**
- Changed `activityRoutes.js` line 4 from:
  ```javascript
  const authMiddleware = require('../middlewares/auth.middleware');
  ```
  To:
  ```javascript
  const authMiddleware = require('../middlewares/auth');
  ```

**Status:** ✅ FIXED

#### Step 3: Restart Backend
```bash
# Kill the current process (Ctrl+C)
# Then restart
npm run dev
```

#### Step 4: Verify Connection
Open browser console and check:
- Network tab should show requests to `https://bcrm.100acress.com/api/activity/...`
- Status should be 200 (success) or 4xx (client error), NOT connection refused

---

## Common Errors & Solutions

### Error 1: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Cause:** Backend not running

**Solution:**
```bash
cd crm-backend
npm run dev
```

Wait for:
```
🚀 Server running on port 5001
MongoDB connected
```

---

### Error 2: "Cannot find module '../middlewares/auth.middleware'"

**Cause:** Wrong middleware file path

**Solution:** ✅ Already fixed in `activityRoutes.js`

File now correctly imports:
```javascript
const authMiddleware = require('../middlewares/auth');
```

---

### Error 3: "TypeError: Failed to fetch"

**Cause:** Backend not responding or CORS issue

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl https://bcrm.100acress.com/api/activity/departments
   ```

2. **Check CORS configuration** in `crm-backend/src/app.js`:
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',  // Frontend URL
     // ... other origins
   ];
   ```

3. **Verify frontend URL matches:**
   - Frontend should be on `http://localhost:5173`
   - If different, add to `allowedOrigins`

---

### Error 4: "MongoDB connected" but data not showing

**Cause:** Database connection issue or collections not created

**Solutions:**

1. **Verify MongoDB is running:**
   ```bash
   # Check if MongoDB service is running
   # Windows: Services → MongoDB
   # Mac: brew services list
   # Linux: sudo systemctl status mongod
   ```

2. **Check connection string** in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/crm
   ```

3. **Verify collections exist:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Check database `crm`
   - Collections should appear after first submission

---

## Startup Checklist

- [ ] MongoDB is running
- [ ] Backend started with `npm run dev`
- [ ] Backend shows "Server running on port 5001"
- [ ] Backend shows "MongoDB connected"
- [ ] Frontend started with `npm run dev`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] No errors in browser console
- [ ] Network requests show 200 status

---

## Port Conflicts

### If Port 5001 is Already in Use

**Find process using port 5001:**
```bash
# Windows
netstat -ano | findstr :5001

# Mac/Linux
lsof -i :5001
```

**Kill process:**
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

**Or use different port:**
```bash
# In crm-backend/.env
PORT=5002
```

Then update frontend API calls to use `http://localhost:5002`

---

## MongoDB Connection Issues

### Error: "MongoDB connection failed"

**Solutions:**

1. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Check connection string:**
   ```bash
   # Test connection
   mongosh mongodb://localhost:27017
   ```

3. **Verify .env file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/crm
   ```

---

## Frontend Issues

### Activity Dashboard Shows Empty

**Cause:** Backend not responding

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check Network tab in DevTools
4. Look for failed requests to `https://bcrm.100acress.com`

### Login Page Not Loading

**Cause:** Routes not registered

**Solution:**
1. Verify `App.jsx` has Activity routes:
   ```javascript
   <Route path="/activity-login" element={<ActivityLogin />} />
   <Route path="/activity-dashboard" element={<ActivityDashboard />} />
   ```

2. Clear browser cache and refresh

---

## Email Issues

### Credentials Not Received

**Cause:** Email service not configured

**Solution:**

1. **Check .env file:**
   ```
   EMAIL_USER=devfoliomarketplace@gmail.com
   EMAIL_PASSWORD=viwl ditr gqms ffur
   ```

2. **Verify Gmail app password:**
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate app password
   - Use in .env

3. **Check backend logs:**
   ```bash
   # Look for email sending logs
   # Should show "Email sent:" or error message
   ```

---

## Testing Connection

### Test Backend API Directly

```bash
# Get all departments
curl https://bcrm.100acress.com/api/activity/departments

# Should return:
# {"success":true,"data":[]}
```

### Test from Browser Console

```javascript
// Check if backend is accessible
fetch('https://bcrm.100acress.com/api/activity/departments')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err))
```

---

## Debug Mode

### Enable Detailed Logging

Add to `crm-backend/src/server.js`:
```javascript
// Enable request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Request Headers

In browser DevTools → Network tab:
- Click on request to `/api/activity/departments`
- Check "Request Headers"
- Should see `Authorization: Bearer <token>` if authenticated

---

## Quick Restart Guide

If everything is broken:

```bash
# Terminal 1 - Kill and restart backend
cd crm-backend
# Ctrl+C to stop
npm run dev

# Terminal 2 - Kill and restart frontend
cd acre-flow-crm
# Ctrl+C to stop
npm run dev

# Browser
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Go to http://localhost:5173/activity-login
```

---

## Getting Help

1. **Check browser console** for error messages
2. **Check backend logs** for server errors
3. **Verify all servers are running** (MongoDB, Backend, Frontend)
4. **Check .env file** for correct configuration
5. **Review this troubleshooting guide** for your specific error

---

## Summary

| Issue | Solution |
|-------|----------|
| Connection refused | Start backend with `npm run dev` |
| Module not found | ✅ Already fixed in activityRoutes.js |
| No data showing | Verify MongoDB running |
| Email not sent | Check .env email config |
| CORS error | Verify frontend URL in allowedOrigins |
| Port conflict | Use different port or kill process |

**Status:** All known issues documented and fixed. System ready for use! 🚀
