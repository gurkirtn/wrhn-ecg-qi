from fastapi import APIRouter, status

from ..schemas.review import ReviewCreate

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/queue")
def review_queue() -> list[dict]:
    return []


@router.post("/{case_id}", status_code=status.HTTP_201_CREATED)
def submit_review(case_id: int, payload: ReviewCreate) -> dict:
    return {"id": 1, "case_id": case_id, "expert_id": 1, **payload.model_dump()}
