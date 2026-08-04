# Deployment guide

## Public frontend demo

Pushes to `main` run `.github/workflows/frontend-build.yml`, build the static
frontend, and publish it to GitHub Pages.

## Local full-stack development

Run the frontend from the repository root with `pnpm dev`. In another terminal,
create a Python environment in `backend`, install `requirements.txt`, and run:

```bash
uvicorn app.main:app --reload --port 8000
```

The hosted demo remains frontend-only until persistence, authentication,
security controls, and the API integration are explicitly implemented.
