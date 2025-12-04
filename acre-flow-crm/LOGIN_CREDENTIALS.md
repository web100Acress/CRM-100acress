# Department System - Login Credentials

## Quick Reference

### Sales Head
```
Email:    sales@example.com
Password: sales123
URL:      http://localhost:8080/login
Redirect: /sales-head-dashboard
```

### HR Manager
```
Email:    hr@example.com
Password: hr123
URL:      http://localhost:8080/login
Redirect: /hr-dashboard
```

### Blog Manager
```
Email:    blog@example.com
Password: blog123
URL:      http://localhost:8080/login
Redirect: /blog-dashboard
```

### Developer
```
Email:    amandev@gmail.com
Password: dev123
URL:      http://localhost:8080/login
Redirect: /developer-dashboard
```

### HR/Finance (Existing)
```
Email:    amanhr@gmail.com
Password: hr123
URL:      http://localhost:8080/login
Redirect: /hr-finance
```

### IT Infrastructure (Existing)
```
Email:    amanit@gmail.com
Password: it123
URL:      http://localhost:8080/login
Redirect: /it-infrastructure
```

---

## Department Features

### 🏢 Sales Head Dashboard
- Sales Overview with revenue tracking
- Team Management
- Performance Metrics
- Color: Blue

### 👥 HR Dashboard
- Employee Management
- Attendance Tracking
- Department Distribution
- Color: Purple

### 📝 Blog Dashboard
- Blog Post Management
- Engagement Metrics
- Performance Tracking
- Color: Orange

### 👨‍💻 Developer Dashboard
- System Overview
- Role Assignment (NEW)
- Create Employee
- Chat

---

## How to Test

1. Open browser to `http://localhost:8080/login`
2. Enter credentials from above
3. Click Login
4. You'll be redirected to your department dashboard
5. Explore the features in the sidebar
6. Click Logout to return to login page

---

## Notes

- All credentials are case-sensitive
- Passwords are minimum 6 characters
- Each department has a unique dashboard
- Sidebar shows quick stats for each department
- Mobile-responsive design
- Use Role Assignment tab in Developer section to assign users to departments
