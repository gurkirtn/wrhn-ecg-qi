# ECG-QI

ECG-QI is an interactive quality-improvement prototype for Waterloo Regional
Health Network. It provides an AI-assisted second read, discrepancy
classification, expert review, private clinician learning feedback, and
hospital-wide aggregate analytics.

## What is implemented

- Responsive application shell with Dashboard, ECG Cases, Review Queue,
  Learning Dashboard, Analytics, and Settings routes.
- Twenty typed, anonymized case fixtures and chart aggregates.
- Interactive case filtering and linked case details.
- A 12-lead synthetic ECG viewer with clinical calibration labels.
- Submit-before-reveal behavior for unread cases.
- Simulated AI prediction metadata, confidence, latency, explanation, and
  clinician-override copy.
- Expert review queue, private learning feedback, and aggregate analytics.
- Keyboard focus states and reduced-motion support.

## What is simulated

All patient records, ECG traces, AI reads, adjudications, and metrics are mock
data for a capstone demonstration. The product is a quality-improvement and
education tool, not an autonomous diagnostic device.

`app/data.ts` exposes `aiService.getReadForCase(caseId)` with the same
asynchronous interface a real inference service can implement. Replace that
method with an API call while keeping the `AiPrediction` contract in
`app/types.ts`. The discrepancy helper can similarly be replaced by a
clinically validated terminology and tiering service.

## Local use

```bash
pnpm install --dangerously-allow-all-builds
pnpm run dev
pnpm run build
```
