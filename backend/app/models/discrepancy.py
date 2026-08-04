from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class Discrepancy(Base):
    __tablename__ = "discrepancies"
    id: Mapped[int] = mapped_column(primary_key=True)
    case_id: Mapped[int] = mapped_column(ForeignKey("ecg_cases.id"), unique=True)
    severity: Mapped[str] = mapped_column(String(24))
    match_rating: Mapped[float] = mapped_column(Float)
