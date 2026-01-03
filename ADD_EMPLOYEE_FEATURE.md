# 👤 Add Employee Feature - Manual Onboarding

## ✅ Feature Added
HR ab manually employee add kar sakta hai aur step-by-step onboarding kar sakta hai with real-time updates.

## 🎯 Features

### 1. **Add Employee Button**
- Header me "Add Employee" button
- Click karne par form modal open hota hai

### 2. **Employee Details Form**
- **Required Fields:**
  - Full Name *
  - Email *
  
- **Optional Fields:**
  - Phone Number
  - Position / Job Title
  - Department
  - Expected Joining Date
  - Additional Notes

### 3. **Automatic Onboarding Start**
- Employee create hone ke baad automatically wizard open hota hai
- Step-by-step onboarding start hota hai
- Real-time updates with fetchList()

## 🔧 Implementation

### Backend (`hr.routes.js`)

**New Endpoint:**
```javascript
POST /api/hr/onboarding/create
```

**Request Body:**
```json
{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "phone": "+91 1234567890",
  "position": "Software Developer",
  "department": "IT",
  "joiningDate": "2025-01-15",
  "notes": "Additional information"
}
```

**Response:**
```json
{
  "message": "Onboarding entry created successfully",
  "data": {
    "_id": "...",
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com",
    "currentStageIndex": 0,
    "stages": ["interview1", "hrDiscussion", "documentation", "success"],
    "status": "in_progress",
    ...
  }
}
```

**How it works:**
1. Creates placeholder Opening (if not exists) - "Manual Onboarding"
2. Creates placeholder Application with status 'approved'
3. Creates Onboarding entry with all stages
4. Sets initial stage to 'interview1'
5. Adds history entry with manual onboarding note

### Frontend (`Onboarding/index.jsx`)

**New Components:**
- ✅ Add Employee Modal with form
- ✅ Header with "Add Employee" button
- ✅ Auto-open wizard after creation
- ✅ Real-time list refresh

**Flow:**
1. HR clicks "Add Employee" button
2. Form modal opens
3. HR fills employee details
4. Clicks "Create & Start Onboarding"
5. Employee created in backend
6. List refreshes automatically
7. Wizard opens automatically for step-by-step onboarding

## 📋 Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| candidateName | text | ✅ Yes | Employee full name |
| candidateEmail | email | ✅ Yes | Employee email address |
| phone | tel | ❌ No | Phone number |
| position | text | ❌ No | Job title/position |
| department | text | ❌ No | Department name |
| joiningDate | date | ❌ No | Expected joining date |
| notes | textarea | ❌ No | Additional notes |

## 🔄 Onboarding Flow After Creation

1. **Employee Created** → Onboarding entry created
2. **Wizard Opens** → Automatically opens in MANAGE mode
3. **Step-by-Step:**
   - Interview 1 → Send invite, complete, etc.
   - HR Discussion → Send invite, complete, etc.
   - Documentation → Send upload link, verify documents
   - Success → Onboarding completed

## 🎯 Real-Time Updates

- ✅ List refreshes after employee creation
- ✅ Wizard shows latest data
- ✅ Stage updates reflect immediately
- ✅ Document uploads show in real-time

## 🧪 Testing

1. **Add Employee:**
   - Click "Add Employee" button
   - Fill required fields (name, email)
   - Fill optional fields
   - Click "Create & Start Onboarding"

2. **Verify Creation:**
   - Employee appears in list
   - Wizard opens automatically
   - Can proceed with step-by-step onboarding

3. **Test Onboarding:**
   - Send Interview 1 invite
   - Complete stages
   - Upload documents
   - Verify real-time updates

## 📝 Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Add Employee Button | ✅ | Header me button |
| Employee Form | ✅ | Complete form with validation |
| Backend Endpoint | ✅ | POST /api/hr/onboarding/create |
| Auto Wizard Open | ✅ | Wizard automatically opens |
| Real-Time Updates | ✅ | List refreshes automatically |
| Step-by-Step Flow | ✅ | Normal onboarding flow works |

Ab HR manually employee add kar sakta hai aur step-by-step onboarding kar sakta hai! 🎉

