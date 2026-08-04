from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    final_diagnosis: str = Field(min_length=2)
    notes: str = Field(min_length=10)
    learning_takeaway: str = Field(min_length=10)


class ReviewRead(ReviewCreate):
    id: int
    case_id: int
    expert_id: int
