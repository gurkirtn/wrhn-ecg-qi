def compare_diagnoses(clinician_diagnosis: str, ai_diagnosis: str) -> dict:
    exact = clinician_diagnosis.casefold().strip() == ai_diagnosis.casefold().strip()
    return {"match_rating": 100 if exact else 45, "severity": "none" if exact else "major"}
