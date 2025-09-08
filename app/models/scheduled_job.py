"""Модель запланированных задач."""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, IntIdMixin


class ScheduledJob(Base, IntIdMixin):
    """Модель задачи для автоматического выполнения."""
    __tablename__ = "scheduled_jobs"
    __table_args__ = (
        Index("ix_scheduled_jobs_next_run_at", "next_run_at"),
        Index("ix_scheduled_jobs_status", "status"),
        Index("ix_scheduled_jobs_job_type", "job_type"),
    )

    job_type: Mapped[str] = mapped_column(String(100), nullable=False)
    next_run_at: Mapped[datetime] = mapped_column(nullable=False)
    payload: Mapped[Optional[dict]] = mapped_column(JSONB)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # pending, running, done, failed

    def __repr__(self) -> str:
        return f"<ScheduledJob(id={self.id}, type='{self.job_type}', status='{self.status}')>"