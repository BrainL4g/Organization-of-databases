"""Модель настроек системы."""
from typing import Optional
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class SystemSetting(Base):
    """Модель настройки системы."""
    __tablename__ = "system_settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    def __repr__(self) -> str:
        return f"<SystemSetting(key='{self.key}')>"