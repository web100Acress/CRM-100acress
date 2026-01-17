# Lead Actions Implementation Guide

## Overview

This guide provides a complete structured approach for implementing Lead Forward, Swap, and Switch features in your CRM system. The implementation includes:

- ✅ **Permission Logic Helpers** - Role-based validation
- ✅ **Enhanced UI Modals** - Professional user interfaces
- ✅ **Unified Action Handlers** - Consistent state management
- ✅ **Comprehensive Logging** - Debug and audit capabilities

## Feature Definitions

### 1. Forward (Hierarchy Movement)
**Purpose**: Move lead to next level in hierarchy
**Flow**: Boss → HOD → Team-Leader → BD
**Use Case**: When a lead needs to be escalated to the next authority level

### 2. Swap (Same-Level Exchange)
**Purpose**: Exchange leads with another user at same level
**Flow**: HOD ↔ HOD | Team-Leader ↔ Team-Leader
**Use Case**: When two users want to exchange their workload

### 3. Switch (Manual Reassignment)
**Purpose**: Manually reassign to any user at lower levels
**Flow**: HOD/Team-Leader can reassign to any lower level user
**Use Case**: When a lead needs to be reassigned due to performance or availability

## Architecture

### Database Schema
```javascript
const leadSchema = {
  assignedTo: String,
  assignmentChain: [{
    userId: String,
    role: String,
    name: String,
    assignedAt: Date,
    status: String, // 'assigned', 'forwarded', 'completed', 'rejected'
    notes: String,
    assignedBy: { _id: ObjectId, name: String, role: String },
    chatCreated: Boolean
  }]
};
```

### Role Hierarchy
```
Boss (Level 0) → HOD (Level 1) → Team-Leader (Level 2) → BD/Employee (Level 3)
```

## Implementation Files

### 1. Core Utilities

#### `/src/utils/leadActionPermissions.js`
- **Purpose**: Permission validation logic
- **Key Functions**:
  - `canForwardLead()` - Check forward permissions
  - `canSwapLead()` - Check swap permissions  
  - `canSwitchLead()` - Check switch permissions
  - `getAvailableTargets` - Get target users for each action
  - `validateLeadAction()` - Generic validation

#### `/src/utils/leadActionLogger.js`
- **Purpose**: Comprehensive logging and debugging
- **Key Functions**:
  - `ActionLogger` - Structured logging with levels
  - `logActionStart/Complete/Error()` - Action lifecycle logging
  - `PerformanceMonitor` - Performance tracking
  - `auditTrail` - Action history tracking

### 2. UI Components

#### `/src/components/lead-actions/SwapLeadModal.jsx`
- **Purpose**: Swap lead interface
- **Features**:
  - User selection with search
  - Target user's leads display
  - Reason input
  - Permission validation

#### `/src/components/lead-actions/SwitchLeadModal.jsx`
- **Purpose**: Switch/Reassign lead interface
- **Features**:
  - Target user selection
  - Assignment chain visualization
  - Permission checks
  - Form validation

#### `/src/components/lead-actions/ForwardLeadModal.jsx`
- **Purpose**: Forward lead interface
- **Features**:
  - Forward path visualization
  - Target user selection
  - Optional reason input
  - Hierarchy-based filtering

### 3. State Management

#### `/src/hooks/useLeadActions.js`
- **Purpose**: Unified action handlers
- **Key Functions**:
  - `forwardLead()` - Execute forward action
  - `swapLead()` - Execute swap action
  - `switchLead()` - Execute switch action
  - `batchAction()` - Handle multiple leads
  - `refreshLeads()` - Refresh leads list

## Integration Guide

### Step 1: Import Components
```javascript
import SwapLeadModal from '@/components/lead-actions/SwapLeadModal';
import SwitchLeadModal from '@/components/lead-actions/SwitchLeadModal';
import ForwardLeadModal from '@/components/lead-actions/ForwardLeadModal';
import { useLeadActions } from '@/hooks/useLeadActions';
import { canForwardLead, canSwapLead, canSwitchLead } from '@/utils/leadActionPermissions';
```

### Step 2: Add State Management
```javascript
const [showSwapModal, setShowSwapModal] = useState(false);
const [showSwitchModal, setShowSwitchModal] = useState(false);
const [showForwardModal, setShowForwardModal] = useState(false);
const [selectedLead, setSelectedLead] = useState(null);

const { forwardLead, swapLead, switchLead, isActionLoading } = useLeadActions();
```

### Step 3: Add Action Buttons
```javascript
// In your lead table row or card
<div className="flex gap-2">
  {canForwardLead(lead, currentUser).canForward && (
    <button onClick={() => {
      setSelectedLead(lead);
      setShowForwardModal(true);
    }}>
      Forward
    </button>
  )}
  
  {canSwapLead(lead, currentUser).canSwap && (
    <button onClick={() => {
      setSelectedLead(lead);
      setShowSwapModal(true);
    }}>
      Swap
    </button>
  )}
  
  {canSwitchLead(lead, currentUser).canSwitch && (
    <button onClick={() => {
      setSelectedLead(lead);
      setShowSwitchModal(true);
    }}>
      Switch
    </button>
  )}
</div>
```

### Step 4: Add Modals to Component
```javascript
// Add these modals to your component JSX
<SwapLeadModal
  open={showSwapModal}
  onOpenChange={setShowSwapModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  currentUser={currentUser}
  onSwapComplete={(data) => {
    // Refresh leads list
    fetchLeads();
  }}
/>

<SwitchLeadModal
  open={showSwitchModal}
  onOpenChange={setShowSwitchModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  currentUser={currentUser}
  onSwitchComplete={(data) => {
    // Refresh leads list
    fetchLeads();
  }}
/>

<ForwardLeadModal
  open={showForwardModal}
  onOpenChange={setShowForwardModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  currentUser={currentUser}
  onForwardComplete={(data) => {
    // Refresh leads list
    fetchLeads();
  }}
/>
```

## Permission Matrix

| Current Role | Can Forward To | Can Swap With | Can Switch To |
|-------------|---------------|---------------|---------------|
| Boss | ❌ (Top level) | ❌ | ❌ (Manages all) |
| HOD | Team-Leader | Other HODs | Team-Leader, BD |
| Team-Leader | BD | Other Team-Leaders | BD |
| BD | ❌ (Bottom level) | ❌ | ❌ |

## API Endpoints

### Forward Lead
```
POST /api/lead-assignment/assign
Body: {
  leadId: string,
  assigneeId: string,
  assigneeName: string,
  assigneeRole: string,
  notes: string
}
```

### Swap Lead
```
POST /api/leads/:id/forward-swap
Body: {
  swapLeadId: string,
  reason: string
}
```

### Switch Lead
```
POST /api/leads/:id/forward-patch
Body: {
  selectedEmployee: string,
  reason: string
}
```

## Error Handling

### Common Errors and Solutions

1. **Permission Denied**
   - Check user role and lead assignment
   - Verify assignment chain status
   - Ensure lead is assigned to current user

2. **Target User Not Found**
   - Verify assignableUsers data
   - Check user role hierarchy
   - Ensure target user is active

3. **API Call Failed**
   - Check network connectivity
   - Verify JWT token
   - Check backend logs

## Debug Features

### Console Logging
In development mode, you can access debugging tools:
```javascript
// Access logs
window.LeadActionLogger.debug('message', data);

// Access audit trail
window.LeadActionAuditTrail.getTrail();

// Performance monitoring
window.LeadActionPerformance.start('operation');
```

### Permission Debugging
```javascript
import { debugActionPermissions } from '@/utils/leadActionPermissions';

// Debug specific action
debugActionPermissions('swap', lead, currentUser);
```

## Testing Checklist

### Forward Action
- [ ] Boss cannot forward (top level)
- [ ] HOD can forward to Team-Leader
- [ ] Team-Leader can forward to BD
- [ ] BD cannot forward (bottom level)
- [ ] Assignment chain updated correctly
- [ ] Notifications sent

### Swap Action
- [ ] Only HOD and Team-Leader can swap
- [ ] Users can only swap with same role
- [ ] Leads must be assigned to current user
- [ ] Both leads updated correctly
- [ ] Assignment chains preserved

### Switch Action
- [ ] Only HOD and Team-Leader can switch
- [ ] Only forwarded leads can be switched
- [ ] Can switch to lower level users
- [ ] Assignment chain updated
- [ ] Reason recorded

## Performance Considerations

1. **API Calls**: Use debouncing for rapid actions
2. **State Updates**: Batch multiple lead updates
3. **Logging**: Limit log levels in production
4. **Memory**: Clear audit trail periodically

## Security Notes

1. **JWT Validation**: Always verify user tokens
2. **Role Checking**: Server-side permission validation
3. **Input Sanitization**: Sanitize all user inputs
4. **Audit Trail**: Log all actions for compliance

## Future Enhancements

1. **Bulk Actions**: Select and process multiple leads
2. **Action Templates**: Pre-defined reasons for common actions
3. **Approval Workflow**: Multi-level approval for certain actions
4. **Analytics**: Action statistics and reporting
5. **Automation**: Rule-based automatic forwarding

## Support

For issues or questions:
1. Check browser console for error logs
2. Verify API endpoints are accessible
3. Check user permissions and roles
4. Review assignment chain data structure
