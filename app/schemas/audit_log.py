"""Схемы для журнала аудита."""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class AuditLogBase(BaseModel):
    """Базовая схема записи аудита."""
    action: str = Field(..., max_length=500)
    entity_type: Optional[str] = Field(None, max_length=100)
    entity_id: Optional[str] = Field(None, max_length=100)
    details: Optional[Dict[str, Any]] = None


class AuditLogCreate(AuditLogBase):
    """Схема для создания записи аудита."""
    sys_user_id: Optional[int] = None


class AuditLogUpdate(AuditLogBase):
    """Схема для обновления записи аудита."""
    action: Optional[str] = Field(None, max_length=500)
    entity_type: Optional[str] = Field(None, max_length=100)
    entity_id: Optional[str] = Field(None, max_length=100)
    details: Optional[Dict[str, Any]] = None


class AuditLogInDBBase(AuditLogBase):
    """Базовая схема записи аудита из БД."""
    id: int
    sys_user_id: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class AuditLog(AuditLogInDBBase):
    """Схема записи аудита для ответа."""
    pass