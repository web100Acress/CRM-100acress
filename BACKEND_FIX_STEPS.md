# Backend Fix - Complete Steps to Resolve 500 Error

## Problem
When creating a user with role `sales_head`, getting:
```
ValidationError: User validation failed: role: `sales_head` is not a valid enum value
```

## Root Cause
The backend server needs to be restarted to load the updated User model with new roles.

---

## Solution Steps

### Step 1: Verify Backend Files Are Updated ✅

**File: `crm-backend/src/models/userModel.js`**
- ✅ Already updated with new roles
- New roles added: `sales_head`, `sales_executive`, `hr_manager`, `hr_executive`, `blog_manager`, `blog_writer`

**File: `acre-flow-crm/src/features/auth/pages/Login.jsx`**
- ✅ Already updated with department routing
- New routes added for all department roles

---

### Step 2: Stop the Backend Server

**In your terminal where backend is running:**
```bash
# Press Ctrl+C to stop the server
```

---

### Step 3: Restart the Backend Server

**In the backend directory:**
```bash
cd crm-backend
npm start
```

**Expected output:**
```
Server running on port 5001
MongoDB connected successfully
```

---

### Step 4: Test User Creation

**In browser:**
1. Go to http://localhost:8080/login
2. Login as Developer: `amandev@gmail.com` / `dev123`
3. Go to "Role Assignment" tab
4. Fill form:
   ```
   Email:      testsales@example.com
   Password:   TestPass123
   Department: Sales
   Role:       Sales Head
   ```
5. Click "Assign Role"
6. Should see: ✅ "User created and assigned successfully!"

---

### Step 5: Test Login with New User

**In browser:**
1. Go to http://localhost:8080/login
2. Enter:
   ```
   Email:    testsales@example.com
   Password: TestPass123
   ```
3. Click Login
4. Should redirect to: `/sales-head-dashboard` ✅

---

## Verification Checklist

- [ ] Backend server restarted
- [ ] New user created successfully
- [ ] User appears in Role Assignment table
- [ ] New user can login
- [ ] Correct dashboard loads (Sales Head)
- [ ] Sidebar shows correct department (Sales)
- [ ] Quick stats display correctly

---

## If Still Getting Error

### Check 1: Verify Model File
```bash
# In crm-backend directory
cat src/models/userModel.js
# Should show all new roles in enum
```

### Check 2: Check Backend Logs
```bash
# Look for error messages in terminal
# Should show: "Server running on port 5001"
```

### Check 3: Clear Node Modules (If Needed)
```bash
cd crm-backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Check 4: Check Database Connection
```bash
# Verify MongoDB is running
# Check .env file has correct MONGO_URI
```

---

## Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "role is not a valid enum value" | Restart backend server |
| "Email already exists" | Use different email |
| "Cannot POST /api/users" | Check backend is running on 5001 |
| "Network error" | Check CORS settings in backend |
| "User not found after creation" | Check MongoDB connection |

---

## Files Modified

### Backend
- ✅ `crm-backend/src/models/userModel.js` - Added new roles to enum

### Frontend
- ✅ `acre-flow-crm/src/features/auth/pages/Login.jsx` - Added department routing
- ✅ `acre-flow-crm/src/features/developer/components/RoleAssignment.jsx` - Backend API integration

---

## Testing Credentials After Fix

### Create Test Users

**Test 1: Sales Head**
```
Email:      sales.test@example.com
Password:   SalesTest123
Department: Sales
Role:       Sales Head
```

**Test 2: HR Manager**
```
Email:      hr.test@example.com
Password:   HRTest123
Department: HR
Role:       HR Manager
```

**Test 3: Blog Manager**
```
Email:      blog.test@example.com
Password:   BlogTest123
Department: Blog
Role:       Blog Manager
```

**Test 4: Admin**
```
Email:      admin.test@example.com
Password:   AdminTest123
Department: Admin
Role:       Admin
```

---

## Expected Behavior After Fix

1. **User Creation**
   - Form accepts email, password, department, role
   - Backend validates role against enum
   - User created successfully
   - Success message shown

2. **User Login**
   - User enters credentials
   - Backend validates and returns user with department
   - Frontend routes to correct dashboard
   - Dashboard loads with correct sidebar

3. **Department Routing**
   - Sales Head → `/sales-head-dashboard`
   - HR Manager → `/hr-dashboard`
   - Blog Manager → `/blog-dashboard`
   - Admin → `/admin-dashboard`

---

## Summary

✅ Backend User model updated with new roles
✅ Frontend Login updated with department routing
✅ RoleAssignment component integrated with API
⏳ **ACTION NEEDED:** Restart backend server

**Next Step:** Restart the backend server and test!

---

## Support

If you continue to get errors:
1. Check backend console for detailed error message
2. Verify all files are saved correctly
3. Restart both frontend and backend
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try again
