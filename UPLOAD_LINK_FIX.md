# 🔧 Upload Link Fix - December 21, 2025

## ❌ Problem
After sending email, when candidate clicks on "upload document" link, it shows error "no send email" or "Invalid or expired link".

## 🔍 Root Cause
1. **Missing Route**: Frontend was calling `/api/hr/onboarding/verify-upload-token/:token` but this route didn't exist
2. **Hardcoded Data**: `generateUploadLink` was using hardcoded "Test Candidate" instead of fetching actual candidate data
3. **Wrong Endpoint**: Frontend was using wrong API endpoint for token verification

## ✅ Fixes Applied

### 1. Added Missing Route
**File:** `100/backend/routes/hr.routes.js`

Added route alias to support frontend calls:
```javascript
// Verify upload token (alias for CareerController.verifyUploadToken)
router.get('/onboarding/verify-upload-token/:token', CareerController.verifyUploadToken);
```

### 2. Fixed generateUploadLink to Use Real Data
**File:** `100/backend/Controller/AdminController/FrontController/CareerController.js`

**Before:**
- Used hardcoded "Test Candidate"
- No actual onboarding data fetched

**After:**
- Fetches actual onboarding record from database
- Uses real candidate name, email, and other details
- Proper error handling if onboarding not found
- Uses environment variable for site URL

### 3. Fixed Frontend Token Verification
**File:** `100/frontend/100acressFront/src/Pages/DocumentUpload.jsx`

**Before:**
```javascript
const res = await api.get(`/api/hr/onboarding/verify-upload-token/${token}`);
setCandidate(res.data.candidate); // Wrong response format
```

**After:**
```javascript
const res = await api.get(`/career/verify-upload-token/${token}`);
if (res.data.success && res.data.data) {
  setCandidate({
    id: res.data.data.onboardingId,
    name: res.data.data.candidateName,
    email: res.data.data.candidateEmail
  });
}
```

## 📋 Flow After Fix

1. **HR sends docs invite:**
   - Calls `/career/generate-upload-link` with `onboardingId`
   - Backend fetches actual candidate data from DB
   - Generates token and stores in file (`uploadTokens.json`)
   - Returns upload link: `https://100acress.com/onboarding/upload?token=xxx`

2. **Email sent to candidate:**
   - Contains upload link with token
   - Link points to frontend upload page

3. **Candidate clicks link:**
   - Frontend extracts token from URL
   - Calls `/career/verify-upload-token/:token` (or `/api/hr/onboarding/verify-upload-token/:token`)
   - Backend verifies token from file storage
   - Returns candidate info if valid

4. **Candidate uploads documents:**
   - Frontend shows upload form with candidate name
   - Documents uploaded via `/career/upload-documents/:token`
   - Token marked as used after successful upload

## 🧪 Testing

1. **Generate Link:**
   ```bash
   POST /career/generate-upload-link
   Body: { "onboardingId": "xxx", "expiresInHours": 48 }
   ```

2. **Verify Token:**
   ```bash
   GET /career/verify-upload-token/:token
   # Should return candidate info
   ```

3. **Check Frontend:**
   - Open upload link in browser
   - Should see candidate name
   - Should be able to upload documents

## 🎯 Summary

| Issue | Status | Fix |
|-------|--------|-----|
| Missing route | ✅ Fixed | Added route alias |
| Hardcoded data | ✅ Fixed | Fetch from DB |
| Wrong endpoint | ✅ Fixed | Updated frontend |
| Token verification | ✅ Fixed | Proper response handling |

All issues resolved! Upload link flow should now work correctly. 🎉

