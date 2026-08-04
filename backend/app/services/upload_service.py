from pathlib import Path


def safe_upload_path(upload_dir: str, filename: str) -> Path:
    clean_name = Path(filename).name
    return Path(upload_dir) / clean_name
