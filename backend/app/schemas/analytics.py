from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_cases: int
    awaiting_review: int
    reviewed_cases: int
    concordance_rate: float
