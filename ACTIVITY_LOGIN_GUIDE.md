# Activity Hub - Login & Setup Guide

## 🔐 Two-Step Login Process

The Activity Hub uses a two-step login process:

### Step 1: Login to CRM (Main System)
**URL:** `http://localhost:5173/login`

Use your CRM credentials:
- **Email:** amandev@gmail.com (or your developer account)
- **Password:** dev123 (or your password)

### Step 2: Access Activity Hub

After logging in to CRM:

#### Option A: Create Department Credentials (Developer Only)
1. Go to Developer section
2. Click "Activity Hub" tab
3. Click "Create Department" button
4. Fill in department details
5. Submit
6. Credentials sent to email

#### Option B: Login with Existing Department Credentials
1. Go to `http://localhost:5173/activity-login`
2. Enter department email and password
3. Access Activity Dashboard

---

## 📋 Test Accounts

### CRM Main Login
```
Email: amandev@gmail.com
Password: dev123
Role: Developer
```

### Activity Department Logins (Create These First)
After creating departments in Developer section:

```
Department: IT
Email: it@example.com
Password: IT@12345

Department: Sales
Email: sales@example.com
Password: Sales@12345

Department: HR
Email: hr@example.com
Password: HR@12345
```

---

## 🚀 Complete Setup Flow

### Step 1: Start Servers
```bash
# Terminal 1
cd crm-backend
npm run dev

# Terminal 2
cd acre-flow-crm
npm run dev
```

### Step 2: Login to CRM
1. Go to `http://localhost:5173/login`
2. Enter: amandev@gmail.com / dev123
3. Click "Sign In"

### Step 3: Create Activity Departments
1. Navigate to Developer section
2. Click "Activity Hub" tab
3. Click "Create Department"
4. Fill form:
   - **Department:** IT
   - **Email:** it@example.com
   - **Password:** IT@12345 (or click Generate)
   - **Description:** IT Department
   - **Color:** Blue
5. Click "Create Department"
6. Repeat for Sales, HR, etc.

### Step 4: Login to Activity Hub
1. Go to `http://localhost:5173/activity-login`
2. Enter: it@example.com / IT@12345
3. Click "Login to Activity Hub"
4. You're now in Activity Dashboard!

---

## ❌ "User not found" Error

### Cause
The email you're trying to login with doesn't exist in the system.

### Solutions

#### If You're Trying to Login to CRM:
Use one of these accounts:
- amandev@gmail.com / dev123
- Or create a new user in the system

#### If You're Trying to Login to Activity Hub:
1. First login to CRM with developer account
2. Go to Developer → Activity Hub
3. Create department credentials
4. Then use those credentials at `/activity-login`

---

## 🔄 Complete User Journey

```
1. Start Frontend & Backend
   ↓
2. Go to http://localhost:5173/login
   ↓
3. Login with CRM credentials (amandev@gmail.com / dev123)
   ↓
4. Navigate to Developer section
   ↓
5. Click "Activity Hub" tab
   ↓
6. Click "Create Department"
   ↓
7. Fill form and submit
   ↓
8. Go to http://localhost:5173/activity-login
   ↓
9. Login with department credentials
   ↓
10. Access Activity Dashboard
   ↓
11. Submit reports, share files, post content, share thoughts
```

---

## 📍 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| CRM Login | http://localhost:5173/login | Main system login |
| Developer Section | http://localhost:5173/developer | Create department credentials |
| Activity Login | http://localhost:5173/activity-login | Department login |
| Activity Dashboard | http://localhost:5173/activity-dashboard | Main Activity Hub |

---

## 🎯 Quick Start (5 Minutes)

1. **Start servers** (if not running)
2. **Go to** `http://localhost:5173/login`
3. **Login with:** amandev@gmail.com / dev123
4. **Navigate to:** Developer → Activity Hub
5. **Click:** Create Department
6. **Fill:** IT / it@example.com / IT@12345
7. **Submit**
8. **Go to:** `http://localhost:5173/activity-login`
9. **Login with:** it@example.com / IT@12345
10. **Start using Activity Hub!**

---

## ✅ Verification Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 5173
- [ ] Can login to CRM with amandev@gmail.com
- [ ] Can access Developer section
- [ ] Can see "Activity Hub" tab
- [ ] Can create department
- [ ] Email received with credentials (check spam)
- [ ] Can login to Activity Hub
- [ ] Can see Activity Dashboard
- [ ] Can submit reports/files/content/thoughts

---

## 🆘 Troubleshooting

### "User not found" at CRM Login
- Use correct email: amandev@gmail.com
- Check password: dev123
- Verify backend is running

### "User not found" at Activity Login
- You must create department first
- Go to Developer → Activity Hub
- Create department credentials
- Then use those at Activity Login

### Can't access Developer section
- Must be logged in to CRM first
- Must have developer role
- Check localStorage for token

### Department not created
- Check backend logs for errors
- Verify MongoDB is running
- Check email configuration

---

## 📧 Email Credentials

If you don't receive credentials email:

1. **Check spam folder**
2. **Verify email config** in `.env`:
   ```
   EMAIL_USER=devfoliomarketplace@gmail.com
   EMAIL_PASSWORD=viwl ditr gqms ffur
   ```
3. **Check backend logs** for email errors
4. **Manually note credentials** from form before submitting

---

## 🎓 Next Steps

After successful login:

1. **Submit a Report**
   - Click Reports tab
   - Click "Submit Report"
   - Fill form and submit

2. **Share a File**
   - Click Files tab
   - Click "Share File"
   - Fill form and submit

3. **Post Content**
   - Click Content tab
   - Click "Post Content"
   - Fill form and submit

4. **Share Thoughts**
   - Click Thoughts tab
   - Click "Share Thought"
   - Fill form and submit

5. **Collaborate**
   - Like posts
   - Comment on content
   - Reply to thoughts
   - Filter by department

---

## 💡 Tips

- Create multiple departments to test cross-department visibility
- All submissions are visible to all departments
- Like, comment, and reply features are available
- Filter by department to see specific submissions
- Logout and login as different department to verify visibility

Enjoy collaborating! 🚀
