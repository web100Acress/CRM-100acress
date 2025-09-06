# CRM Setup Instructions

## ✅ Issues Resolved

1. **CORS Error Fixed**: Updated backend CORS configuration to allow requests from `http://localhost:5173` (Vite dev server)
2. **Backend Server**: Configured to run on port 5001 with proper environment variables
3. **Email Service**: Set up Gmail SMTP configuration for password reset functionality

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd CRM-100acress/crm-backend
npm install
npm start
```

The server will run on `http://localhost:5001`

### 2. Start the Frontend

```bash
cd CRM-100acress/acre-flow-crm
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📧 Email Configuration (Required for Password Reset)

To enable password reset functionality, you need to set up Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password

### Step 3: Update Environment Variables
Create a `.env` file in `CRM-100acress/crm-backend/` with:

```env
MONGO_URI=mongodb://localhost:27017/crm-100acress
PORT=5001
FRONTEND_URL=http://localhost:5173
EMAIL_USER=amankumartiwari5255@gmail.com
EMAIL_PASS=your_16_character_app_password_here
```

## 🗄️ Database Setup

Make sure MongoDB is running on your system:

### Windows:
```bash
# Start MongoDB service
net start MongoDB
```

### macOS:
```bash
brew services start mongodb-community
```

### Linux:
```bash
sudo systemctl start mongod
```

## 🧪 Testing the Setup

### Test CORS:
```bash
curl http://localhost:5001/test-cors
```

### Test Password Reset:
```bash
curl -X POST https://crm.100acress.com/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"amankumartiwari5255@gmail.com"}'
```

## 🔧 Troubleshooting

### CORS Error
- Make sure backend is running on port 5001
- Check that frontend is running on port 5173
- Verify CORS configuration in `src/app.js`

### Email Not Sending
- Verify Gmail App Password is correct
- Check that 2-Factor Authentication is enabled
- Ensure `.env` file is in the correct location

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in `.env` file
- Verify MongoDB is accessible on localhost:27017

## 📁 File Structure

```
CRM-100acress/
├── crm-backend/           # Backend API server
│   ├── src/
│   │   ├── app.js         # CORS configuration
│   │   ├── server.js      # Server setup
│   │   └── controllers/   # API controllers
│   └── .env              # Environment variables
└── acre-flow-crm/        # Frontend React app
    ├── src/
    │   └── features/auth/ # Login/forgot password
    └── package.json
```

## 🎯 What's Working Now

- ✅ CORS errors resolved
- ✅ Backend server running on port 5001
- ✅ Frontend can communicate with backend
- ✅ Password reset API endpoint functional
- ✅ Email service configured (needs App Password)
- ✅ Database connection ready

## 📞 Next Steps

1. Set up Gmail App Password
2. Update `.env` file with correct credentials
3. Test the forgot password functionality in the frontend
4. Create user accounts to test the system

The forgot password modal should now work without CORS errors!
