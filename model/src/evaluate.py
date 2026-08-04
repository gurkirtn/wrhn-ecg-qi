def accuracy(expected: list[str], predicted: list[str]) -> float:
    if len(expected) != len(predicted):
        raise ValueError("Expected and predicted labels must have the same length")
    return sum(a == b for a, b in zip(expected, predicted, strict=True)) / len(expected) if expected else 0.0
