from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime

from backend.app.schemas.base import BaseResponse
from backend.app.models.enums import TransactionStatusEnum


class TransactionOut(BaseResponse):
    id_transaction: int
    sender_account_id: int | None
    receiver_account_id: int | None
    amount: Decimal
    currency_code: str
    description: str | None
    status_code: TransactionStatusEnum
    created_at: datetime
