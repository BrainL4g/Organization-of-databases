"""Схемы для транзакций и проводок."""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class TransactionTypeBase(BaseModel):
    """Базовая схема типа транзакции."""
    name: str = Field(..., max_length=50)
    description: Optional[str] = None


class TransactionTypeCreate(TransactionTypeBase):
    """Схема для создания типа транзакции."""
    pass


class TransactionTypeUpdate(TransactionTypeBase):
    """Схема для обновления типа транзакции."""
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class TransactionTypeInDBBase(TransactionTypeBase):
    """Базовая схема типа транзакции из БД."""
    id: int

    class Config:
        from_attributes = True


class TransactionType(TransactionTypeInDBBase):
    """Схема типа транзакции для ответа."""
    pass


class TransactionStatusBase(BaseModel):
    """Базовая схема статуса транзакции."""
    code: str = Field(..., max_length=20)
    description: Optional[str] = None


class TransactionStatusCreate(TransactionStatusBase):
    """Схема для создания статуса транзакции."""
    pass


class TransactionStatusUpdate(TransactionStatusBase):
    """Схема для обновления статуса транзакции."""
    code: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = None


class TransactionStatusInDBBase(TransactionStatusBase):
    """Базовая схема статуса транзакции из БД."""

    class Config:
        from_attributes = True


class TransactionStatus(TransactionStatusInDBBase):
    """Схема статуса транзакции для ответа."""
    pass


class TransactionBase(BaseModel):
    """Базовая схема транзакции."""
    amount: int = Field(..., gt=0)
    currency_code: str = Field(..., max_length=3)
    description: Optional[str] = None


class TransactionCreate(TransactionBase):
    """Схема для создания транзакции."""
    initiator_client_id: Optional[int] = None
    transaction_type_id: int
    status_code: str = "created"


class TransactionUpdate(TransactionBase):
    """Схема для обновления транзакции."""
    amount: Optional[int] = Field(None, gt=0)
    currency_code: Optional[str] = Field(None, max_length=3)
    description: Optional[str] = None
    status_code: Optional[str] = None


class TransactionInDBBase(TransactionBase):
    """Базовая схема транзакции из БД."""
    id: UUID
    initiator_client_id: Optional[int] = None
    transaction_type_id: int
    status_code: str
    created_at: datetime

    class Config:
        from_attributes = True


class Transaction(TransactionInDBBase):
    """Схема транзакции для ответа."""
    transaction_type: Optional[TransactionType] = None
    status: Optional[TransactionStatus] = None


class LedgerEntryBase(BaseModel):
    """Базовая схема проводки."""
    entry_type: str = Field(..., pattern=r'^(DEBIT|CREDIT)$')
    amount: int = Field(..., gt=0)
    currency_code: str = Field(..., max_length=3)
    balance_after: Optional[int] = None
    note: Optional[str] = None


class LedgerEntryCreate(LedgerEntryBase):
    """Схема для создания проводки."""
    transaction_id: UUID
    account_id: int


class LedgerEntryUpdate(LedgerEntryBase):
    """Схема для обновления проводки."""
    entry_type: Optional[str] = Field(None, pattern=r'^(DEBIT|CREDIT)$')
    amount: Optional[int] = Field(None, gt=0)
    currency_code: Optional[str] = Field(None, max_length=3)
    balance_after: Optional[int] = None
    note: Optional[str] = None


class LedgerEntryInDBBase(LedgerEntryBase):
    """Базовая схема проводки из БД."""
    id: int
    transaction_id: UUID
    account_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LedgerEntry(LedgerEntryInDBBase):
    """Схема проводки для ответа."""
    pass