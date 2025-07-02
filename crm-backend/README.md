# CRM Backend

This is the backend for the CRM application. It is built with Node.js, Express, and MongoDB (via Mongoose).

## Project Structure

```
crm-backend/
│
├── src/
│   ├── config/              # Configuration files (DB, env vars)
│   ├── controllers/         # Request handler functions
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Custom middleware
│   ├── models/              # DB models/schemas
│   ├── services/            # Business logic and reusable functions
│   ├── utils/               # Helper functions (e.g., logger, constants)
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point (starts the server)
│
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root with your environment variables (see below).
3. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT` - Port number for the server (default: 5000)
- `MONGO_URI` - MongoDB connection string

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (for development) 