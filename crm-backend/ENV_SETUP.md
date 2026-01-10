# CRM Backend Environment Setup

## Required Environment Variables

Create a `.env` file in the `crm-backend` directory with the following variables:

```
# Port Configuration
PORT=5001

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# 100acress Backend Integration
SERVICE_TOKEN=<your_admin_jwt_token_from_100acress_backend>
BACKEND_URL=http://localhost:3500
```

## How to Get SERVICE_TOKEN

1. **Start 100acress Backend** on `localhost:3500`
2. **Login to 100acress** with admin credentials
3. **Open Browser DevTools** (F12)
4. **Go to Application → Local Storage**
5. **Find the `token` key** and copy the full JWT value
6. **Paste it as `SERVICE_TOKEN`** in the `.env` file

## Example .env File

```
PORT=5001
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/crm-db
JWT_SECRET=your_secret_key_here_min_32_chars_long
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BACKEND_URL=http://localhost:3500
```

## Starting the CRM Backend

```bash
cd crm-backend
npm install
npm run dev
```

Expected output:
```
🚀 Server running on port 5001
MongoDB connected
```

## Testing the Integration

Once both backends are running:

1. **CRM Frontend**: http://localhost:5173
2. **CRM Backend**: https://bcrm.100acress.com
3. **100acress Backend**: http://localhost:3500

The proxy endpoint will be available at:
```
GET https://bcrm.100acress.com/api/users/external/100acress-users
```

This endpoint will fetch users from 100acress backend at:
```
GET http://localhost:3500/postPerson/view/allusers
```
