# Postman API Testing - Localhost Endpoints

## Base URL
```
http://localhost:5001/api
```

## Authentication
All endpoints require authentication token in headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

---

## Call History Endpoints

### 1. Get Call History for a Specific Lead
**GET** `/api/leads/:leadId/calls`

**Example:**
```
GET http://localhost:5001/api/leads/696101e59cf5bae3b0726186/calls
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": {...},
      "leadId": "...",
      "leadName": "ADDDDDDDDDDDDDDDDDDDDDDD",
      "phone": "9031359720",
      "startTime": "2026-01-10T06:50:16.803Z",
      "endTime": "2026-01-10T06:50:35.052Z",
      "duration": 18,
      "callDate": "2026-01-10T06:50:40.270Z",
      "status": "completed",
      "type": "outbound"
    }
  ],
  "count": 4
}
```

---

### 2. Get All Call Records for Current User
**GET** `/api/leads/calls`

**Example:**
```
GET http://localhost:5001/api/leads/calls
```

**Query Parameters (Optional):**
- `leadId` - Filter by specific lead ID
  ```
  GET http://localhost:5001/api/leads/calls?leadId=696101e59cf5bae3b0726186
  ```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

### 3. Save Call Record
**POST** `/api/leads/calls`

**Example:**
```
POST http://localhost:5001/api/leads/calls
```

**Body (JSON):**
```json
{
  "leadId": "696101e59cf5bae3b0726186",
  "leadName": "ADDDDDDDDDDDDDDDDDDDDDDD",
  "phone": "9031359720",
  "startTime": "2026-01-10T06:50:16.803Z",
  "endTime": "2026-01-10T06:50:35.052Z",
  "duration": 18,
  "status": "completed",
  "type": "outbound"
}
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

## Chat Endpoints

### 4. Create or Get Chat
**POST** `/api/chats/create` ⚠️ Note: `/chats` (plural), not `/chat`

**Example:**
```
POST http://localhost:5001/api/chats/create
```

**Body (JSON):**
```json
{
  "leadId": "696101e59cf5bae3b0726186",
  "createdBy": "69596606787a41319e88b902",
  "assignedTo": "ASSIGNED_USER_ID"
}
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

### 5. Get User Chats
**GET** `/api/chats/user-chats` ⚠️ Note: `/chats` (plural)

**Example:**
```
GET http://localhost:5001/api/chats/user-chats
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

### 6. Send Message
**POST** `/api/chats/send` ⚠️ Note: `/chats` (plural)

**Example:**
```
POST http://localhost:5001/api/chats/send
```

**Body (JSON):**
```json
{
  "chatId": "CHAT_ID_HERE",
  "message": "Hello, this is a test message"
}
```

---

### 7. Get Chat Messages
**GET** `/api/chats/messages`

**Example:**
```
GET http://localhost:5001/api/chats/messages?chatId=CHAT_ID_HERE
```

**Query Parameters:**
- `chatId` - Required: The chat ID to get messages for

**Body (JSON):**
```json
{
  "message": "Hello, this is a test message"
}
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

---

## Lead Endpoints

### 8. Get Lead by ID
**GET** `/api/leads/:id`

**Example:**
```
GET http://localhost:5001/api/leads/696101e59cf5bae3b0726186
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

### 9. Get Assignable Users
**GET** `/api/leads/assignable-users`

**Example:**
```
GET http://localhost:5001/api/leads/assignable-users
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

## How to Get Your Token

1. **Login to get token:**
   ```
   POST http://localhost:5001/api/auth/login
   ```
   
   **Body:**
   ```json
   {
     "email": "your@email.com",
     "password": "yourpassword"
   }
   ```
   
   **Response will include:**
   ```json
   {
     "token": "YOUR_JWT_TOKEN_HERE",
     "user": {...}
   }
   ```

2. **Copy the token** from response
3. **Use it in Authorization header** for all other requests:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN_HERE
   ```

---

## Quick Test - Call History

### Test Script for Postman:
1. **Login first:**
   ```
   POST http://localhost:5001/api/auth/login
   Body: { "email": "...", "password": "..." }
   ```
   Copy the `token` from response

2. **Set environment variable in Postman:**
   - Create environment variable `token`
   - Set it to your JWT token
   - Use `{{token}}` in Authorization header

3. **Test Call History:**
   ```
   GET http://localhost:5001/api/leads/696101e59cf5bae3b0726186/calls
   Authorization: Bearer {{token}}
   ```

---

## Common Issues

### 1. "Access denied" (403)
- Check if you have permission to view that lead's call history
- Boss can see all, HOD can see assigned leads, BD can see their own calls

### 2. "Lead not found" (404)
- Verify the leadId is correct
- Make sure lead exists in database

### 3. "Unauthorized" (401)
- Token expired or invalid
- Login again to get new token

### 4. Port not accessible
- Make sure backend server is running on port 5001
- Check: `http://localhost:5001/api` should be accessible

---

## Postman Collection Setup

### Environment Variables:
Create a Postman environment with:
- `baseUrl`: `http://localhost:5001/api`
- `token`: (set after login)

### Pre-request Script (Auto-set token):
```javascript
// Get token from environment
const token = pm.environment.get("token");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + token
    });
}
```

---

## Your Specific Test Case

Based on your logs, test with:
```
Lead ID: 696101e59cf5bae3b0726186
User ID: 69596606787a41319e88b902
```

**Full URL:**
```
GET http://localhost:5001/api/leads/696101e59cf5bae3b0726186/calls
```

