# Enterprise AI Frontend Application

This directory contains the highly interactive, performance-optimized frontend for the Enterprise AI platform, built with modern web technologies.

## 🏗️ Frontend Overview
A robust Single Page Application (SPA) utilizing Server-Side Rendering (SSR) and Static Site Generation (SSG) where appropriate, designed for complex data visualization and seamless AI interactions.

## 📐 Architecture
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: TailwindCSS + shadcn/ui

## 📁 Folder Structure
```
frontend/
├── app/                  # Next.js App Router pages & layouts
├── components/           # Reusable UI components (Atomic design)
│   ├── ui/               # Base shadcn/ui components
│   └── complex/          # Domain-specific components
├── lib/                  # Utility functions & API clients
├── hooks/                # Custom React hooks
├── store/                # Global state management
├── types/                # TypeScript interface definitions
└── public/               # Static assets
```

## 🧠 State Management
- **Server State**: React Query (TanStack Query) for intelligent caching, deduplication, and background refetching of API data.
- **Client State**: Zustand for lightweight, boilerplate-free global client state (e.g., UI toggles, theme preferences).

## 🔌 API Layer
- Centralized Axios/Fetch instances with request/response interceptors.
- Automatic JWT token injection and transparent token refresh mechanisms.

## 🔐 Authentication Flow
1. User authenticates via Supabase Auth.
2. JWT is securely stored (HttpOnly Cookies preferred for SSR, or secure local storage).
3. Next.js Middleware intercepts protected routes, validating the token before rendering.

## 🧩 UI Component Strategy
- **shadcn/ui**: For accessible, unstyled foundational components.
- **TailwindCSS**: For rapid, consistent styling using a centralized design token system (`tailwind.config.js`).
- **Storybook**: (Recommended/Planned) for isolated component testing and documentation.

## 📝 Forms & Validation
- **React Hook Form**: For performant, uncontrolled form state management.
- **Zod**: For strict, schema-based validation shared with the backend for end-to-end type safety.

## ⚡ Performance Optimization
- **Code Splitting**: Dynamic imports for heavy libraries (e.g., Chart.js, D3).
- **Image Optimization**: Utilizing `next/image` for automatic WebP conversion and responsive sizing.
- **Memoization**: Strategic use of `useMemo` and `useCallback` in heavy data grids.

## ♿ Accessibility (a11y)
- Radix UI primitives ensure fully accessible interactive components (WAI-ARIA compliant).
- Keyboard navigation and screen reader support implemented across all critical workflows.

## 🛡️ Security
- **XSS Protection**: React's built-in escaping, strictly avoiding `dangerouslySetInnerHTML`.
- **CSRF**: Handled via secure cookie configurations and anti-CSRF tokens.
- **Content Security Policy (CSP)**: Strict headers enforced via Next.js configuration.

## 🧪 Testing
- **Unit Tests**: Vitest + React Testing Library for component rendering and hooks.
- **E2E Tests**: Playwright for critical user journeys (Login, Report Generation, AI Query).

## 🔨 Frontend Build Process
Next.js automated build pipeline handles minification, tree-shaking, and chunking.

## 🚀 Frontend Deployment
Deployed to Vercel (or AWS Amplify / ECS containerized), leveraging Edge Networks for global low-latency delivery.

## 👨‍💻 Frontend Developer Guide
1. Ensure Node.js 20+ is installed.
2. Run `npm install`.
3. Adhere to ESLint and Prettier configurations.
4. Run `npm run dev` to start the development server.

## 📏 Coding Standards
- Strict TypeScript formatting (no `any` types).
- Functional components with Hooks exclusively.
- Colocation of styles, tests, and component logic.

## ⌨️ Common Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run unit tests
```
