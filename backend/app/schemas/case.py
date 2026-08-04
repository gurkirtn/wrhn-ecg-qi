from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class CaseCreate(BaseModel):
    patient_id: str = Field(pattern=r"^(PT|WRHN)-\d{5}$")
    clinician_diagnosis: str
    reason: str | None = None


class CaseRead(CaseCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    created_at: datetime
