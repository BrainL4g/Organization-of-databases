from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime

from app.schemas.base import BaseResponse


class AccountCreate(BaseModel):
    id_account_type: int
    currency_code: str
    account_number: str


class AccountUpdate(BaseModel):
    is_blocked: bool | None = None


class AccountOut(BaseResponse):
    id_account: int
    account_number: str
    currency_code: str
    balance: Decimal
    is_blocked: bool
    created_at: datetime
    account_type_name: str | None = None
