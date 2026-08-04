from app.services.analytics_service import concordance_rate


def test_concordance_rate() -> None:
    assert concordance_rate([True, False, True, True]) == 75.0
