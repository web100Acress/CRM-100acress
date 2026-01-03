# Department-Based Role System Guide

## Overview
A complete department-based role assignment system has been implemented. Users can be assigned to different departments (Sales, HR, Blog, Admin) from the Developer section, and they will see role-specific dashboards when they login.

## Departments & Features

### 1. **Sales Head Dashboard**
**Path:** `/sales-head-dashboard`
**Login Credentials:** 
- Email: `sales@example.com`
- Password: `sales123`

**Features:**
- Sales Overview with revenue, leads, team metrics
- Sales Team Management (add/edit/delete team members)
- Performance Metrics (win rate, conversion rate, deal size)
- Sidebar with quick stats (total revenue, active leads, conversion rate)
- Beautiful blue-themed UI

**Components:**
- `SalesHeadDashboard.jsx` - Main dashboard page
- `SalesHeadSidebar.jsx` - Navigation sidebar
- `SalesOverview.jsx` - Overview tab with charts
- `SalesTeam.jsx` - Team management interface
- `SalesMetrics.jsx` - Performance metrics

---

### 2. **HR Dashboard**
**Path:** `/hr-dashboard`
**Login Credentials:**
- Email: `hr@example.com`
- Password: `hr123`

**Features:**
- HR Overview with employee stats, attendance, leave tracking
- Employee Management (add/edit/delete employees)
- Attendance Tracking (daily attendance, monthly summary)
- Department distribution charts
- Sidebar with quick stats (total employees, present today, on leave)
- Purple-themed UI

**Components:**
- `HRDashboard.jsx` - Main dashboard page
- `HRSidebar.jsx` - Navigation sidebar
- `HROverview.jsx` - Overview tab with stats
- `EmployeeManagement.jsx` - Employee management interface
- `Attendance.jsx` - Attendance tracking

---

### 3. **Blog Dashboard**
**Path:** `/blog-dashboard`
**Login Credentials:**
- Email: `blog@example.com`
- Password: `blog123`

**Features:**
- Blog Overview with published posts, views, likes, comments
- Blog Post Management (create/edit/delete posts)
- Top performing posts tracking
- Engagement trends
- Sidebar with quick stats (published posts, drafts, total views)
- Orange-themed UI

**Components:**
- `BlogDashboard.jsx` - Main dashboard page
- `BlogSidebar.jsx` - Navigation sidebar
- `BlogOverview.jsx` - Overview tab with stats
- `BlogManagement.jsx` - Blog post management interface

---

## Developer Section - Role Assignment

**Path:** `/developer` (requires developer login)

### New Tab: "Role Assignment"
Allows developers to assign users to departments and roles.

**Features:**
- Department overview cards showing user count per department
- Add new role assignments with form
- View all assignments in a table
- Delete assignments
- Department-specific roles:
  - **Sales:** Sales Head, Sales Executive
  - **HR:** HR Manager, HR Executive
  - **Blog:** Blog Manager, Blog Writer
  - **Admin:** Admin, Super Admin

**Component:**
- `RoleAssignment.jsx` - Role assignment interface

---

## Login Flow

### Updated Login Page
The login page now supports department-based authentication:

1. **Developer Login**
   - Email: `amandev@gmail.com`
   - Password: `dev123`
   - Redirects to: `/developer-dashboard`

2. **Sales Head Login**
   - Email: `sales@example.com`
   - Password: `sales123`
   - Redirects to: `/sales-head-dashboard`

3. **HR Manager Login**
   - Email: `hr@example.com`
   - Password: `hr123`
   - Redirects to: `/hr-dashboard`

4. **Blog Manager Login**
   - Email: `blog@example.com`
   - Password: `blog123`
   - Redirects to: `/blog-dashboard`

5. **Backend Login**
   - Supports role-based routing based on user role from backend
   - Handles existing roles: super-admin, head-admin, team-leader, employee, developer, hr_finance, it_infrastructure

---

## File Structure

```
src/features/
├── sales/
│   ├── pages/
│   │   └── SalesHeadDashboard.jsx
│   └── components/
│       ├── SalesHeadSidebar.jsx
│       ├── SalesOverview.jsx
│       ├── SalesTeam.jsx
│       └── SalesMetrics.jsx
├── hr/
│   ├── pages/
│   │   └── HRDashboard.jsx
│   └── components/
│       ├── HRSidebar.jsx
│       ├── HROverview.jsx
│       ├── EmployeeManagement.jsx
│       └── Attendance.jsx
├── blog/
│   ├── pages/
│   │   └── BlogDashboard.jsx
│   └── components/
│       ├── BlogSidebar.jsx
│       ├── BlogOverview.jsx
│       └── BlogManagement.jsx
└── developer/
    └── components/
        └── RoleAssignment.jsx
```

---

## Routes Added to App.jsx

```javascript
<Route path="/sales-head-dashboard" element={<SalesHeadDashboard />} />
<Route path="/hr-dashboard" element={<HRDashboard />} />
<Route path="/blog-dashboard" element={<BlogDashboard />} />
```

---

## Key Features

### 1. **Responsive Design**
- All dashboards are fully responsive
- Mobile-friendly sidebars with hamburger menu
- Tailwind CSS for styling

### 2. **Consistent UI/UX**
- Each department has a unique color scheme
- Sidebar with quick stats
- Header with user info and logout button
- Tab-based navigation

### 3. **Data Management**
- Add/Edit/Delete functionality for team members and employees
- Form validation
- Local state management with React hooks

### 4. **Quick Stats**
- Each sidebar shows key metrics
- Real-time updates (mock data)
- Visual indicators with icons

---

## How to Use

### For End Users:

1. **Login with Department Credentials**
   - Go to `/login`
   - Enter credentials for your department
   - You'll be redirected to your department dashboard

2. **Navigate Dashboard**
   - Use sidebar to switch between tabs
   - View overview, manage team/employees/posts
   - Use hamburger menu on mobile

3. **Manage Resources**
   - Add new team members/employees/posts
   - Edit existing records
   - Delete records as needed

### For Developers:

1. **Assign Roles**
   - Login as developer
   - Go to "Role Assignment" tab
   - Select department and role
   - Add user to the system

2. **Monitor Assignments**
   - View all role assignments in table
   - See department distribution
   - Delete assignments if needed

---

## Customization

### Adding a New Department:

1. Create new folder: `src/features/[department]/`
2. Create pages and components
3. Create sidebar component with department color
4. Add login credentials in `Login.jsx`
5. Add route in `App.jsx`
6. Add to Role Assignment options

### Changing Colors:

Each department has a color scheme:
- **Sales:** Blue (`bg-blue-500`)
- **HR:** Purple (`bg-purple-500`)
- **Blog:** Orange (`bg-orange-500`)
- **Admin:** Red (`bg-red-500`)

Modify in respective sidebar components.

---

## Testing Checklist

- [ ] Login with each department credential
- [ ] Verify redirect to correct dashboard
- [ ] Test sidebar navigation
- [ ] Test add/edit/delete functionality
- [ ] Test mobile responsiveness
- [ ] Test logout functionality
- [ ] Test role assignment in developer section
- [ ] Verify localStorage is properly set/cleared

---

## Future Enhancements

1. Backend integration for role assignments
2. Database persistence for team/employee/post data
3. Real-time notifications
4. Advanced filtering and search
5. Export to CSV/PDF
6. User permissions and access control
7. Activity logs and audit trails
8. Email notifications

---

## Support

For issues or questions, refer to the component files for detailed implementation.
