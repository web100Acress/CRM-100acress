# 100acress Backend Role Integration Plan for CRM

## Overview
यह plan 100acress backend के roles को CRM system में integrate करने के लिए है। इससे 100acress के users अपने roles के अनुसार CRM में access कर सकेंगे।

## Current Situation

### 100acress Backend Roles:
- `admin` / `Admin` - Full admin access
- `sales_head` / `SalesHead` / `sales_head` - Sales management
- `blog` / `ContentWriter` - Blog content management  
- `hr` / `hr_manager` - HR management

### CRM Backend Roles:
- `admin`, `superadmin`, `super-admin`, `head-admin`
- `sales_head`, `sales_executive`
- `hr_manager`, `hr_executive`
- `blog_manager`, `blog_writer`
- `crm_admin`

## Integration Plan

### Phase 1: Role Mapping & Authentication Service

#### 1.1 Create Role Mapping Service
**File**: `CRM-100acress/crm-backend/src/services/roleMappingService.js`

**Purpose**: 100acress roles को CRM roles में map करना

**Role Mapping**:
```javascript
{
  'admin' → 'admin' (CRM admin)
  'Admin' → 'admin' (CRM admin)
  'sales_head' → 'sales_head' (CRM sales_head)
  'SalesHead' → 'sales_head' (CRM sales_head)
  'blog' → 'blog_manager' (CRM blog_manager)
  'ContentWriter' → 'blog_manager' (CRM blog_manager)
  'hr' → 'hr_manager' (CRM hr_manager)
  'hr_manager' → 'hr_manager' (CRM hr_manager)
}
```

#### 1.2 Create 100acress Token Verification Service
**File**: `CRM-100acress/crm-backend/src/services/verify100acressToken.js`

**Purpose**: 100acress backend से token verify करना और user data fetch करना

**Features**:
- 100acress backend API call करेगा token verify करने के लिए
- User role और details fetch करेगा
- CRM compatible format में return करेगा

### Phase 2: Unified Authentication Middleware

#### 2.1 Update Auth Middleware
**File**: `CRM-100acress/crm-backend/src/middlewares/auth.js`

**Changes**:
- CRM users के लिए existing logic
- 100acress users के लिए new logic:
  - Token verify करेगा 100acress backend से
  - Role map करेगा
  - req.user में set करेगा

#### 2.2 Create Role-Based Access Middleware
**File**: `CRM-100acress/crm-backend/src/middlewares/roleAccess.js`

**Purpose**: Role-based access control

**Functions**:
- `requireAdmin()` - admin role check
- `requireSalesHead()` - sales_head role check
- `requireBlogManager()` - blog_manager role check
- `requireHrManager()` - hr_manager role check
- `requireAnyRole([roles])` - multiple roles check

### Phase 3: CRM Backend API Updates

#### 3.1 Create 100acress Integration Endpoint
**File**: `CRM-100acress/crm-backend/src/routes/auth.js`

**New Endpoint**: `POST /api/auth/verify-100acress-token`

**Purpose**: Frontend से 100acress token receive करके verify करना

**Flow**:
1. Frontend 100acress token send करेगा
2. Backend 100acress API call करेगा verify करने के लिए
3. Role map करेगा
4. CRM compatible response return करेगा

#### 3.2 Update Login Route
**File**: `CRM-100acress/crm-backend/src/routes/auth.js`

**Changes**:
- 100acress users के लिए alternative login flow
- Check करेगा user 100acress database में है या CRM database में

### Phase 4: Frontend Integration

#### 4.1 Update Login Component
**File**: `CRM-100acress/acre-flow-crm/src/features/auth/pages/Login.jsx`

**Changes**:
- 100acress backend से login करने का option
- Token receive करके CRM backend को verify करने के लिए send करेगा
- Role-based redirect

#### 4.2 Create Role-Based Route Protection
**File**: `CRM-100acress/acre-flow-crm/src/utils/roleGuard.js`

**Purpose**: Role-based route protection

**Functions**:
- `hasRole(userRole, requiredRole)` - role check
- `hasAnyRole(userRole, requiredRoles)` - multiple roles check
- `ProtectedRoute` component - route protection

#### 4.3 Update Admin Sidebar
**File**: `CRM-100acress/acre-flow-crm/src/features/admin/components/AdminSidebar.jsx`

**Changes**:
- Role-based menu items show/hide
- Admin, Sales Head, Blog Manager, HR Manager के लिए different menus

#### 4.4 Update API Clients
**Files**: 
- `CRM-100acress/acre-flow-crm/src/features/admin/config/api100acressClient.js`
- `CRM-100acress/acre-flow-crm/src/features/admin/config/apiClient.js`

**Changes**:
- Token handling improve करना
- Error handling improve करना
- 100acress token को properly send करना

### Phase 5: Database Schema Updates (Optional)

#### 5.1 Update User Model (if needed)
**File**: `CRM-100acress/crm-backend/src/models/userModel.js`

**Optional Changes**:
- `sourceSystem` field add करना ('crm' or '100acress')
- `externalUserId` field add करना (100acress user ID)
- `syncStatus` field add करना

**Note**: Schema changes optional हैं। अगर आप चाहें तो बाद में भी कर सकते हैं।

### Phase 6: 100acress Backend Integration

#### 6.1 Create Token Verification Endpoint Helper
**File**: `CRM-100acress/crm-backend/src/utils/verify100acressUser.js`

**Purpose**: 100acress backend API call करने के लिए helper function

**API Call**:
- Endpoint: `http://localhost:3500/api/auth/verify-token` (या appropriate endpoint)
- Method: POST
- Headers: Authorization Bearer token
- Response: User data with role

#### 6.2 Handle 100acress API Responses
**Features**:
- Error handling
- Token expiry handling
- Role extraction
- User data normalization

## Implementation Steps

### Step 1: Backend Services (Priority: High)
1. ✅ Create `roleMappingService.js`
2. ✅ Create `verify100acressToken.js`
3. ✅ Update `auth.js` middleware
4. ✅ Create `roleAccess.js` middleware

### Step 2: Backend Routes (Priority: High)
1. ✅ Add 100acress token verification endpoint
2. ✅ Update login route
3. ✅ Add role-based route protection

### Step 3: Frontend Auth (Priority: High)
1. ✅ Update Login component
2. ✅ Create role guard utilities
3. ✅ Update API clients

### Step 4: Frontend UI (Priority: Medium)
1. ✅ Update Admin Sidebar
2. ✅ Add role-based menu filtering
3. ✅ Update Admin Dashboard

### Step 5: Testing (Priority: High)
1. ✅ Test 100acress admin login
2. ✅ Test sales_head access
3. ✅ Test blog_manager access
4. ✅ Test hr_manager access
5. ✅ Test unauthorized access blocking

## Role-Based Access Matrix

| 100acress Role | CRM Mapped Role | Admin Access | Sales Access | Blog Access | HR Access |
|---------------|-----------------|--------------|--------------|-------------|-----------|
| admin/Admin   | admin           | ✅ Full      | ✅ Full      | ✅ Full     | ✅ Full   |
| sales_head    | sales_head      | ❌ No        | ✅ Full      | ❌ No       | ❌ No     |
| blog          | blog_manager    | ❌ No        | ❌ No        | ✅ Full     | ❌ No     |
| hr/hr_manager | hr_manager      | ❌ No        | ❌ No        | ❌ No       | ✅ Full   |

## Security Considerations

1. **Token Validation**: हमेशा 100acress backend से token verify करें
2. **Role Verification**: हर request में role verify करें
3. **Token Expiry**: Expired tokens को handle करें
4. **Error Handling**: Proper error messages return करें
5. **Logging**: Authentication attempts को log करें

## API Endpoints

### New Endpoints

#### Verify 100acress Token
```
POST /api/auth/verify-100acress-token
Body: { token: "100acress_jwt_token" }
Response: { 
  success: true, 
  user: { 
    email, 
    name, 
    role, 
    mappedRole 
  },
  token: "crm_jwt_token" 
}
```

### Updated Endpoints

#### Login (Enhanced)
```
POST /api/auth/login
Body: { email, password, source?: "crm" | "100acress" }
Response: { token, user: { email, name, role } }
```

## Configuration

### Environment Variables
```env
# 100acress Backend URL
ACRESS_BACKEND_URL=http://localhost:3500

# JWT Secret (should match 100acress backend)
JWT_SECRET=aman123

# Enable 100acress integration
ENABLE_ACRESS_INTEGRATION=true
```

## Testing Checklist

- [ ] 100acress admin user CRM में login कर सकता है
- [ ] 100acress sales_head user sales features access कर सकता है
- [ ] 100acress blog user blog features access कर सकता है
- [ ] 100acress hr user HR features access कर सकता है
- [ ] Unauthorized users को proper error message मिलता है
- [ ] Token expiry properly handle होता है
- [ ] Role-based menus correctly show/hide होते हैं
- [ ] API calls properly authenticated होते हैं

## Future Enhancements

1. **User Sync**: 100acress users को CRM database में sync करना
2. **Dual Login**: User दोनों systems में login कर सकें
3. **Permission System**: Fine-grained permissions
4. **Audit Logging**: All access attempts को log करना
5. **SSO**: Single Sign-On implementation

## Notes

- Schema changes optional हैं - आप चाहें तो बाद में भी कर सकते हैं
- Current implementation में 100acress users को CRM database में store करने की जरूरत नहीं है
- Token-based authentication use करेंगे
- Role mapping flexible है - आसानी से change कर सकते हैं

