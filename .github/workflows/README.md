# CI/CD Secure Pipeline Guide (.github/workflows)

This directory houses the secure GitHub Actions workflows orchestrating the system's static analysis, dependency vulnerability scanning, testing, and deployment pipelines.

---

## Technical Features

- **Pipeline Engine**: GitHub Actions
- **Security Checkers**: Static Application Security Testing (SAST), dependency auditing
- **Environment**: Containerized runner nodes

---

## Secure Token Handling & Pipeline Safeguards

1. **Least-Privilege Token Bindings**: Pipelines explicitly declare minimal execution permissions:
   ```yaml
   permissions:
     contents: read
     security-events: write
   ```
2. **Encrypted secrets container**: All deployment tokens and operational API keys are loaded strictly from GitHub Encrypted Secrets (`secrets.GITHUB_TOKEN`, `secrets.SUPABASE_ACCESS_TOKEN`).
3. **Branch Protection Enforcements**: Code merging into `main` or `develop` requires a minimum of one peer review and all automated security checks must pass.
