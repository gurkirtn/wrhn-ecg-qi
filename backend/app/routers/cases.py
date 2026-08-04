from fastapi import APIRouter, HTTPException, status

from ..schemas.case import CaseCreate

router = APIRouter(prefix="/cases", tags=["cases"])

_cases: list[dict] = []


@router.get("")
def list_cases() -> list[dict]:
    return _cases


@router.post("", status_code=status.HTTP_201_CREATED)
def create_case(payload: CaseCreate) -> dict:
    if any(item["patientId"] == payload.patient_id for item in _cases):
        raise HTTPException(status_code=409, detail="Patient ID already exists")
    item = {
        "id": str(len(_cases) + 1),
        "patientId": payload.patient_id,
        "clinicianDiagnosis": payload.clinician_diagnosis,
        "aiDiagnosis": "Pending mock analysis",
        "status": "awaiting_review",
        "createdAt": "just-now",
    }
    _cases.insert(0, item)
    return item
