"""Схемы для запланированных задач."""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ScheduledJobBase(BaseModel):
    """Базовая схема запланированной задачи."""
    job_type: str = Field(..., max_length=100)
    next_run_at: datetime
    payload: Optional[Dict[str, Any]] = None
    status: str = Field(..., max_length=20)


class ScheduledJobCreate(ScheduledJobBase):
    """Схема для создания запланированной задачи."""
    pass


class ScheduledJobUpdate(ScheduledJobBase):
    """Схема для обновления запланированной задачи."""
    job_type: Optional[str] = Field(None, max_length=100)
    next_run_at: Optional[datetime] = None
    payload: Optional[Dict[str, Any]] = None
    status: Optional[str] = Field(None, max_length=20)


class ScheduledJobInDBBase(ScheduledJobBase):
    """Базовая схема запланированной задачи из БД."""
    id: int

    class Config:
        from_attributes = True


class ScheduledJob(ScheduledJobInDBBase):
    """Схема запланированной задачи для ответа."""
    pass