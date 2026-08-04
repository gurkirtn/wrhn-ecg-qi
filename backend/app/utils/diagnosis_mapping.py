ALIASES = {
    "afib": "Atrial Fibrillation",
    "af": "Atrial Fibrillation",
    "nsr": "Normal Sinus Rhythm",
    "stemi": "ST-Elevation Myocardial Infarction",
}


def normalize_diagnosis(value: str) -> str:
    clean = value.strip()
    return ALIASES.get(clean.casefold(), clean)
