# n8n Automation Workflows Guide

This directory houses the automation templates, triggers, and workspace definitions for orchestrating data processing pipelines with **n8n**.

---

## Technical Features

- **Workflow Orchestration**: n8n Community / Enterprise Edition
- **Triggers**: FastAPI analytical webhooks, scheduled cron indicators
- **Integrations**: System database updates, automated slack/email notifications, analytical report processing

---

## Security Guidelines (Webhook & Workflow Safety)

1. **Webhook Signature Verification**: Every webhook sent from FastAPI to n8n must include a cryptographic signature (`X-N8N-Signature`) header verified using SHA256.
2. **Strict Payload Boundary**: Automated payloads are validated against strict JSON schemas before being parsed.
3. **No Hardcoded Integration Keys**: Third-party service tokens are loaded strictly via n8n encrypted environment variables. Raw keys are never committed inside workflow JSON files.
