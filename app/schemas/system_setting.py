"""Схемы для настроек системы."""
from typing import Optional
from pydantic import BaseModel, Field


class SystemSettingBase(BaseModel):
    """Базовая схема настройки системы."""
    key: str = Field(..., max_length=100)
    value: str
    description: Optional[str] = None


class SystemSettingCreate(SystemSettingBase):
    """Схема для создания настройки системы."""
    pass


class SystemSettingUpdate(SystemSettingBase):
    """Схема для обновления настройки системы."""
    key: Optional[str] = Field(None, max_length=100)
    value: Optional[str] = None
    description: Optional[str] = None


class SystemSettingInDBBase(SystemSettingBase):
    """Базовая схема настройки системы из БД."""

    class Config:
        from_attributes = True


class SystemSetting(SystemSettingInDBBase):
    """Схема настройки системы для ответа."""
    pass