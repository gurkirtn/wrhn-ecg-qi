# Model research scaffold

This directory separates future ECG model research from the clinical workflow
application. The current web demo uses deterministic mock predictions.

Only de-identified, approved datasets should be placed in local development
storage. Do not commit raw clinical data or trained checkpoints. Record dataset
provenance, preprocessing, evaluation cohorts, limitations, and intended use in
`docs/model-card.md` before connecting a model to the API.
