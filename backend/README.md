# Backend Architecture Guide (FastAPI & Python)

This directory houses the asynchronous API business core for the **AI Business Analytics Dashboard**, engineered using Python 3.11+ and FastAPI.

---

## Technical Stack & Utilities

- **Core Engine**: FastAPI (asynchronous ASGI framework)
- **Validation Engine**: Pydantic v2 (type validation & schema parsing)
- **Database client**: Supabase Python Client (PostgreSQL mapping)
- **Model Orchestration**: Scikit-Learn, PyCaret, XGBoost (predictive analytics)
- **Processing Utilities**: Pandas, Numpy, Scipy (data clean & statistics engines)
- **Asynchronous Runner**: Uvicorn / Gunicorn
- **Testing Engine**: Pytest (asynchronous test running)

---

## Folder Responsibilities

```bash
backend/
├── api/                  # FastAPI routers, controllers, and REST endpoints
├── auth/                 # JWT parsing, user auth guards, Google OAuth mappings, RBAC logic
├── analytics/            # Structured numerical modules (Data cleaning and EDA systems)
├── ml/                   # Subscriptions gated predictive Scikit-Learn pipelines
├── automation/           # n8n trigger webhooks and automations integration logic
├── middleware/           # CORS limits, request throttling, and custom exception bounds
├── security/             # Input sanitizers, cryptographic tools, and rate limiting engines
├── schemas/              # Structured Pydantic data schemas matching frontend Zod objects
├── models/               # Domain databases data mappings
├── services/             # Core application transactions and database updates
├── config/               # Secure configuration loader validating variables on system startup
├── utils/                # Asynchronous logger utilities, files, and common helpers
└── tests/                # System integrations and async unit test cases
```

---

## Security Implementations (Backend Checklist)

1. **JWT & RBAC Validation**: Validated on every private path request, verified against active Supabase user signatures.
2. **SQL Injection Protection**: Complete avoidance of raw query strings. Parametrized bindings are strictly enforced.
3. **API Rate Limiting**: Managed via custom endpoint throttling middleware to prevent credential stuffing and token exhaustion.
4. **Malware Scan & File Rules**: Safe MIME verification whitelist checks (`.csv`, `.xlsx`) restricting storage file sizes.
5. **Secure Cryptography**: Password storage is completely hashed using Argon2id/Bcrypt. Plain text storage is strictly forbidden.
