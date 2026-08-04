def normalize_signal(samples: list[float]) -> list[float]:
    if not samples:
        return []
    peak = max(abs(value) for value in samples) or 1.0
    return [value / peak for value in samples]
