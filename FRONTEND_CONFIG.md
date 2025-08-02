# Frontend Configuration Guide

This guide explains the frontend configuration and how to set up the environment variables.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Global LMS
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_CERTIFICATES=true

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/webm,application/pdf

# Authentication
VITE_JWT_STORAGE_KEY=token
VITE_USER_STORAGE_KEY=user

# Pagination
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_PAGE_SIZE=100

# UI Configuration
VITE_THEME=light
VITE_LANGUAGE=en

# External Services
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# Development Tools
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK_API=false
```

### 2. Start Development Server

```bash
cd frontend
npm run dev
```

## 📁 File Structure

```
frontend/
├── client/
│   ├── config/
│   │   ├── api.ts          # API endpoints and configuration
│   │   └── environment.ts  # Environment variables and helpers
│   ├── lib/
│   │   └── api.ts          # API service utility
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main app component
├── server/                # Server-side rendering
├── shared/                # Shared utilities
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration Files

### API Configuration (`client/config/api.ts`)

- Defines all API endpoints
- Request/response types
- Authentication headers
- API configuration constants

### Environment Configuration (`client/config/environment.ts`)

- Environment variable management
- Feature flags
- Configuration helpers
- Type definitions

### API Service (`client/lib/api.ts`)

- HTTP request handling
- Authentication token management
- Retry logic
- File upload support
- Error handling

## 🌍 Environment Variables

| Variable                    | Description                  | Default                 |
| --------------------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL`              | Backend API URL              | `http://localhost:3001` |
| `VITE_API_TIMEOUT`          | API request timeout (ms)     | `30000`                 |
| `VITE_APP_NAME`             | Application name             | `Global LMS`            |
| `VITE_APP_VERSION`          | Application version          | `1.0.0`                 |
| `VITE_ENABLE_ANALYTICS`     | Enable analytics             | `true`                  |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notifications         | `true`                  |
| `VITE_ENABLE_CERTIFICATES`  | Enable certificates          | `true`                  |
| `VITE_MAX_FILE_SIZE`        | Max file upload size (bytes) | `10485760`              |
| `VITE_JWT_STORAGE_KEY`      | JWT storage key              | `token`                 |
| `VITE_USER_STORAGE_KEY`     | User storage key             | `user`                  |
| `VITE_DEFAULT_PAGE_SIZE`    | Default pagination size      | `10`                    |
| `VITE_THEME`                | UI theme                     | `light`                 |
| `VITE_LANGUAGE`             | UI language                  | `en`                    |

## 🔌 API Usage

### Basic Usage

```typescript
import apiService, { API_ENDPOINTS } from "@/lib/api";

// GET request
const response = await apiService.get(API_ENDPOINTS.COURSES.LIST);

// POST request
const loginResponse = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
  email: "user@example.com",
  password: "password",
});

// File upload
const uploadResponse = await apiService.upload(
  "/api/upload",
  file,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
);
```

### Error Handling

```typescript
try {
  const response = await apiService.get(API_ENDPOINTS.COURSES.LIST);

  if (response.success) {
    console.log("Data:", response.data);
  } else {
    console.error("Error:", response.message);
  }
} catch (error) {
  console.error("Request failed:", error);
}
```

## 🎨 Styling

The frontend uses:

- **Tailwind CSS** for styling
- **Radix UI** for components
- **Lucide React** for icons
- **Framer Motion** for animations

## 📱 Responsive Design

The application is fully responsive and supports:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- CORS configuration
- Input validation
- XSS protection

## 🚀 Performance

- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies
- Lazy loading

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Build

```bash
# Development build
npm run build:client

# Production build
npm run build

# Server-side rendering build
npm run build:server
```

## 🔍 Debugging

Enable debug mode by setting:

```env
VITE_ENABLE_DEBUG=true
```

This will show:

- API request/response logs
- Environment variable values
- Performance metrics
- Error details

## 📞 Support

For issues with the frontend:

1. Check the browser console
2. Verify environment variables
3. Check API connectivity
4. Review TypeScript errors
5. Check build logs
