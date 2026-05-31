# AI Business Analytics Dashboard

A production-ready, highly secure, full-stack SaaS platform designed for comprehensive Business Intelligence (BI), automated data cleaning, Exploratory Data Analysis (EDA), interactive visualization pipelines, and predictive Machine Learning insights.

---

## Technical Stack Architecture

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts / Plotly, React Query.
- **Backend**: Python 3.11+, FastAPI (fully async design), Pydantic (data validation).
- **Database & Storage**: Supabase PostgreSQL (with RLS enabled), Supabase Storage.
- **Authentication**: Supabase Auth (OAuth Google & Email/Password with RBAC enforcement).
- **Core AI Integration**: Gemini API (with contextual grounding and secure token limits).
- **Machine Learning Services**: Scikit-Learn, PyCaret, XGBoost, Pandas, Numpy.
- **Payment Operations**: Razorpay (India Subscriptions) & Stripe (Global Subscriptions).
- **Automation Engine**: n8n workflow integration.
- **Observability**: Sentry & PostHog.

---

## Directory Architecture

The system uses **Clean Architecture** patterns separating logical concerns into modular layers:

```bash
ai-business-dashboard/
│
├── frontend/                     # Next.js App Router Web Interface
│   ├── app/                      # Page routing, layouts, and route handlers
│   ├── components/               # High-fidelity shared and domain-specific UI components
│   ├── hooks/                    # Custom React hooks (state and lifecycle)
│   ├── services/                 # Unified API request boundary layers
│   ├── middleware/               # Client-side router protection and custom filters
│   ├── lib/                      # Core configuration utilities (e.g., Supabase client)
│   ├── validations/              # Frontend form and payload schema definitions
│   ├── store/                    # State management units (Zustand)
│   ├── utils/                    # Common functional helper utilities
│   ├── types/                    # Strong TypeScript interfaces and schemas
│   ├── public/                   # Static optimization assets (icons, images)
│   └── styles/                   # Global Tailwind layouts and typography
│
├── backend/                      # Async FastAPI Business Core
│   ├── api/                      # Routing endpoint handlers and controllers
│   ├── auth/                     # JWT parser and custom RBAC authentication guards
│   ├── analytics/                # Automated cleaning and EDA core libraries
│   ├── ml/                       # Premium predictive machine learning models
│   ├── automation/               # n8n webhook and automation boundaries
│   ├── middleware/               # Throttling, rate limiting, and CORS filters
│   ├── security/                 # Input filtering, sanitizers, and cryptographic utilities
│   ├── schemas/                  # Structured Pydantic payload models
│   ├── models/                   # DB layout definitions and ORM layers
│   ├── services/                 # Decoupled business rules and transactions
│   ├── config/                   # Environmental configuration loaders
│   ├── utils/                    # Shared backend helpers (logging, files)
│   └── tests/                    # Async unit and integration test suits
│
├── n8n-workflows/                # JSON schemas and configurations for automated workflows
├── docs/                         # Extended software architecture and system guides
├── docker/                       # Hardened Docker container configurations
├── scripts/                      # System administration and CI/CD helper tasks
├── .github/workflows/            # Secure CI/CD pipelines (SAST, Tests)
├── .env.example                  # Environmental keys template with mock placeholders
├── docker-compose.yml            # Local isolated orchestration configuration
├── README.md                     # Central system documentation
└── .gitignore                    # Robust exclusion rules preventing leakage
```

---

## Security Foundation

Security is maintained via a **Zero-Trust AppSec Framework** mapped against a 63-point master security checklist:
1. **Secrets Security**: No hardcoded API tokens. Variables are strictly validated at system boot.
2. **Access Control**: Role-Based Access Control (RBAC) separating Free, Pro, Premium ML, and Admin privileges.
3. **Database Rules**: Supabase Row-Level Security (RLS) restricts row access strictly based on authenticated tenant ownership IDs.
4. **Data Isolation**: All uploads pass MIME-type checks, size limitations, and path traversal sanitization before hitting Supabase storage.

---

## Recent Updates

### Backend AI Integration
- **Gemini Chat Endpoint**: Integrated Google Gemini AI via FastAPI (`/api/ai/chat`) to serve grounded analytics assistance.
- **Next.js Proxying**: Added server-side rewrites in `next.config.ts` to seamlessly proxy frontend API requests to the Python FastAPI backend.

### Frontend UI Overhaul
- **Default Light Theme**: Enforced a sleek default light-theme styling system for new users.
- **Scroll & Cascade Animations**: Utilized Framer Motion `whileInView` and CSS keyframes (`animate-cascade`) to introduce smooth, sequential animations to tables, dashboard widgets, and landing page elements.
- **Glassmorphism Metrics**: Upgraded dashboard metric cards with `dashboard-glass` CSS filters and dynamic hover state interaction arrays.
- **Custom Mouse Cursor**: Added a subtle animated mouse-tracking cursor glow for dark-mode.

### Marketing Website & Landing Experience
- **Modular Landing Page**: Abstracted the landing UI into reusable modular components (`Hero`, `Features`, `Testimonials`, `FAQ`, `Footer`) utilizing CSS grid and responsive layouts.
- **Secure Contact Form**: Designed a high-converting Contact page secured with strict Zod validation schemas and autonomous honeypot spam protection.
- **Legal Compliance & SEO**: Upgraded SEO metadata across the layout and dynamically generated `sitemap.xml` and `robots.txt`. Created dedicated routes for Privacy Policy, Cookie Policy, and Terms of Service.
- **Pricing Tiers**: Integrated a fluid responsive pricing matrix highlighting Free, Pro, and Enterprise configurations.

### Datasets Management
- **Dataset API & Storage**: Added robust endpoints for dataset uploads, integrating with Supabase Storage for secure file handling.
- **File Validation**: Implemented strict backend file validation verifying MIME types and structure for datasets (`.csv`, `.xlsx`).
- **Frontend Datasets Dashboard**: Developed a comprehensive React interface for uploading, previewing, and managing datasets with drag-and-drop components (`react-dropzone`).

### Security & Testing
- **Local Mock DB Authentication**: Built a seamless local-only database mock authentication interface using `local-users.json` that intentionally bypasses Supabase exclusively during development via strict `NODE_ENV` validation.
