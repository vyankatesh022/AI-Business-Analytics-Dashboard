# Changelog

All notable changes to the **AI Business Analytics Dashboard** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-05-30

### Added
- **Project Initialization**: Basic architecture folders structure configured cleanly (`frontend/`, `backend/`, `docs/`, `docker/`, `scripts/`, `n8n-workflows/`, `.github/workflows/`).
- **Secret Security Hardening**: Bulletproof `.gitignore` preventing leakages of env vars, private certificates, local DB configurations, Kubernetes, Sentry, Vault tokens, and DB backup files.
- **Environment Structure**: Standardized `.env.example` mapping all integration secrets, public URLs, payment keys (Stripe, Razorpay), AI service tokens, and Sentry tools.
- **Orchestration Config**: Clean `docker-compose.yml` defining networks and execution targets for backend APIs and automated n8n instances.
- **Architecture Guides**: 
  - Central `README.md` outlining systems design.
  - Custom `frontend/README.md` defining styling models, Next.js setups, and React Query layouts.
  - Custom `backend/README.md` detailing FastAPI structures, Pydantic systems, and Python analytical tools.
  - Custom `docker/README.md` detailing hardened alpine-based execution and volumes setup.
  - Custom `n8n-workflows/README.md` detailing webhook signatures validation and schema bounds.
  - Custom `scripts/README.md` detailing security audit tools and administrative utilities.
  - Custom `docs/README.md` outlining AI API token optimization strategies (Gemini Caching and Pruning) and token preservation guidelines.
  - Custom `.github/workflows/README.md` detailing secure token bindings and branch merge protections.
- **AppSec Verification**: Developed automated custom security scanners auditing credentials before deployment.
