# Frontend Architecture Guide (Next.js & TypeScript)

This directory houses the client web application interface for the **AI Business Analytics Dashboard**, engineered using Next.js (latest App Router model) and TypeScript.

---

## Technical Stack & Utilities

- **Core Framework**: Next.js App Router (TypeScript enabled)
- **Styling Pipeline**: Tailwind CSS & Vanilla CSS configurations
- **UI Base Design**: shadcn/ui components (radix-ui primitives)
- **Animations Layer**: Framer Motion (micro-interactions)
- **Data Fetching Layer**: TanStack React Query (server-state management)
- **State Store**: Zustand (lightweight client state management)
- **Data Visualizations**: Recharts / Plotly.js (responsive dashboards)
- **Validation Engine**: Zod (frontend payload schema checking)

---

## Folder Responsibilities

```bash
frontend/
├── app/                  # Route layouts, pages, API route handlers, and providers
├── components/           # Modular UI primitives (reusable and domain-scoped)
├── hooks/                # Local React state and custom system hooks
├── services/             # HTTP boundary client wrapping Supabase and backend calls
├── middleware/           # Edge route protection, session checking, and security header control
├── lib/                  # Library initializations (e.g. SupabaseClient, ReactQueryClient)
├── validations/          # Payload definitions (Zod schemas matching Pydantic backend)
├── store/                # Zustand global client-side state models
├── utils/                # Pure functional helpers, layout utilities, and calculations
├── types/                # Strict TypeScript declaration types
├── public/               # Optimized static media assets
└── styles/               # Main CSS files, tailwind layouts, and variables
```

---

## Security Implementations (Frontend Checklist)

1. **HTTPS Enforced**: Enforced via edge configurations and redirect headers.
2. **CSP (Content Security Policy)**: Structured meta tags and middleware CSP setups restricting unsafe script loading.
3. **XSS Protection**: Controlled rendering using Next.js secure template auto-escaping. Use of `dangerouslySetInnerHTML` is banned.
4. **CSRF Protection**: Domain restrictions, SameSite cookie configurations, and customized route state verification.
5. **Secure Environmental Controls**: Next.js environmental variables targeting public resources are prefixed strictly with `NEXT_PUBLIC_`. Private keys are loaded on server-side nodes only.

---

## Datasets Management

- **File Uploads**: Implemented `react-dropzone` for secure drag-and-drop dataset uploading.
- **Dataset Previews**: Developed highly responsive tables rendering a fast preview of dataset columns and metadata using `shadcn/ui` components.
- **API Integration**: Connected frontend actions directly to FastAPI dataset endpoints for smooth data ingestion.

---

## Interactive Synchronized Hero Carousel

The homepage features a highly visual, play/pause-capable, fully synchronized **Hero Carousel UI** at the top of the landing page:

- **Purpose**: Showcases three core operational capabilities of the platform (Telemetry Forecast, Data Ingest Pipeline, Access Security Matrix) dynamically.
- **Synchronized Transitions**: Smoothly animates the Left text column (titles, custom badges, descriptions, custom CTAs) and the Right visual mockup cards (interactive spline image, live log terminal feed, RBAC settings) in unison.
- **Controls & Operations**:
  - **Auto-Rotation**: Sweeps slides automatically every 4.5 seconds.
  - **Manual Navigation**: Arrows (`◀` and `▶`) and indicator dots allow quick navigation.
  - **Freeze Toggle**: Features a **Play / Pause** toggle utilizing custom Lucide icons (`Play` and `Pause`) that stops the automatic rotation interval to let the user examine specific modules indefinitely.
- **Animation Framework**: Driven entirely by Framer Motion (`AnimatePresence` with `mode="wait"`) using strict typecasts for performance and compile-time verification.
