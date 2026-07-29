# ECG-QI

Prototype ECG quality-improvement workflow for Waterloo Regional Health
Network. It separates clinician and expert-review workspaces and includes case
submission, simulated AI comparison, expert adjudication, learning feedback,
and aggregate reporting.

All records and ECG traces are synthetic. This project is for demonstration
and education, not clinical diagnosis.

## Run locally

Requires Node.js 22 or newer.

```bash
corepack enable
pnpm install
pnpm dev
```

Use `pnpm build` for a production build and `pnpm test` for the route smoke
tests.
