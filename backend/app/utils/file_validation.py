from pathlib import Path

ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".pdf", ".xml", ".dcm"}


def validate_ecg_filename(filename: str) -> bool:
    return Path(filename).suffix.casefold() in ALLOWED_SUFFIXES
