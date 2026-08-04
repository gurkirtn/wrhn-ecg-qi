# ECG-QI

ECG quality-improvement prototype for Waterloo Regional Health Network. The
repository is organized as a full-stack monorepo so the interface, API,
database, model research, and operating documentation can evolve separately.

All cases, users, images, waveforms, and AI outputs are synthetic. This project
is for workflow demonstration and education, not clinical diagnosis or patient
care.

## Repository structure

```text
ecgqi/
├── .github/       Issue templates, pull-request template, and CI workflows
├── frontend/      Working Next/Vinext ECG-QI web application
├── backend/       FastAPI extension scaffold and tests
├── model/         Isolated model-research scaffold
├── database/      Readable SQL schema, seed data, and migrations
├── sample-data/   Synthetic development images only
├── scripts/       Local database setup helpers
├── docs/          Architecture, requirements, privacy, and deployment notes
├── docker-compose.yml
├── CONTRIBUTING.md
└── LICENSE
```

The hidden `.openai/hosting.json` and root pnpm files are required to keep the
existing hosted demo and monorepo build working. The project intentionally
continues to use pnpm, so `pnpm-lock.yaml` replaces the example
`frontend/package-lock.json`.

## What currently works

- The frontend demo is complete and uses local in-memory state.
- Clinician, expert reviewer, and dual-role demo accounts are available.
- ECG upload, mock AI comparison, review routing, expert feedback, learning,
  and analytics flows are interactive.
- The backend exposes minimal development endpoints but is not yet connected
  to the frontend.
- The model directory is research scaffolding; the demo does not run a trained
  model.

## Run the frontend

Requires Node.js 22 or newer.

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Useful root commands:

```bash
pnpm dev          # frontend development server
pnpm build        # production Sites build
pnpm build:pages  # static GitHub Pages build
pnpm test         # frontend build and route smoke tests
```

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` for the generated API documentation. To point
future frontend API calls at it, copy `frontend/.env.local.example` to
`frontend/.env.local`.

## Run in GitHub Codespaces

1. Open the repository on GitHub.
2. Select **Code** → **Codespaces** → **Create codespace on main**.
3. In the terminal, run:

```bash
nvm install 22
nvm use 22
corepack enable
pnpm install
pnpm dev --host 0.0.0.0
```

4. Open forwarded port `3000`. To share the temporary preview, change that
   port's visibility to **Public** in the **Ports** tab.

## Where to build next

- Frontend routes: `frontend/src/app`
- Current prototype workflow: `frontend/src/components/EcgQiApp.tsx`
- Reusable interface components: `frontend/src/components`
- Frontend API/auth/types: `frontend/src/lib`
- Backend HTTP routes: `backend/app/routers`
- Backend business logic: `backend/app/services`
- Database entities: `backend/app/models` and `database/schema.sql`
- Model experiments: `model/src` and `model/notebooks`

Start with [the architecture guide](docs/architecture.md), then review
[requirements](docs/requirements.md) and
[security and privacy](docs/security-and-privacy.md) before connecting real
storage, authentication, uploads, or model inference.
