"""Модель журнала аудита."""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, Index, BigInteger
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, IntIdMixin

if TYPE_CHECKING:
    from app.models.user import SystemUser


class AuditLog(Base, IntIdMixin):
    """Модель записи аудита действий в системе."""
    __tablename__ = "audit_log"
    __table_args__ = (
        Index("ix_audit_log_sys_user_id", "sys_user_id"),
        Index("ix_audit_log_timestamp", "timestamp"),
        Index("ix_audit_log_entity_type", "entity_type"),
    )

    sys_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("system_users.id"))
    action: Mapped[str] = mapped_column(Text, nullable=False)
    entity_type: Mapped[Optional[str]] = mapped_column(String(100))
    entity_id: Mapped[Optional[str]] = mapped_column(String(100))
    timestamp: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    details: Mapped[Optional[dict]] = mapped_column(JSONB)

    # Relationships
    user: Mapped[Optional["SystemUser"]] = relationship("SystemUser", back_populates="audit_logs")

    def __repr__(self) -> str:
        return f"<AuditLog(id={self.id}, action='{self.action}', timestamp={self.timestamp})>"