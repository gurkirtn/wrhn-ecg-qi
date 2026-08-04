from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications() -> list[dict]:
    return []
