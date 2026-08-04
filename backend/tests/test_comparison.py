from app.services.comparison_service import compare_diagnoses


def test_exact_diagnosis_is_concordant() -> None:
    result = compare_diagnoses("Atrial Flutter", "Atrial Flutter")
    assert result == {"match_rating": 100, "severity": "none"}
