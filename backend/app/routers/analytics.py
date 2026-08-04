from fastapi import APIRouter

from ..schemas.analytics import AnalyticsSummary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def analytics_summary() -> AnalyticsSummary:
    return AnalyticsSummary(total_cases=0, awaiting_review=0, reviewed_cases=0, concordance_rate=0.0)
