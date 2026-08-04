PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ecg_cases (
  id INTEGER PRIMARY KEY,
  patient_id TEXT NOT NULL UNIQUE,
  clinician_id INTEGER NOT NULL REFERENCES users(id),
  clinician_diagnosis TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  file_path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_analyses (
  id INTEGER PRIMARY KEY,
  case_id INTEGER NOT NULL UNIQUE REFERENCES ecg_cases(id),
  diagnosis TEXT NOT NULL,
  confidence REAL NOT NULL,
  features_json TEXT NOT NULL,
  explanation TEXT NOT NULL,
  model_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expert_reviews (
  id INTEGER PRIMARY KEY,
  case_id INTEGER NOT NULL UNIQUE REFERENCES ecg_cases(id),
  expert_id INTEGER NOT NULL REFERENCES users(id),
  final_diagnosis TEXT NOT NULL,
  notes TEXT NOT NULL,
  learning_takeaway TEXT NOT NULL,
  reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
