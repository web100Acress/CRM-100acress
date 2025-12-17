# Activity Hub Feature - Complete Setup & Usage Guide

## Overview

The Activity Hub is a comprehensive collaboration platform that enables multiple departments (IT, Sales, Developer, HR, Marketing, Finance, Operations) to share reports, files, content, and thoughts. All submissions are visible across all departments, promoting transparency and cross-departmental collaboration.

---

## Architecture

### Backend Structure
```
crm-backend/
├── src/
│   ├── models/
│   │   ├── activityDepartmentModel.js    # Department credentials
│   │   ├── activityReportModel.js        # Department reports
│   │   ├── activityFileModel.js          # Shared files
│   │   ├── activityContentModel.js       # Shared content/articles
│   │   └── activityThoughtModel.js       # Shared thoughts/ideas
│   ├── controllers/
│   │   └── activityController.js         # All Activity logic
│   └── routes/
│       └── activityRoutes.js             # Activity endpoints
```

### Frontend Structure
```
acre-flow-crm/src/features/activity/
├── pages/
│   ├── ActivityDashboard.jsx             # Main dashboard
│   ├── ActivityLogin.jsx                 # Department login
├── components/
│   ├── ActivitySidebar.jsx               # Navigation sidebar
│   ├── ActivityOverview.jsx              # Dashboard overview
│   ├── ReportsSection.jsx                # Reports management
│   ├── FilesSection.jsx                  # File sharing
│   ├── ContentSection.jsx                # Content posting
│   └── ThoughtsSection.jsx               # Thoughts/ideas
```

---

## Setup Instructions

### 1. Backend Setup

#### Step 1: Ensure MongoDB Connection
Make sure your MongoDB is running and connected in `crm-backend/src/server.js`.

#### Step 2: Verify Environment Variables
Add to `.env` file in `crm-backend/`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/crm
EMAIL_USER=devfoliomarketplace@gmail.com
EMAIL_PASSWORD=viwl ditr gqms ffur
JWT_SECRET=your_jwt_secret_key
```

#### Step 3: Start Backend Server
```bash
cd crm-backend
npm install
npm run dev
```

Backend will run on `http://localhost:5001`

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd acre-flow-crm
npm install
```

#### Step 2: Start Frontend Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Feature Workflow

### Creating Department Credentials

**Location:** Developer Section → Activity Hub Tab

1. Click "Create Department" button
2. Fill in the form:
   - **Department Name**: Select from IT, Sales, Developer, HR, Marketing, Finance, Operations
   - **Email**: Department email address
   - **Password**: Auto-generate or enter custom password
   - **Description**: Brief department description
   - **Color**: Choose department color for UI

3. Submit form
4. Credentials are sent to the department email automatically

### Department Login

**URL:** `http://localhost:5173/activity-login`

1. Enter department email
2. Enter password
3. Click "Login to Activity Hub"
4. Redirected to Activity Dashboard

### Activity Dashboard Features

#### 1. Overview Tab
- View statistics:
  - Total Reports
  - Shared Files
  - Content Posts
  - Thoughts Shared
  - Active Departments
- Quick information about the Activity Hub

#### 2. Reports Tab
- **Submit Report**: Click "Submit Report" button
  - Title (required)
  - Description
  - Report Type (Daily, Weekly, Monthly, Quarterly, Custom)
  - Content (required)
  
- **View Reports**: All departments' reports visible
- **Filter**: By department or view all
- **Actions**: View, Download reports

#### 3. Files Tab
- **Share File**: Click "Share File" button
  - File Name (required)
  - File URL (required)
  - Category (Document, Image, Video, Spreadsheet, Presentation, Other)
  - File Type (e.g., PDF, DOCX)
  - Description
  - Tags (comma-separated)

- **View Files**: Browse all shared files
- **Filter**: By department or category
- **Actions**: Download, Delete

#### 4. Content Tab
- **Post Content**: Click "Post Content" button
  - Title (required)
  - Content Type (Article, News, Update, Announcement, Tutorial, Other)
  - Content (required)
  - Tags (comma-separated)

- **Interact**: Like content, add comments
- **Filter**: By department or content type
- **Comments**: View and add comments to any post

#### 5. Thoughts Tab
- **Share Thought**: Click "Share Thought" button
  - Title (required)
  - Category (Idea, Suggestion, Feedback, Discussion, Other)
  - Priority (Low, Medium, High)
  - Thought (required)

- **Interact**: Like thoughts, add replies
- **Filter**: By department or category
- **Replies**: View and add replies to any thought

---

## API Endpoints

### Department Management
```
POST   /api/activity/departments              # Create department
GET    /api/activity/departments              # Get all departments
POST   /api/activity/departments/login        # Department login
```

### Reports
```
POST   /api/activity/reports                  # Submit report
GET    /api/activity/reports                  # Get all reports
GET    /api/activity/reports/department/:dept # Get dept reports
```

### Files
```
POST   /api/activity/files                    # Share file
GET    /api/activity/files                    # Get all files
GET    /api/activity/files/department/:dept   # Get dept files
```

### Content
```
POST   /api/activity/content                  # Post content
GET    /api/activity/content                  # Get all content
GET    /api/activity/content/department/:dept # Get dept content
POST   /api/activity/content/:id/comment      # Add comment
POST   /api/activity/content/:id/like         # Like content
```

### Thoughts
```
POST   /api/activity/thoughts                 # Share thought
GET    /api/activity/thoughts                 # Get all thoughts
GET    /api/activity/thoughts/department/:dept # Get dept thoughts
POST   /api/activity/thoughts/:id/reply       # Add reply
POST   /api/activity/thoughts/:id/like        # Like thought
```

---

## Key Features

### 1. Cross-Department Visibility
- All submissions are visible to all departments
- Promotes transparency and collaboration
- No department silos

### 2. Email Notifications
- Department credentials sent to email on creation
- Includes login URL and credentials

### 3. Rich Content Support
- Reports with descriptions and types
- File sharing with categories and tags
- Content posts with comments
- Thoughts with replies and priority levels

### 4. Filtering & Search
- Filter by department
- Filter by content type
- Search functionality

### 5. Engagement Features
- Like reports, content, and thoughts
- Comment on content
- Reply to thoughts
- Real-time updates

---

## Database Models

### ActivityDepartment
```javascript
{
  name: String (enum),
  email: String (unique),
  password: String (hashed),
  description: String,
  color: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityReport
```javascript
{
  title: String,
  description: String,
  content: String,
  department: String,
  submittedBy: String,
  submittedByEmail: String,
  reportType: String (enum),
  status: String (enum),
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityFile
```javascript
{
  fileName: String,
  fileUrl: String,
  fileType: String,
  fileSize: Number,
  description: String,
  department: String,
  sharedBy: String,
  sharedByEmail: String,
  category: String (enum),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityContent
```javascript
{
  title: String,
  content: String,
  contentType: String (enum),
  department: String,
  sharedBy: String,
  sharedByEmail: String,
  tags: [String],
  likes: Number,
  comments: [{
    author: String,
    authorEmail: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityThought
```javascript
{
  title: String,
  thought: String,
  department: String,
  sharedBy: String,
  sharedByEmail: String,
  category: String (enum),
  priority: String (enum),
  likes: Number,
  replies: [{
    author: String,
    authorEmail: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing the Feature

### Test Scenario 1: Create Department & Login
1. Go to Developer section
2. Click "Activity Hub" tab
3. Click "Create Department"
4. Fill form with:
   - Department: IT
   - Email: it@example.com
   - Password: IT@12345
5. Submit
6. Check email for credentials
7. Go to `/activity-login`
8. Login with it@example.com / IT@12345

### Test Scenario 2: Submit Report
1. Login as IT department
2. Click "Reports" in sidebar
3. Click "Submit Report"
4. Fill form:
   - Title: "Weekly IT Report"
   - Description: "This week's IT updates"
   - Report Type: Weekly
   - Content: "Detailed report content..."
5. Submit
6. Report appears in list

### Test Scenario 3: Share File
1. Click "Files" in sidebar
2. Click "Share File"
3. Fill form:
   - File Name: "System Documentation"
   - File URL: "https://example.com/doc.pdf"
   - Category: Document
   - Description: "Complete system documentation"
4. Submit
5. File appears in list

### Test Scenario 4: Post Content
1. Click "Content" in sidebar
2. Click "Post Content"
3. Fill form:
   - Title: "New Feature Announcement"
   - Content Type: Announcement
   - Content: "We're excited to announce..."
4. Submit
5. Like and comment on content

### Test Scenario 5: Share Thought
1. Click "Thoughts" in sidebar
2. Click "Share Thought"
3. Fill form:
   - Title: "Improve System Performance"
   - Category: Suggestion
   - Priority: High
   - Thought: "We should optimize database queries..."
4. Submit
5. Add replies to thought

---

## Troubleshooting

### Issue: "Invalid credentials" on login
- **Solution**: Verify email and password are correct
- Check if department was created successfully
- Verify email in database

### Issue: Email not received
- **Solution**: Check email configuration in `.env`
- Verify Gmail app password is correct
- Check spam folder
- Verify email address is correct

### Issue: CORS errors
- **Solution**: Ensure backend CORS is configured for frontend URL
- Check `crm-backend/src/app.js` for allowed origins
- Add `http://localhost:5173` if not present

### Issue: 401 Unauthorized errors
- **Solution**: Verify JWT token is being sent correctly
- Check authentication middleware
- Verify JWT_SECRET matches between token creation and verification

### Issue: Data not appearing
- **Solution**: Check MongoDB connection
- Verify collections are created
- Check browser console for errors
- Check backend logs

---

## Best Practices

1. **Department Management**
   - Use meaningful department names
   - Keep descriptions clear and concise
   - Use distinct colors for each department

2. **Content Sharing**
   - Add descriptive titles and content
   - Use appropriate tags for easy filtering
   - Include relevant details in descriptions

3. **File Sharing**
   - Verify file URLs are accessible
   - Use appropriate categories
   - Add tags for better organization

4. **Collaboration**
   - Engage with other departments' content
   - Leave constructive comments and replies
   - Use priority levels appropriately for thoughts

5. **Security**
   - Keep department passwords secure
   - Don't share credentials
   - Use strong passwords
   - Logout when done

---

## Future Enhancements

- Real-time notifications using WebSockets
- File upload directly (not just URLs)
- Advanced search and filtering
- Department-specific permissions
- Activity history and audit logs
- Email digest summaries
- Mobile app support
- Integration with other tools (Slack, Teams)

---

## Support

For issues or questions:
1. Check this guide
2. Review browser console for errors
3. Check backend logs
4. Verify database connection
5. Contact development team

---

## Version History

- **v1.0** (Dec 17, 2025): Initial release
  - Department credential management
  - Reports sharing
  - File sharing
  - Content posting
  - Thoughts/ideas sharing
  - Cross-department visibility
  - Email notifications
