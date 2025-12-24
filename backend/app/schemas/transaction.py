from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional

from app.schemas.base import BaseResponse
from app.models.enums import TransactionStatusEnum


class TransactionCreate(BaseModel):
    sender_account_id: Optional[int] = None
    receiver_account_id: Optional[int] = None
    amount: Decimal
    currency_code: str
    description: Optional[str] = None
    status_code: TransactionStatusEnum = TransactionStatusEnum.COMPLETED


class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    status_code: Optional[TransactionStatusEnum] = None


class TransactionOut(BaseResponse):
    id_transaction: int
    sender_account_id: Optional[int]
    receiver_account_id: Optional[int]
    amount: Decimal
    currency_code: str
    description: Optional[str]
    status_code: TransactionStatusEnum
    created_at: datetime