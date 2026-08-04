from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class ExpertReview(Base):
    __tablename__ = "expert_reviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    case_id: Mapped[int] = mapped_column(ForeignKey("ecg_cases.id"), unique=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    final_diagnosis: Mapped[str] = mapped_column(String(255))
    notes: Mapped[str] = mapped_column(Text)
    learning_takeaway: Mapped[str] = mapped_column(Text)
    reviewed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
