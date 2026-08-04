# API documentation

Run the backend and open `http://localhost:8000/docs` for generated OpenAPI
documentation.

Initial endpoints:

- `GET /health`
- `POST /api/auth/demo/{user_id}`
- `GET|POST /api/cases`
- `GET /api/reviews/queue`
- `POST /api/reviews/{case_id}`
- `GET /api/analytics/summary`
- `GET /api/notifications`

These endpoints are development scaffolds; authentication and persistence must
be completed before any production use.
