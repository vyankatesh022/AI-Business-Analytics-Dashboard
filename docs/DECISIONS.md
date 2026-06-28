# Architectural Decision Records (ADRs)

This document tracks significant architectural decisions made during the lifecycle of Enterprise AI.

## Format
Each entry follows the standard ADR format: Context, Decision, Consequences.

---

### ADR-001: Adoption of FastAPI over Django/Flask
**Date**: 202X-XX-XX
- **Context**: Need for high-concurrency handling for AI streaming.
- **Decision**: Use FastAPI for its native async support and strict Pydantic typing.
- **Consequences**: Faster development API iteration, steeper learning curve for async paradigms.

### ADR-002: Next.js App Router for Frontend
**Date**: 202X-XX-XX
- **Context**: Need for optimized SEO, fast initial load times, and complex routing.
- **Decision**: Adopt Next.js 15 App Router.
- **Consequences**: Better performance, requires deep understanding of Server vs Client components.

### ADR-003: Logical Tenant Isolation via PostgreSQL
**Date**: 202X-XX-XX
- **Context**: Balancing infrastructure cost with multi-tenant data security.
- **Decision**: Implement logical separation (shared database, shared schema) with `tenant_id` columns and Row-Level Security, rather than isolated databases per tenant.
- **Consequences**: Lower operational overhead, increased complexity in application query layers to ensure isolation.
