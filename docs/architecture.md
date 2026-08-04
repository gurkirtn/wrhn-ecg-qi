# Architecture

ECG-QI is organized as a monorepo with three independently understandable
surfaces:

- `frontend`: role-based clinician and expert-review user interface.
- `backend`: FastAPI boundary for cases, analysis, review, analytics, and audit.
- `model`: isolated research code that must not be treated as a clinical model.

The deployed demo currently runs the frontend with deterministic in-memory mock
data. The backend and model directories are extension scaffolds and are not
connected to the public demo. This boundary keeps prototype behavior explicit
while allowing each layer to mature independently.
