# Model card: mock ECG second reader

## Status

Deterministic simulation for interface testing. Not a trained clinical model.

## Intended use

Demonstrate clinician/AI comparison, discrepancy routing, expert adjudication,
and learning feedback.

## Limitations

Outputs are generated from mock identifiers, do not inspect ECG pixels or
signals, have no validated performance, and must not inform care.

Any future model must document training data, cohort composition, preprocessing,
metrics, subgroup evaluation, calibration, external validation, monitoring,
failure modes, and human oversight before integration.
