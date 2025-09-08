"""Схемы для депозитов и начислений процентов."""
from datetime import datetime, date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class DepositBase(BaseModel):
    """Базовая схема депозита."""
    principal: int = Field(..., gt=0)
    currency_code: str = Field(..., max_length=3)
    interest_rate: float = Field(..., ge=0, le=100)
    start_date: date
    maturity_date: Optional[date] = None
    status: str = Field(..., max_length=20)


class DepositCreate(DepositBase):
    """Схема для создания депозита."""
    account_id: int
    contract_id: int


class DepositUpdate(DepositBase):
    """Схема для обновления депозита."""
    principal: Optional[int] = Field(None, gt=0)
    currency_code: Optional[str] = Field(None, max_length=3)
    interest_rate: Optional[float] = Field(None, ge=0, le=100)
    start_date: Optional[date] = None
    maturity_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)
    account_id: Optional[int] = None
    contract_id: Optional[int] = None


class DepositInDBBase(DepositBase):
    """Базовая схема депозита из БД."""
    id: int
    account_id: int
    contract_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Deposit(DepositInDBBase):
    """Схема депозита для ответа."""
    pass


class InterestPaymentBase(BaseModel):
    """Базовая схема начисления процентов."""
    amount: int = Field(..., gt=0)


class InterestPaymentCreate(InterestPaymentBase):
    """Схема для создания начисления процентов."""
    deposit_id: int
    transaction_id: UUID


class InterestPaymentUpdate(InterestPaymentBase):
    """Схема для обновления начисления процентов."""
    amount: Optional[int] = Field(None, gt=0)
    deposit_id: Optional[int] = None
    transaction_id: Optional[UUID] = None


class InterestPaymentInDBBase(InterestPaymentBase):
    """Базовая схема начисления процентов из БД."""
    id: int
    deposit_id: int
    transaction_id: UUID
    paid_at: datetime

    class Config:
        from_attributes = True


class InterestPayment(InterestPaymentInDBBase):
    """Схема начисления процентов для ответа."""
    pass