from dataclasses import dataclass
import numpy as np


@dataclass
class MockEcgClassifier:
    labels: tuple[str, ...] = ("normal", "afib", "block")

    def predict_proba(self, signal: np.ndarray) -> dict[str, float]:
        seed = int(abs(float(np.asarray(signal).sum())) * 1000) % len(self.labels)
        scores = np.full(len(self.labels), 0.1, dtype=float)
        scores[seed] = 0.8
        return dict(zip(self.labels, scores.tolist(), strict=True))
