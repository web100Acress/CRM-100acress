# CRM Lead Management System

## Lead Assignment and Forwarding Features

### Overview
This CRM system implements a hierarchical lead assignment and forwarding workflow that ensures leads progress through the organization in a structured manner.

### Role Hierarchy
- **Super Admin** → **Head Admin** → **Team Leader** → **Employee**

### Key Features

#### 1. Lead Assignment
- Users can assign leads to **any user at their level or below** in the hierarchy
- **Super Admin** can assign to: Head Admin, Team Leader, Employee
- **Head Admin** can assign to: Team Leader, Employee  
- **Team Leader** can assign to: Employee, or themselves
- **Employee** can assign to: themselves only
- Assignment chain is tracked for audit purposes

#### 2. Lead Forwarding
- Current assignees can forward leads to the next level in the hierarchy
- Forwarding automatically assigns to the first available user in the next role
- Assignment chain is updated with status tracking

#### 3. Assignment Chain Tracking
- Each lead maintains a complete history of assignments
- Status tracking: `assigned`, `forwarded`, `completed`, `rejected`
- Timestamps for all assignment activities

### Assignment Rules

#### Who Can Assign to Whom:
- **Super Admin**: Can assign to Head Admin, Team Leader, or Employee
- **Head Admin**: Can assign to Team Leader or Employee
- **Team Leader**: Can assign to Employee or themselves
- **Employee**: Can assign to themselves only

#### Reassignment Rules:
- Users can reassign leads they are currently assigned to
- Higher-level users can reassign leads assigned to lower-level users
- Unassigned leads can be assigned by any user (except employees)

### API Endpoints

#### Lead Management
- `GET /api/leads` - Get leads for current user
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

#### Lead Forwarding
- `POST /api/leads/:id/forward` - Forward lead to next level
- `GET /api/leads/assignable-users` - Get users that can be assigned to

#### Follow-ups
- `POST /api/leads/:id/followups` - Add follow-up to lead
- `GET /api/leads/:id/followups` - Get follow-ups for lead

### Frontend Features

#### Lead Table
- Assignment dropdown with role-based filtering
- Forward button for current assignees
- Self-assign button for eligible users
- Assignment chain visualization
- Status indicators for each assignment stage
- Smart reassignment controls based on user role and current assignment

#### Create Lead Form
- Assign to dropdown with filtered users
- Role-based assignment restrictions

### Usage Examples

#### Assignment Scenarios:
1. **Head Admin assigns to Team Leader**: Team Leader can then assign to any Employee or themselves
2. **Team Leader assigned to Employee**: Employee can only assign to themselves
3. **Super Admin assigns to Employee**: Employee can only assign to themselves
4. **Unassigned Lead**: Any user (except Employee) can assign it

#### Forwarding a Lead
1. User assigned to a lead sees "Forward" button
2. Clicking forward moves lead to next role level
3. Assignment chain is updated with new assignee

#### Self Assignment
1. Team Leaders and Employees see "Self Assign" button
2. Clicking assigns the lead to themselves
3. Useful for taking ownership of unassigned leads

### Database Schema

#### Lead Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  status: String, // Cold, Warm, Hot
  assignedTo: String, // Current assignee ID
  assignmentChain: [{
    userId: String,
    role: String,
    name: String,
    assignedAt: Date,
    status: String, // assigned, forwarded, completed, rejected
    completedAt: Date,
    notes: String
  }]
}
```

### Security Features
- Role-based access control
- Users can only assign to users at their level or below
- Assignment chain validation
- Authentication required for all operations
- Reassignment restrictions based on role hierarchy

### Future Enhancements
- Load balancing for lead distribution
- Assignment rules and preferences
- Email notifications for assignments
- Lead escalation workflows
- Performance metrics and reporting 