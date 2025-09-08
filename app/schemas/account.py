"""Схемы для банковских счетов и типов счетов."""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.currency import Currency


class AccountTypeBase(BaseModel):
    """Базовая схема типа счета."""
    name: str = Field(..., max_length=100)
    description: Optional[str] = None


class AccountTypeCreate(AccountTypeBase):
    """Схема для создания типа счета."""
    pass


class AccountTypeUpdate(AccountTypeBase):
    """Схема для обновления типа счета."""
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None


class AccountTypeInDBBase(AccountTypeBase):
    """Базовая схема типа счета из БД."""
    id: int

    class Config:
        from_attributes = True


class AccountType(AccountTypeInDBBase):
    """Схема типа счета для ответа."""
    pass


class AccountBase(BaseModel):
    """Базовая схема банковского счета."""
    account_number: str = Field(..., max_length=50)
    currency_code: str = Field(..., max_length=3)
    cached_balance: int = Field(default=0, ge=0)
    is_blocked: bool = False
    metadata_json: Optional[Dict[str, Any]] = None


class AccountCreate(AccountBase):
    """Схема для создания банковского счета."""
    client_id: int
    account_type_id: Optional[int] = None


class AccountUpdate(AccountBase):
    """Схема для обновления банковского счета."""
    account_number: Optional[str] = Field(None, max_length=50)
    currency_code: Optional[str] = Field(None, max_length=3)
    cached_balance: Optional[int] = Field(None, ge=0)
    is_blocked: Optional[bool] = None
    metadata_json: Optional[Dict[str, Any]] = None
    account_type_id: Optional[int] = None


class AccountInDBBase(AccountBase):
    """Базовая схема банковского счета из БД."""
    id: int
    client_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Account(AccountInDBBase):
    """Схема банковского счета для ответа."""
    currency: Optional[Currency] = None
    account_type: Optional[AccountType] = None