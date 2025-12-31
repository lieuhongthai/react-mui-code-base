# React + MUI + Vite + TypeScript Codebase

Modern React application với Material-UI, Tanstack Router, và các thư viện hiện đại khác.

## Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server

### UI & Styling
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Emotion** - CSS-in-JS library (MUI dependency)

### Routing
- **Tanstack Router** - File-based routing với type-safety

### State Management
- **Zustand** - Lightweight state management
- **Tanstack Query** - Server state management

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### HTTP & API
- **Axios** - HTTP client với interceptors

### Internationalization
- **i18next** - i18n framework
- **react-i18next** - React bindings

## Cấu Trúc Dự Án

```
src/
├── routes/              # File-based routing (Tanstack Router)
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page (/)
│   ├── login.tsx       # Login page (/login)
│   ├── public.tsx      # Public page (/public)
│   └── private.tsx     # Private page (/private) - requires auth
│
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login form với validation
│   ├── PublicPage.tsx  # Public accessible page
│   └── PrivatePage.tsx # Protected page với role display
│
├── components/         # Reusable components
│
├── hooks/              # Custom hooks
│   └── useAuth.ts     # Authentication hook
│
├── stores/             # Zustand stores
│   ├── authStore.ts   # User authentication state
│   └── themeStore.ts  # Theme mode state (light/dark)
│
├── services/           # API services
│   └── authService.ts # Authentication API calls
│
├── config/             # App configuration
│   ├── axios.ts       # Axios instance với interceptors
│   └── queryClient.ts # React Query client config
│
├── theme/              # MUI theme configuration
│   ├── theme.ts       # Light và dark theme definitions
│   └── ThemeProvider.tsx # Theme provider component
│
├── i18n/               # Internationalization
│   ├── config.ts      # i18n configuration
│   └── locales/       # Translation files
│       ├── en.json    # English translations
│       └── vi.json    # Vietnamese translations
│
├── types/              # TypeScript type definitions
│   └── user.ts        # User và role types
│
└── utils/              # Utility functions
```

## Features

### 🔐 Authentication & Authorization
- User authentication với login/logout
- Role-based access control (RBAC)
- Multiple roles per user support
- Protected routes với auth guards
- Persistent authentication state (localStorage)

### 🎨 Theming
- MUI theme provider với light/dark modes
- Tailwind CSS integration (không conflict với MUI)
- Customizable theme configuration
- Persistent theme preference

### 🌐 Internationalization
- Multi-language support (English, Vietnamese)
- Easy to add more languages
- Translation key organization

### 🛣️ Routing
- File-based routing với Tanstack Router
- Type-safe navigation
- Route guards và redirects
- Developer tools trong dev mode

### 📡 API Integration
- Axios với request/response interceptors
- Automatic token injection
- Error handling và retries
- API configuration qua environment variables

### 📝 Form Handling
- React Hook Form để quản lý forms
- Zod schema validation
- Type-safe form data
- Error handling và validation messages

### 🔄 State Management
- Zustand cho client state
- Tanstack Query cho server state
- Persistent state với localStorage
- DevTools support

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Tạo file `.env` từ `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=React MUI App
VITE_APP_VERSION=1.0.0
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Pages

### Public Pages
- **Home (`/`)** - Landing page
- **Public (`/public`)** - Accessible without authentication
- **Login (`/login`)** - User login form

### Protected Pages
- **Private (`/private`)** - Requires authentication, shows user info và roles

## Authentication Flow

1. User submits login form
2. Credentials validated với Zod schema
3. API call qua `authService.login()`
4. Token saved to localStorage
5. User data saved to Zustand store
6. Redirect to home page

## Role-Based Access Control

### Using Roles
```typescript
const { hasRole, hasAnyRole } = useAuth();

// Check single role
if (hasRole('admin')) {
  // Admin only code
}

// Check any of multiple roles
if (hasAnyRole(['admin', 'moderator'])) {
  // Needs at least one role
}
```

## MUI + Tailwind Integration

Dự án này kết hợp MUI và Tailwind CSS mà không conflict. Tailwind's preflight được disable, MUI's CssBaseline xử lý base styles.

## License

MIT
