from hashlib import sha256


MOCK_DIAGNOSES = ["Normal Sinus Rhythm", "Atrial Fibrillation", "Atrial Flutter", "1st Degree AV Block"]


def mock_inference(patient_id: str) -> dict:
    seed = int(sha256(patient_id.encode()).hexdigest()[:8], 16)
    diagnosis = MOCK_DIAGNOSES[seed % len(MOCK_DIAGNOSES)]
    return {"diagnosis": diagnosis, "confidence": 0.75 + (seed % 21) / 100, "model_version": "mock-v1"}
