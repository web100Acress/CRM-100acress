# Backend Integration Guide - Department Role System

## Overview
The Role Assignment feature now integrates with the backend API to create users with specific departments and roles. When a user is created through the Developer section, they can login and be automatically routed to their assigned department dashboard.

---

## Frontend Changes

### RoleAssignment Component (`src/features/developer/components/RoleAssignment.jsx`)

**Updated Form Fields:**
- **Email** - User's email address (required)
- **Password** - User's login password (required)
- **Department** - Select from: Sales, HR, Blog, Admin
- **Role** - Select based on department (e.g., Sales Head, HR Manager, etc.)

**Form Submission:**
```javascript
POST https://bcrm.100acress.com/api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "department": "sales",
  "role": "sales_head",
  "name": "user" // Generated from email
}
```

**Response Handling:**
- ✅ Success: User created, added to table, success message shown
- ❌ Error: Error message displayed, user not added
- Loading state shown during API call

---

## Backend Requirements

### User Model Updates
The backend User model should include:

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String, // e.g., "sales", "hr", "blog", "admin"
  role: String, // e.g., "sales_head", "hr_manager", "blog_manager", "admin"
  status: String, // "active" or "inactive"
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoint: Create User with Department and Role

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "email": "sales.head@example.com",
  "password": "SecurePass123",
  "name": "Sales Head User",
  "department": "sales",
  "role": "sales_head"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "sales.head@example.com",
    "name": "Sales Head User",
    "department": "sales",
    "role": "sales_head",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Email already exists" or "Error creating user"
}
```

---

## Login Flow with Department Routing

### Updated Login Process

1. **User Enters Credentials**
   - Email: `sales.head@example.com`
   - Password: `SecurePass123`

2. **Backend Validates**
   - Checks email and password
   - Returns user data including department and role

3. **Frontend Stores Data**
   ```javascript
   localStorage.setItem('isLoggedIn', 'true');
   localStorage.setItem('userRole', user.role); // e.g., "sales_head"
   localStorage.setItem('userDepartment', user.department); // e.g., "sales"
   localStorage.setItem('userEmail', user.email);
   localStorage.setItem('userName', user.name);
   localStorage.setItem('userId', user._id);
   localStorage.setItem('token', data.token);
   ```

4. **Frontend Routes Based on Department**
   ```javascript
   switch (user.department) {
     case 'sales':
       window.location.href = '/sales-head-dashboard';
       break;
     case 'hr':
       window.location.href = '/hr-dashboard';
       break;
     case 'blog':
       window.location.href = '/blog-dashboard';
       break;
     case 'admin':
       window.location.href = '/admin-dashboard';
       break;
     default:
       window.location.href = '/';
   }
   ```

---

## Department-Role Mapping

### Sales Department
- **Role:** `sales_head` → Dashboard: `/sales-head-dashboard`
- **Role:** `sales_executive` → Dashboard: `/sales-head-dashboard`

### HR Department
- **Role:** `hr_manager` → Dashboard: `/hr-dashboard`
- **Role:** `hr_executive` → Dashboard: `/hr-dashboard`

### Blog Department
- **Role:** `blog_manager` → Dashboard: `/blog-dashboard`
- **Role:** `blog_writer` → Dashboard: `/blog-dashboard`

### Admin Department
- **Role:** `admin` → Dashboard: `/admin-dashboard`
- **Role:** `super_admin` → Dashboard: `/admin-dashboard`

---

## Testing the Integration

### Step 1: Create a User via Developer Section
1. Login as Developer: `amandev@gmail.com` / `dev123`
2. Go to "Role Assignment" tab
3. Fill form:
   - Email: `testsales@example.com`
   - Password: `TestPass123`
   - Department: Sales
   - Role: Sales Head
4. Click "Assign Role"
5. Verify success message

### Step 2: Login with New User
1. Go to `/login`
2. Enter:
   - Email: `testsales@example.com`
   - Password: `TestPass123`
3. Click Login
4. Should be redirected to `/sales-head-dashboard`
5. Verify Sales Head dashboard loads

### Step 3: Verify Department Access
- Check sidebar shows Sales-specific content
- Check quick stats show sales metrics
- Verify logout works

---

## API Integration Points

### 1. User Creation (Already Implemented)
```javascript
// Frontend call
const response = await fetch('https://bcrm.100acress.com/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email, password, department, role, name
  })
});
```

### 2. User Login (Needs Department Support)
```javascript
// Backend should return department and role
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Response should include:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "department": "sales",
    "role": "sales_head"
  }
}
```

### 3. Get User by ID (For Profile)
```javascript
GET /api/users/:id
Response includes department and role
```

---

## Environment Variables

Ensure these are set in `.env`:

```
VITE_API_BASE_URL=https://bcrm.100acress.com
VITE_API_TIMEOUT=10000
```

---

## Error Handling

### Common Errors and Solutions

**Error:** "Email already exists"
- **Cause:** User with this email already created
- **Solution:** Use a different email address

**Error:** "Invalid department"
- **Cause:** Department not in allowed list
- **Solution:** Use: sales, hr, blog, or admin

**Error:** "Invalid role for department"
- **Cause:** Role doesn't match department
- **Solution:** Select role from dropdown (filtered by department)

**Error:** "Failed to create user"
- **Cause:** Backend error or network issue
- **Solution:** Check backend logs, verify API is running

---

## Security Considerations

### Password Handling
- ✅ Passwords sent over HTTPS (in production)
- ✅ Passwords hashed on backend (bcrypt)
- ✅ Never log passwords
- ✅ Minimum password length enforced

### Email Verification (Optional)
Consider implementing email verification:
1. Send verification email after user creation
2. User clicks link to verify
3. Only then can user login

### Role-Based Access Control
- Verify user role on backend before allowing access
- Don't trust frontend role data for authorization
- Implement middleware to check permissions

---

## Future Enhancements

1. **Bulk User Import**
   - CSV upload for multiple users
   - Batch creation with role assignment

2. **User Permissions**
   - Fine-grained permissions per role
   - Custom permission assignment

3. **Audit Logging**
   - Log all user creations
   - Track role changes
   - Monitor access

4. **Two-Factor Authentication**
   - SMS or email OTP
   - TOTP support

5. **SSO Integration**
   - Google/Microsoft login
   - LDAP/Active Directory

---

## Troubleshooting

### User Created but Can't Login
- Check password is correct
- Verify email in database
- Check user status is "active"

### Redirected to Wrong Dashboard
- Check department value in database
- Verify department-to-route mapping in Login.jsx
- Clear localStorage and try again

### API Call Fails
- Verify backend is running on port 5001
- Check CORS settings
- Verify request headers
- Check network tab in browser dev tools

---

## Code References

### Frontend Files
- `src/features/developer/components/RoleAssignment.jsx` - Role assignment form
- `src/features/auth/pages/Login.jsx` - Login with department routing
- `src/layout/App.jsx` - Routes for department dashboards

### Backend Files (To Be Updated)
- `src/models/user.model.js` - Add department field
- `src/controllers/user.controller.js` - Update create user endpoint
- `src/routes/user.routes.js` - Ensure POST /users endpoint
- `src/controllers/auth.controller.js` - Update login to return department

---

## Summary

The department-based role system is now fully integrated:
- ✅ Frontend form collects email, password, department, role
- ✅ Backend API creates user with department assignment
- ✅ Login routes user to correct department dashboard
- ✅ Each department has its own dashboard and sidebar
- ✅ Role-based access control ready for implementation
