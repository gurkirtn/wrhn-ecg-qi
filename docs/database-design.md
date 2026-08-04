# Database design

Core records are users, ECG cases, AI analyses, discrepancies, expert reviews,
notifications, and audit logs. Each analysis and expert review belongs to one
case. Cases belong to the submitting clinician. Audit records are append-only.

`database/schema.sql` is the readable reference schema. SQLAlchemy models under
`backend/app/models` are the application mapping. Keep both aligned until a
formal migration tool becomes the source of truth.
