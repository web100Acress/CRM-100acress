# Activity Hub - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd crm-backend
npm run dev
# Runs on https://bcrm.100acress.com
```

**Terminal 2 - Frontend:**
```bash
cd acre-flow-crm
npm run dev
# Runs on http://localhost:5173
```

### Step 2: Create Department Credentials

1. Go to `http://localhost:5173/login`
2. Login as Developer (or any admin account)
3. Navigate to **Developer** section
4. Click **Activity Hub** tab
5. Click **Create Department** button
6. Fill in:
   - **Department**: IT
   - **Email**: it@example.com
   - **Password**: IT@12345 (or click Generate)
   - **Description**: IT Department
   - **Color**: Blue
7. Click **Create Department**

### Step 3: Login to Activity Dashboard

1. Go to `http://localhost:5173/activity-login`
2. Enter:
   - **Email**: it@example.com
   - **Password**: IT@12345
3. Click **Login to Activity Hub**
4. You're now in the Activity Dashboard!

### Step 4: Try Each Feature

#### Submit a Report
1. Click **Reports** in sidebar
2. Click **Submit Report**
3. Fill in:
   - Title: "Weekly IT Report"
   - Description: "This week's updates"
   - Report Type: Weekly
   - Content: "All systems operational"
4. Click **Submit Report**

#### Share a File
1. Click **Files** in sidebar
2. Click **Share File**
3. Fill in:
   - File Name: "System Docs"
   - File URL: "https://example.com/doc.pdf"
   - Category: Document
   - Description: "System documentation"
4. Click **Share File**

#### Post Content
1. Click **Content** in sidebar
2. Click **Post Content**
3. Fill in:
   - Title: "New Update"
   - Content Type: Announcement
   - Content: "Important announcement"
4. Click **Post Content**
5. Like and comment on posts

#### Share a Thought
1. Click **Thoughts** in sidebar
2. Click **Share Thought**
3. Fill in:
   - Title: "Performance Idea"
   - Category: Suggestion
   - Priority: High
   - Thought: "We should optimize queries"
4. Click **Share Thought**
5. Like and reply to thoughts

---

## 📋 Department List

Create credentials for these departments:

| Department | Email | Password | Color |
|-----------|-------|----------|-------|
| IT | it@example.com | IT@12345 | Blue |
| Sales | sales@example.com | Sales@12345 | Green |
| Developer | dev@example.com | Dev@12345 | Purple |
| HR | hr@example.com | HR@12345 | Orange |
| Marketing | marketing@example.com | Marketing@12345 | Red |
| Finance | finance@example.com | Finance@12345 | Yellow |
| Operations | ops@example.com | Ops@12345 | Teal |

---

## 🔑 Key URLs

| Page | URL |
|------|-----|
| Activity Login | http://localhost:5173/activity-login |
| Activity Dashboard | http://localhost:5173/activity-dashboard |
| Developer Section | http://localhost:5173/developer |
| Create Credentials | Developer → Activity Hub Tab |

---

## ✨ Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Reports** | Submit department reports visible to all |
| **Files** | Share documents, images, videos with all departments |
| **Content** | Post articles, news, announcements with comments |
| **Thoughts** | Share ideas and suggestions with replies |
| **Overview** | View statistics and collaboration metrics |

---

## 🎯 Common Tasks

### Create Multiple Departments
1. Go to Developer → Activity Hub
2. Click "Create Department" multiple times
3. Fill different department info each time
4. Each gets unique credentials

### View All Submissions
1. Login to any department
2. All reports, files, content, thoughts visible
3. Filter by department if needed

### Collaborate Across Teams
1. IT submits report
2. Sales can see it immediately
3. Sales can comment or reply
4. All departments see updates in real-time

### Engage with Content
- **Like**: Click heart icon
- **Comment**: Click comment icon and type
- **Reply**: Click reply button on thoughts
- **Filter**: Use dropdown to filter by department

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check email/password, verify department was created |
| Email not received | Check spam, verify email in .env |
| CORS error | Ensure backend is running on :5001 |
| No data showing | Refresh page, check MongoDB connection |
| 401 error | Logout and login again, clear localStorage |

---

## 📝 Notes

- All submissions are visible to all departments
- No department silos - complete transparency
- Email credentials sent on department creation
- Passwords are hashed in database
- Real-time updates across all users
- Comments and replies are threaded

---

## 🎓 Next Steps

1. ✅ Create 2-3 departments
2. ✅ Login as each department
3. ✅ Submit reports, files, content, thoughts
4. ✅ Like, comment, and reply
5. ✅ Filter by department
6. ✅ Verify cross-department visibility

Enjoy collaborating! 🚀
