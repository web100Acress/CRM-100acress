# Quick Start: Lead Actions Implementation

## 🚀 Get Started in 5 Minutes

### Step 1: Import the Components
Add these imports to your existing LeadTable or Leads component:

```javascript
import SwapLeadModal from '@/components/lead-actions/SwapLeadModal';
import SwitchLeadModal from '@/components/lead-actions/SwitchLeadModal';
import ForwardLeadModal from '@/components/lead-actions/ForwardLeadModal';
import { useLeadActions } from '@/hooks/useLeadActions';
import { canForwardLead, canSwapLead, canSwitchLead } from '@/utils/leadActionPermissions';
```

### Step 2: Add State to Your Component
```javascript
const [showSwapModal, setShowSwapModal] = useState(false);
const [showSwitchModal, setShowSwitchModal] = useState(false);
const [showForwardModal, setShowForwardModal] = useState(false);
const [selectedLead, setSelectedLead] = useState(null);

const { refreshLeads } = useLeadActions();
```

### Step 3: Add Action Buttons
Replace your existing action buttons with this:

```javascript
// Inside your lead row/card component
{canForwardLead(lead).canForward && (
  <button onClick={() => {
    setSelectedLead(lead);
    setShowForwardModal(true);
  }}>
    Forward
  </button>
)}

{canSwapLead(lead).canSwap && (
  <button onClick={() => {
    setSelectedLead(lead);
    setShowSwapModal(true);
  }}>
    Swap
  </button>
)}

{canSwitchLead(lead).canSwitch && (
  <button onClick={() => {
    setSelectedLead(lead);
    setShowSwitchModal(true);
  }}>
    Switch
  </button>
)}
```

### Step 4: Add the Modals
Add these modals at the end of your component:

```javascript
<SwapLeadModal
  open={showSwapModal}
  onOpenChange={setShowSwapModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  onSwapComplete={() => {
    refreshLeads();
    setShowSwapModal(false);
  }}
/>

<SwitchLeadModal
  open={showSwitchModal}
  onOpenChange={setShowSwitchModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  onSwitchComplete={() => {
    refreshLeads();
    setShowSwitchModal(false);
  }}
/>

<ForwardLeadModal
  open={showForwardModal}
  onOpenChange={setShowForwardModal}
  selectedLead={selectedLead}
  assignableUsers={assignableUsers}
  onForwardComplete={() => {
    refreshLeads();
    setShowForwardModal(false);
  }}
/>
```

### Step 5: Test It!
That's it! Your Lead Actions are now implemented with:
- ✅ Role-based permissions
- ✅ Professional UI modals
- ✅ Error handling
- ✅ Logging and debugging
- ✅ Assignment chain tracking

## 📋 What You Get

### Features Implemented
- **Forward**: Move leads up the hierarchy (Boss → HOD → TL → BD)
- **Swap**: Exchange leads with users at same level
- **Switch**: Reassign leads to lower-level users
- **Permissions**: Role-based access control
- **UI**: Professional modals with search and validation
- **Logging**: Complete audit trail and debugging

### Permission Matrix
| Role | Forward | Swap | Switch |
|------|---------|------|--------|
| Boss | ❌ | ❌ | ❌ |
| HOD | ✅ to TL | ✅ with HOD | ✅ to TL/BD |
| TL | ✅ to BD | ✅ with TL | ✅ to BD |
| BD | ❌ | ❌ | ❌ |

### API Endpoints Used
- `POST /api/lead-assignment/assign` (Forward)
- `POST /api/leads/:id/forward-swap` (Swap)
- `POST /api/leads/:id/forward-patch` (Switch)

## 🔧 Troubleshooting

### Common Issues

**Buttons not showing?**
- Check user role in localStorage
- Verify lead assignment status
- Check console for permission errors

**Modals not opening?**
- Ensure selectedLead is set correctly
- Check state management
- Verify modal props

**API calls failing?**
- Check JWT token in localStorage
- Verify backend endpoints are running
- Check network tab for errors

### Debug Mode
In development, check browser console for detailed logs:
```javascript
// Access debug tools
window.LeadActionLogger.debug('test');
window.LeadActionAuditTrail.getTrail();
```

## 🎯 Next Steps

1. **Customize Styling**: Modify modal components to match your design
2. **Add Notifications**: Integrate with your notification system
3. **Bulk Actions**: Use `batchAction()` for multiple leads
4. **Analytics**: Track action statistics
5. **Automation**: Set up rule-based forwarding

## 📞 Support

If you need help:
1. Check the implementation guide: `LEAD_ACTIONS_IMPLEMENTATION_GUIDE.md`
2. Review the example: `src/examples/LeadActionsExample.jsx`
3. Check browser console for error logs
4. Verify your backend endpoints match the expected format

## 🎉 Success!

You now have a complete, production-ready Lead Actions system! The implementation includes:

- **Security**: Role-based permissions with server-side validation
- **UX**: Professional modals with search and validation
- **Performance**: Optimized API calls and state management
- **Debugging**: Comprehensive logging and audit trail
- **Maintainability**: Clean, modular code structure

Your users can now efficiently manage lead assignments with proper hierarchy controls and complete audit trails! 🚀
