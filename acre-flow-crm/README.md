# CRM Dashboard - Scalable Architecture

A modern, luxury-level React CRM dashboard built with a scalable, feature-based architecture.

## 🏗️ Architecture Overview

This project follows a **modular feature-based architecture** with centralized API management and Redux Toolkit for state management.

### 📁 Folder Structure

```
src/
├── api/                          # Centralized API System
│   ├── endpoints.js              # All API endpoint URLs
│   ├── http.js                   # Axios setup with interceptors
│   ├── auth.api.js               # Auth API functions
│   ├── users.api.js              # Users API functions
│   ├── leads.api.js              # Leads API functions
│   ├── tickets.api.js            # Tickets API functions
│   ├── meetings.api.js           # Meetings API functions
│   └── dashboard.api.js          # Dashboard API functions
│
├── features/                     # Feature-Based Modules
│   ├── auth/                     # Authentication Feature
│   │   ├── components/           # Auth-specific components
│   │   ├── pages/                # Auth pages (Login, Register, etc.)
│   │   ├── api/                  # Local re-export from central API
│   │   ├── slices/               # Redux Toolkit slices
│   │   ├── services/             # Business logic helpers
│   │   ├── constants.js          # Feature constants
│   │   └── index.js              # Barrel exports
│   │
│   ├── users/                    # User Management Feature
│   ├── leads/                    # Lead Management Feature
│   ├── tickets/                  # Ticket Management Feature
│   ├── meetings/                 # Meeting Management Feature
│   ├── dashboard/                # Dashboard Feature
│   ├── hr/                       # HR Management Feature
│   ├── it/                       # IT Infrastructure Feature
│   └── developer/                # Developer Tools Feature
│
├── store/                        # Redux Store Configuration
│   └── index.js                  # Main store setup with all slices
│
├── layout/                       # Global Layout Components
│   ├── DashboardLayout.jsx       # Main dashboard layout
│   ├── Sidebar.jsx               # Navigation sidebar
│   ├── App.jsx                   # Main app component
│   └── ui/                       # Reusable UI components
│
├── hooks/                        # Custom React Hooks
├── routes/                       # Routing Configuration
├── utils/                        # Utility Functions
├── assets/                       # Static Assets
└── styles/                       # Global Styles
```

## 🔧 Key Architectural Principles

### 1. **Centralized API System**
- All API interaction functions are written **only once** in `src/api/`
- Feature folders only **import and re-export** from the central API
- Consistent error handling and interceptors across all API calls

### 2. **Feature-Based Organization**
Each feature is self-contained with:
- **components/**: Reusable UI elements specific to the feature
- **pages/**: Full-screen views for the feature
- **api/**: Local adapter that imports from central API
- **slices/**: Redux Toolkit state management
- **services/**: Optional business logic helpers
- **constants.js**: Feature-specific constants
- **index.js**: Barrel exports for clean imports

### 3. **Redux Toolkit Integration**
- Each feature has its own slice for state management
- Async thunks for API calls
- Centralized store configuration
- Optimistic updates and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=CRM Dashboard
```

## 📚 API Architecture

### Centralized API Structure

```javascript
// src/api/endpoints.js - All endpoints in one place
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    // ...
  },
  USERS: {
    LIST: `${BASE_URL}/users`,
    CREATE: `${BASE_URL}/users`,
    // ...
  },
  // ...
};

// src/api/http.js - Centralized HTTP client
const httpClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  // Interceptors for auth, error handling, etc.
});

// src/api/users.api.js - Centralized API functions
export const fetchUsers = async () => {
  try {
    const response = await http.get(ENDPOINTS.USERS.LIST);
    return response;
  } catch (error) {
    throw error;
  }
};
```

### Feature API Usage

```javascript
// src/features/users/api/usersApi.js - Local re-export
import { fetchUsers, createUser } from '@/api/users.api';

export { fetchUsers, createUser };

// Usage in components
import { fetchUsers } from '@/features/users/api/usersApi';
```

## 🔄 State Management

### Redux Toolkit Slices

Each feature has its own slice:

```javascript
// src/features/users/slices/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '@/features/users/api/usersApi';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.fetchAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
```

## 🎨 Component Architecture

### Feature Components
Components are organized by feature and responsibility:

```javascript
// src/features/users/components/UserCard.jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/features/users/slices/usersSlice';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};
```

### Layout Components
Global layout components in `src/layout/`:

```javascript
// src/layout/DashboardLayout.jsx
import Sidebar from './Sidebar';
import { Toaster } from './toaster';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Toaster />
    </div>
  );
};
```

## 🔐 Authentication & Authorization

### Auth Flow
- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes

### User Roles
- **super-admin**: Full system access
- **head-admin**: Team management
- **team-leader**: Employee management
- **employee**: Basic access

## 📊 Features

### Core Features
- **Dashboard**: Analytics and overview
- **User Management**: CRUD operations for users
- **Lead Management**: Lead tracking and assignment
- **Ticket Management**: Support ticket system
- **Meeting Management**: Meeting scheduling
- **HR Management**: Employee and finance tools
- **IT Infrastructure**: Technical tools and services
- **Developer Tools**: Advanced development features

### Advanced Features
- Real-time notifications
- File upload and management
- Advanced filtering and search
- Export functionality
- Audit logging

## 🛠️ Development Guidelines

### Adding New Features
1. Create feature folder in `src/features/`
2. Add API functions to central API
3. Create feature-specific API re-export
4. Implement Redux slice
5. Create components and pages
6. Add routing configuration

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configuration
- Write comprehensive tests
- Document complex functions
- Use meaningful component and variable names

### Performance Optimization
- Lazy loading for routes
- Memoization for expensive calculations
- Optimistic updates for better UX
- Efficient Redux selectors

## 🧪 Testing

### Test Structure
```
src/
├── __tests__/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   └── ...
│   ├── components/
│   └── utils/
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=users
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
# Production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=CRM Dashboard
NODE_ENV=production
```

## 📈 Monitoring & Analytics

### Error Tracking
- Sentry integration for error monitoring
- Performance monitoring
- User analytics

### Logging
- Structured logging
- Audit trails
- Debug information

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes following architecture
3. Write tests
4. Update documentation
5. Submit pull request

### Code Review Checklist
- [ ] Follows architectural patterns
- [ ] Includes tests
- [ ] Updates documentation
- [ ] No console errors
- [ ] Responsive design
- [ ] Accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the architecture guide

---

**Built with ❤️ using modern React patterns and scalable architecture principles.**

## Developer Chat WebSocket Server

To enable persistent and real-time chat in the Developer section:

1. Install dependencies (in this directory):
   ```bash
   npm install ws
   ```
2. Start the chat server:
   ```bash
   node chat-server.js
   ```

- The server runs on ws://localhost:4000 by default.
- Chat history is saved in `chat-history.json` in this directory.
- You can change the port or storage file in `chat-server.js` if needed.
test mest phast
