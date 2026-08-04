from pydantic import BaseModel, Field


class AnalysisRead(BaseModel):
    diagnosis: str
    confidence: float = Field(ge=0, le=1)
    features: list[str]
    explanation: str
    model_version: str
