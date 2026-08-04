from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class EcgCase(Base):
    __tablename__ = "ecg_cases"
    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    clinician_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    clinician_diagnosis: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(40), default="draft")
    file_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
