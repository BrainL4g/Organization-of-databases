from pydantic import BaseModel
from decimal import Decimal
from datetime import date

from backend.app.schemas.base import BaseResponse
from backend.app.models.enums import DepositStatus


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
