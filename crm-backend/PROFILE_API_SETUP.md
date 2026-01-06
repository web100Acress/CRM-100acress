# Profile Update API Setup Guide

## Overview
Complete API system for updating user profile information and profile pictures with real-time synchronization.

## Features
- ✅ Profile information update (name, email, phone)
- ✅ Profile picture upload with validation
- ✅ Password change functionality
- ✅ Real-time sync across multiple tabs
- ✅ Offline support with fallback
- ✅ File validation (type, size)
- ✅ Base64 image storage
- ✅ Error handling and user feedback

## API Endpoints

### 1. Update Profile Information
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543211",
  "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 2. Upload Profile Picture
```
POST /api/users/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

profileImage: <file>
```

## Files Created/Modified

### Backend Changes
1. **User Model** (`src/models/userModel.js`)
   - Added `profileImage` field to store base64 image data

2. **Upload Middleware** (`src/middlewares/upload.middleware.js`)
   - Multer configuration for file uploads
   - Image validation (type, size)
   - Memory storage for base64 conversion

3. **User Controller** (`src/controllers/userController.js`)
   - Enhanced `updateProfile` method
   - New `uploadProfileImage` method
   - Base64 conversion and storage

4. **User Routes** (`src/routes/userRoutes.js`)
   - Added profile image upload route
   - Integrated upload middleware

5. **Package Dependencies**
   - Added multer for file handling

### Frontend Changes
1. **EditProfile Component** (`src/pages/EditProfile/EditProfile.mobile.jsx`)
   - Real API integration
   - File upload with FormData
   - Error handling and fallback
   - Real-time sync status

## Setup Instructions

### 1. Install Dependencies
```bash
cd crm-backend
npm install multer
```

### 2. Start Backend Server
```bash
npm run dev
```
Server will run on: `http://localhost:5001`

### 3. Start Frontend Server
```bash
cd acre-flow-crm
npm run dev
```
Frontend will run on: `http://localhost:5173`

## How It Works

### Profile Picture Upload Flow
1. User selects image file
2. Frontend validates file (type, size)
3. Creates FormData with file
4. Sends to `/api/users/profile-image`
5. Backend processes with multer
6. Converts to base64 string
7. Stores in database
8. Returns base64 image URL
9. Frontend updates UI

### Profile Information Update Flow
1. User edits profile fields
2. Validates form data
3. Sends to `/api/users/profile`
4. Backend updates user document
5. Returns updated user data
6. Frontend updates localStorage
7. Triggers real-time sync events

## Real-time Features

### Cross-tab Synchronization
- Storage events for profile updates
- Automatic refresh in other tabs
- Real-time status indicators

### Offline Support
- Fallback to localStorage if server fails
- Sync status indicators (Online/Offline/Syncing)
- Auto-sync when connection restored

## Security Features

### File Upload Security
- File type validation (images only)
- File size limit (5MB)
- Memory storage (no temporary files)
- Base64 encoding for database storage

### Authentication
- JWT token validation
- User ID extraction from token
- Unauthorized access protection

## Error Handling

### Frontend Errors
- Network connectivity issues
- File validation errors
- API response errors
- User-friendly toast messages

### Backend Errors
- Authentication failures
- File upload errors
- Database update errors
- Proper HTTP status codes

## Testing

### Test Profile Update
1. Go to Edit Profile page
2. Update name, email, phone
3. Click save
4. Verify success message
5. Check localStorage updates

### Test Profile Picture Upload
1. Click on profile image
2. Select image file (JPG/PNG)
3. Wait for upload
4. Verify image update
5. Check network tab for API call

### Test Real-time Sync
1. Open profile in two tabs
2. Update in one tab
3. Verify auto-update in other tab

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543211",
    "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "role": "employee",
    "department": "Sales"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

## Environment Variables
Ensure your `.env` file has:
```
PORT=5001
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
```

## Troubleshooting

### Common Issues
1. **Upload fails**: Check file size and type
2. **Auth error**: Verify JWT token
3. **Network error**: Check backend server status
4. **Sync issues**: Refresh page

### Debug Tips
- Check browser network tab
- Verify console logs
- Test API endpoints with Postman
- Check database for updates

## Next Steps
- Add image compression
- Implement image cropping
- Add profile picture deletion
- Add profile activity logs
- Implement email notifications for changes
