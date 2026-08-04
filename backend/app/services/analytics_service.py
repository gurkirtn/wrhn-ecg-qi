def concordance_rate(matches: list[bool]) -> float:
    return round(sum(matches) / len(matches) * 100, 1) if matches else 0.0
