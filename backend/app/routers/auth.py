from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/auth", tags=["auth"])

DEMO_USERS = {
    "clinician": {"id": "clinician", "display_name": "Dr. Elena Rossi", "roles": ["clinician"]},
    "expert": {"id": "expert", "display_name": "Dr. Maya Chen", "roles": ["expert"]},
    "dual": {"id": "dual", "display_name": "Dr. A. Nkemdirim", "roles": ["clinician", "expert"]},
}


@router.post("/demo/{user_id}")
def demo_login(user_id: str) -> dict:
    if user_id not in DEMO_USERS:
        raise HTTPException(status_code=404, detail="Demo user not found")
    return DEMO_USERS[user_id]
