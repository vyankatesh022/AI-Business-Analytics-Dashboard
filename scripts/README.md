# Administrative Scripts Guide

This directory houses administrative scripts, database backup tools, system migrations, and localized code checks.

---

## Script Categories

- **AppSec Scanning**: Automated repository scanning tools executing before git stages.
- **Database Utilities**: PostgreSQL local backup, connection tests, and migration triggers.
- **Environment Management**: Helper utilities generating secure configuration containers.

---

## Execution Guidelines

1. **Explicit Permission Checks**: Admin scripts must require explicit interactive or programmatic permission tokens before executing destructive operations (e.g. database schema drops).
2. **Sanitized Telemetry**: Logging within local admin tools must sanitize credential parameters and never output passwords/keys into standard outputs.
3. **Least Privilege System Commands**: Custom powershell or shell operations run using non-administrator user scope contexts by default.
