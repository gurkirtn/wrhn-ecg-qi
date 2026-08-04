from app.services.review_service import build_learning_takeaway


def test_learning_takeaway_contains_final_diagnosis() -> None:
    takeaway = build_learning_takeaway("Atrial Flutter", "Review V1 carefully.")
    assert "Atrial Flutter" in takeaway
