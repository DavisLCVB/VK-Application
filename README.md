# VK File Upload Application

A modern file upload application built with React, Vite, and TypeScript following hexagonal architecture principles. Supports both anonymous and authenticated file uploads with Supabase authentication and Google OAuth.

## ✨ Key Features

- 📤 **Anonymous & Authenticated Uploads** - Upload files with or without an account
- 🔐 **Multiple Auth Methods** - Email/password or Google Sign-In
- 🎯 **Admin Panel** - Monitor service instances and load balancer status
- 🏗️ **Hexagonal Architecture** - Clean, maintainable, testable code
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🚀 **Production Ready** - Fully configured for deployment

## Features

### Anonymous Upload
- Upload files without creating an account
- Files are temporary and auto-deleted after expiration
- Get shareable download links
- VK-ANON-KEY cookie for rate limiting

### Authenticated Upload
- Supabase authentication (email/password or Google OAuth)
- **Google Sign In** for quick authentication
- Permanent file storage
- Personal dashboard with file management
- Rename, update descriptions, and delete files
- View download statistics
- 1GB storage quota per user

## Architecture

This project follows **Hexagonal Architecture** (Ports and Adapters):

```
src/
├── core/                    # Business logic (framework-independent)
│   ├── domain/             # Domain models (File, User)
│   ├── ports/              # Interface definitions
│   └── usecases/           # Business use cases
├── adapters/
│   ├── primary/            # UI layer (React)
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── contexts/
│   └── secondary/          # External services
│       ├── api/            # Backend API integration
│       ├── supabase/       # Supabase authentication
│       └── storage/        # Cookie management
└── infrastructure/         # Configuration & utilities
```

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication)
- Backend API running (VK Gateway)

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Configure Google OAuth in Supabase (optional but recommended):**
   - Go to your Supabase project dashboard
   - Navigate to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add authorized redirect URLs:
     - Development: `http://localhost:5173/**`
     - Production: `https://your-domain.com/**`
   - For Google Cloud Console setup, follow [Supabase's Google OAuth guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_API_BASE_URL` | Backend API gateway URL | No (defaults to http://localhost:3000) |
| `VITE_VK_SECRET` | Admin secret key for /admin route | No (required for admin panel) |

## How It Works

### VK-ANON-KEY Cookie

The application automatically creates a `VK-ANON-KEY` cookie on first visit:
- Generated using `crypto.randomUUID()`
- Random expiration between 12-24 hours
- Sent with all API requests for rate limiting
- Used by reverse proxy to filter automated requests

### Upload Flow

**Anonymous:**
1. User selects file on homepage
2. Frontend requests upload token from gateway (`POST /api/v1/files/token`)
3. File is uploaded with token (`POST /api/v1/files`)
4. User receives download link to file info page

**Authenticated:**
1. User signs up/in via Supabase
2. Backend user record created (`POST /api/v1/users`)
3. Upload follows same flow but with user ID
4. File appears in user's dashboard

### API Integration

The application integrates with the VK Gateway API (documented in [API.md](./API.md)):

**Key Endpoints:**
- `POST /api/v1/files/token` - Get upload token
- `POST /api/v1/files` - Upload file
- `GET /api/v1/files/:id` - Get file metadata
- `GET /api/v1/files/:id/content` - Download file
- `GET /api/v1/users/:id/files` - List user files
- `DELETE /api/v1/files/:id` - Delete file

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router DOM
- **Authentication:** Supabase
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui + Tailwind CSS
- **Cookie Management:** js-cookie
- **Architecture:** Hexagonal (Ports & Adapters)

## Project Structure

### Core Domain
- **Domain Models:** Pure TypeScript classes representing business entities
- **Ports:** Interface definitions for external dependencies
- **Use Cases:** Business logic implementation

### Adapters
- **Primary (UI):** React components, pages, hooks, and contexts
- **Secondary (Infrastructure):** API clients, Supabase integration, cookie storage

### Key Components

| Component | Purpose |
|-----------|---------|
| `HomePage` | File upload interface |
| `FileInfoPage` | Display file details and download button |
| `DashboardPage` | User's file management interface |
| `AuthPage` | Sign in/sign up forms |
| `ProtectedRoute` | Route guard for authenticated pages |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication state and actions |
| `useAnonymousSession` | VK-ANON-KEY cookie management |
| `useFileUpload` | File upload logic with progress tracking |

## Development

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage with upload interface | No |
| `/file/:fileId` | File information and download | No |
| `/auth` | Sign in / Sign up | No |
| `/dashboard` | User's file dashboard | Yes |
| `/admin` | Admin panel - service instances & load balancer status | No (requires VK_SECRET) |

## Admin Panel

The application includes an admin panel at `/admin` for monitoring service instances and load balancer status.

### Features

- **Load Balancer Overview**: View total instances and breakdown by provider (Supabase/Google Drive)
- **Service Instances List**: See all registered backend instances with:
  - Provider type (Supabase or Google Drive)
  - Server ID and name
  - Server URL
  - Creation timestamp
- **System Information**: Current configuration and last refresh time
- **Real-time Refresh**: Manually refresh instance data

### Setup

1. Add `VITE_VK_SECRET` to your `.env` file:
   ```env
   VITE_VK_SECRET=your-secret-key-from-backend
   ```
   This must match the `X-KV-SECRET` configured in your backend services.

2. Access the admin panel at `http://localhost:5173/admin`

### API Requirements

The admin panel requires these backend endpoints:
- `GET /api/v1/instances` - List all instances
- `GET /api/v1/instances/:id` - Get specific instance details
- `GET /api/v1/health` - Health check

All admin endpoints require the `X-KV-SECRET` header for authentication.

## Security Features

1. **VK-ANON-KEY Cookie:** Rate limiting and bot protection
2. **Supabase Auth:** Secure JWT-based authentication
3. **Admin Authentication:** X-KV-SECRET header for admin endpoints
4. **HttpOnly Cookies:** Session management
5. **CORS:** Configured for secure cross-origin requests
6. **Input Validation:** Client and server-side validation

## Backend Requirements

This frontend requires the VK Gateway backend to be running. See [API.md](./API.md) for complete API documentation.

**Minimum Backend Requirements:**
- User management endpoints
- File upload/download endpoints
- Upload token generation
- VK-ANON-KEY cookie validation

## Contributing

This project follows hexagonal architecture principles:

1. **Core domain** should be framework-independent
2. **Use cases** contain business logic only
3. **Adapters** handle external dependencies
4. **Keep ports (interfaces) stable**

## Troubleshooting

### "Missing environment variables" warning
Make sure you've created a `.env` file with all required variables.

### Supabase authentication not working
1. Check your Supabase URL and anon key are correct
2. Ensure Supabase project is active
3. Verify email authentication is enabled in Supabase dashboard

### File upload fails
1. Verify backend API is running
2. Check `VITE_API_BASE_URL` is correct
3. Ensure VK-ANON-KEY cookie is being set
4. Check browser console for errors

### CORS errors
Configure your backend to allow requests from your frontend domain.

## License

ISC

## Author

Built with hexagonal architecture for maintainability and testability.
