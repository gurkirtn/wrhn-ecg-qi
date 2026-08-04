import numpy as np


def normalize_waveform(signal: np.ndarray) -> np.ndarray:
    signal = np.asarray(signal, dtype=np.float32)
    standard_deviation = signal.std()
    return (signal - signal.mean()) / standard_deviation if standard_deviation else signal - signal.mean()
