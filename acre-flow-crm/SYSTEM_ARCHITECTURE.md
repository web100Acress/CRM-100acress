# Department System - Architecture & Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                              │
│                    (Login.jsx)                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ Sales   │      │   HR    │      │  Blog   │
   │ Head    │      │Manager  │      │Manager  │
   │         │      │         │      │         │
   │sales@   │      │hr@      │      │blog@    │
   │example  │      │example  │      │example  │
   └────┬────┘      └────┬────┘      └────┬────┘
        │                │                │
        ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   SALES     │  │     HR      │  │    BLOG     │
   │ DASHBOARD   │  │  DASHBOARD  │  │  DASHBOARD  │
   │             │  │             │  │             │
   │ Blue Theme  │  │Purple Theme │  │Orange Theme │
   └─────────────┘  └─────────────┘  └─────────────┘
        │                │                │
        ├─────────┬──────┼──────┬────────┤
        │         │      │      │        │
        ▼         ▼      ▼      ▼        ▼
      ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
      │Over- │ │Team  │ │Metrics
      │view  │ │Mgmt  │ │      
      └──────┘ └──────┘ └──────┘
        │         │      │
        └─────────┴──────┘
              │
              ▼
        ┌──────────────┐
        │  Sidebar     │
        │ Quick Stats  │
        │ Navigation   │
        └──────────────┘
```

---

## Component Hierarchy

```
App.jsx
├── Login.jsx
│   ├── Department Credentials
│   └── localStorage Management
│
├── SalesHeadDashboard.jsx
│   ├── SalesHeadSidebar.jsx
│   ├── SalesOverview.jsx
│   ├── SalesTeam.jsx
│   └── SalesMetrics.jsx
│
├── HRDashboard.jsx
│   ├── HRSidebar.jsx
│   ├── HROverview.jsx
│   ├── EmployeeManagement.jsx
│   └── Attendance.jsx
│
├── BlogDashboard.jsx
│   ├── BlogSidebar.jsx
│   ├── BlogOverview.jsx
│   └── BlogManagement.jsx
│
└── DeveloperDashboard.jsx
    └── RoleAssignment.jsx
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Enters Credentials                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ Check Static Credentials       │
        │ (Sales, HR, Blog, Developer)   │
        └────────┬───────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    Match Found       No Match
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌──────────────┐
   │Set Local│      │Try Backend   │
   │Storage  │      │Login         │
   └────┬────┘      └──────┬───────┘
        │                  │
        ▼                  ▼
   ┌─────────────────────────────┐
   │ Redirect to Department      │
   │ Dashboard                   │
   └─────────────────────────────┘
        │
        ├─────────────────────┐
        │                     │
        ▼                     ▼
   ┌──────────────┐    ┌──────────────┐
   │ Load Sidebar │    │ Load Content │
   │ Quick Stats  │    │ Tabs         │
   └──────────────┘    └──────────────┘
```

---

## Data Flow for Role Assignment

```
┌──────────────────────────────────────────────┐
│ Developer Login                              │
│ (amandev@gmail.com / dev123)                 │
└────────────────────┬─────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Developer Dashboard    │
        │ - System Overview      │
        │ - Create Employee      │
        │ - Role Assignment ◄─── NEW
        │ - Chat                 │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Role Assignment Tab    │
        │                        │
        │ 1. Select Department   │
        │ 2. Select Role         │
        │ 3. Enter User Info     │
        │ 4. Submit              │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Assignment Created     │
        │ - Stored in State      │
        │ - Displayed in Table   │
        │ - Can be Deleted       │
        └────────────────────────┘
```

---

## Department Structure

```
SALES DEPARTMENT
├── Sales Head (sales@example.com)
│   ├── Overview
│   │   ├── Revenue Stats
│   │   ├── Sales Trend Chart
│   │   ├── Top Performers
│   │   └── Recent Activity
│   ├── Team Management
│   │   ├── Add Member
│   │   ├── Edit Member
│   │   ├── Delete Member
│   │   └── View All Members
│   └── Performance Metrics
│       ├── Deal Size
│       ├── Win Rate
│       ├── Conversion Rate
│       └── Performance vs Target

HR DEPARTMENT
├── HR Manager (hr@example.com)
│   ├── Overview
│   │   ├── Employee Stats
│   │   ├── Department Distribution
│   │   ├── Attendance Chart
│   │   └── Recent Activities
│   ├── Employee Management
│   │   ├── Add Employee
│   │   ├── Edit Employee
│   │   ├── Delete Employee
│   │   └── View All Employees
│   └── Attendance
│       ├── Date Selection
│       ├── Attendance Status
│       ├── Check-in Time
│       └── Monthly Summary

BLOG DEPARTMENT
├── Blog Manager (blog@example.com)
│   ├── Overview
│   │   ├── Published Posts
│   │   ├── Total Views
│   │   ├── Top Posts
│   │   └── Engagement Trend
│   └── Blog Management
│       ├── Create Post
│       ├── Edit Post
│       ├── Delete Post
│       ├── View All Posts
│       └── Status Tracking
```

---

## State Management

```
App Level
├── isLoggedIn (boolean)
├── userRole (string)
├── isDeveloperLoggedIn (boolean)
└── userInfo (object)

Department Dashboard Level
├── sidebarOpen (boolean)
├── activeTab (string)
├── userInfo (object)
└── data (array/object)

Component Level
├── formData (object)
├── showForm (boolean)
├── items (array)
└── filters (object)
```

---

## localStorage Keys

```
Authentication
├── isLoggedIn
├── userRole
├── userEmail
├── userName
├── userId
├── token

Sales Department
├── isSalesHeadLoggedIn
├── salesHeadEmail
├── salesHeadName
├── salesHeadRole

HR Department
├── isHRLoggedIn
├── hrEmail
├── hrName
├── hrRole

Blog Department
├── isBlogLoggedIn
├── blogEmail
├── blogName
├── blogRole

Developer
├── isDeveloperLoggedIn
├── developerEmail
├── developerName
├── developerRole
```

---

## Routing Map

```
/login
  ├─ Sales Head ──────► /sales-head-dashboard
  ├─ HR Manager ──────► /hr-dashboard
  ├─ Blog Manager ────► /blog-dashboard
  ├─ Developer ───────► /developer-dashboard
  │                      └─ Role Assignment Tab
  ├─ HR/Finance ──────► /hr-finance
  └─ IT Infrastructure ► /it-infrastructure
```

---

## Feature Matrix

| Feature | Sales | HR | Blog | Developer |
|---------|-------|----|----|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Sidebar | ✅ | ✅ | ✅ | ✅ |
| Quick Stats | ✅ | ✅ | ✅ | ✅ |
| Add Items | ✅ | ✅ | ✅ | ✅ |
| Edit Items | ✅ | ✅ | ✅ | ✅ |
| Delete Items | ✅ | ✅ | ✅ | ✅ |
| Charts | ✅ | ✅ | ✅ | ✅ |
| Tables | ✅ | ✅ | ✅ | ✅ |
| Mobile Responsive | ✅ | ✅ | ✅ | ✅ |
| Role Assignment | - | - | - | ✅ |

---

## Color Scheme

```
Sales Department
├── Primary: #3b82f6 (Blue)
├── Sidebar: Gradient (blue-900 to blue-800)
├── Accent: #60a5fa (Light Blue)
└── Text: White on Blue

HR Department
├── Primary: #a855f7 (Purple)
├── Sidebar: Gradient (purple-900 to purple-800)
├── Accent: #d8b4fe (Light Purple)
└── Text: White on Purple

Blog Department
├── Primary: #ea580c (Orange)
├── Sidebar: Gradient (orange-900 to orange-800)
├── Accent: #fdba74 (Light Orange)
└── Text: White on Orange

Admin Department
├── Primary: #dc2626 (Red)
├── Sidebar: Gradient (red-900 to red-800)
├── Accent: #fca5a5 (Light Red)
└── Text: White on Red
```

---

## Responsive Breakpoints

```
Mobile (< 640px)
├── Hamburger Menu
├── Full-width Content
└── Stacked Layout

Tablet (640px - 1024px)
├── Collapsible Sidebar
├── 2-column Grid
└── Adjusted Padding

Desktop (> 1024px)
├── Fixed Sidebar
├── Multi-column Grid
└── Full Layout
```

---

## Future Integration Points

```
Backend API Integration
├── Authentication
│   ├── POST /api/auth/login
│   └── POST /api/auth/logout
│
├── Sales Management
│   ├── GET /api/sales/team
│   ├── POST /api/sales/team
│   ├── PUT /api/sales/team/:id
│   └── DELETE /api/sales/team/:id
│
├── HR Management
│   ├── GET /api/hr/employees
│   ├── POST /api/hr/employees
│   ├── PUT /api/hr/employees/:id
│   └── DELETE /api/hr/employees/:id
│
├── Blog Management
│   ├── GET /api/blog/posts
│   ├── POST /api/blog/posts
│   ├── PUT /api/blog/posts/:id
│   └── DELETE /api/blog/posts/:id
│
└── Role Assignment
    ├── GET /api/roles/assignments
    ├── POST /api/roles/assignments
    └── DELETE /api/roles/assignments/:id
```

---

## Performance Considerations

- ✅ Component-based architecture for code splitting
- ✅ Lazy loading of dashboard components
- ✅ Efficient state management with hooks
- ✅ Memoization for expensive computations
- ✅ Responsive images and icons
- ✅ CSS-in-JS with Tailwind for optimization

---

## Security Considerations

- ⚠️ Currently using static credentials (for demo)
- ⚠️ localStorage used for session (not secure for production)
- ⚠️ No input validation (add before production)
- ⚠️ No HTTPS/SSL (add in production)
- ⚠️ No CSRF protection (add in production)

**Recommendations for Production:**
- Implement JWT tokens
- Use secure HTTP-only cookies
- Add input validation and sanitization
- Implement rate limiting
- Add CORS protection
- Use environment variables for sensitive data
