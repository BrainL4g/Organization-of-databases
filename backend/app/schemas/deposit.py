from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional

from app.schemas.base import BaseResponse
from app.models.enums import DepositStatus


class DepositCreate(BaseModel):
    id_contract: int
    id_account: int
    principal_amount: Decimal
    interest_rate: Decimal
    start_date: date
    end_date: date | None = None
    status: DepositStatus = DepositStatus.ACTIVE


class DepositUpdate(BaseModel):
    principal_amount: Decimal | None = None
    interest_rate: Decimal | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: DepositStatus | None = None


class DepositOut(BaseResponse):
    id_deposit: int
    id_contract: int
    id_account: int
    principal_amount: Decimal
    interest_rate: Decimal
    start_date: date
    end_date: date | None
    status: DepositStatus


class InterestPaymentOut(BaseResponse):
    id_payment: int
    id_deposit: int
    interest_amount: Decimal
    payment_period: str
    payment_date: date
    id_transaction: Optional[int] = None