# Database Migration: head-admin → hod

## Purpose
This migration script updates all users with role 'head-admin' to 'hod' (Head of Department) throughout the CRM system.

## How to Run

### Prerequisites
1. MongoDB must be running
2. Backend environment variables must be set (.env file)

### Command
```bash
cd crm-backend
node scripts/migrate-head-admin-to-hod.js
```

### What the Script Does
1. ✅ Finds all users with role 'head-admin'
2. ✅ Updates them to role 'hod' 
3. ✅ Logs the migration results
4. ✅ Provides verification statistics

### Expected Output
```
🔄 Starting migration: head-admin → hod
📊 Found X users with 'head-admin' role
✅ Successfully updated X users from 'head-admin' to 'hod'
📊 Total users with 'hod' role after migration: Y
🎉 Migration completed successfully!
```

### Post-Migration Steps
After successful migration:
1. Remove 'head-admin' from model enums (temporary support)
2. Restart backend server
3. Test all functionality

### Troubleshooting
- **ECONNREFUSED**: MongoDB not running
- **MODULE_NOT_FOUND**: Path issues (should be fixed now)

## Notes
- Script handles both 'head-admin' and 'hod' values during transition
- Safe to run multiple times (won't duplicate updates)
- Includes proper error handling and logging
