from pydantic import BaseModel
from decimal import Decimal
from datetime import date

from backend.app.schemas.base import BaseResponse

class CurrencyRateOut(BaseResponse):
    id_rate: int
    from_currency_code: str
    to_currency_code: str
    rate: Decimal
    valid_date: date