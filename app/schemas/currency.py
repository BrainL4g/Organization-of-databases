"""Схемы для валют и валютных курсов."""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class CurrencyBase(BaseModel):
    """Базовая схема валюты."""
    currency_code: str = Field(..., max_length=3)
    display_name: str
    minor_unit: int = Field(..., ge=0, le=10)


class CurrencyCreate(CurrencyBase):
    """Схема для создания валюты."""
    pass


class CurrencyUpdate(CurrencyBase):
    """Схема для обновления валюты."""
    currency_code: Optional[str] = Field(None, max_length=3)
    display_name: Optional[str] = None
    minor_unit: Optional[int] = Field(None, ge=0, le=10)


class CurrencyInDBBase(CurrencyBase):
    """Базовая схема валюты из БД."""

    class Config:
        from_attributes = True


class Currency(CurrencyInDBBase):
    """Схема валюты для ответа."""
    pass


class ExchangeRateBase(BaseModel):
    """Базовая схема валютного курса."""
    from_currency_code: str = Field(..., max_length=3)
    to_currency_code: str = Field(..., max_length=3)
    rate: float = Field(..., gt=0)
    date: date


class ExchangeRateCreate(ExchangeRateBase):
    """Схема для создания валютного курса."""
    pass


class ExchangeRateUpdate(ExchangeRateBase):
    """Схема для обновления валютного курса."""
    from_currency_code: Optional[str] = Field(None, max_length=3)
    to_currency_code: Optional[str] = Field(None, max_length=3)
    rate: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None


class ExchangeRateInDBBase(ExchangeRateBase):
    """Базовая схема валютного курса из БД."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ExchangeRate(ExchangeRateInDBBase):
    """Схема валютного курса для ответа."""
    pass