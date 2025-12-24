from pydantic import BaseModel
from decimal import Decimal
from datetime import date

from app.schemas.base import BaseResponse
from app.models.enums import ContractStatus

class ContractCreate(BaseModel):
    id_product: int
    id_account: int
    amount: Decimal
    start_date: date

class ContractOut(BaseResponse):
    id_contract: int
    id_product: int
    id_account: int
    amount: Decimal
    start_date: date
    end_date: date | None
    status: ContractStatus
    signed_by_client: bool
    signed_by_bank: bool