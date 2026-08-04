from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class EcgSample:
    path: Path
    label: str


def discover_samples(root: Path) -> list[EcgSample]:
    return [EcgSample(path, path.parent.name) for path in root.glob("*/*") if path.is_file()]
