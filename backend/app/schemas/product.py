from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

from backend.app.schemas.base import BaseResponse


class ProductOut(BaseResponse):
    id_product: int
    name: str
    currency_code: str
    interest_rate: Decimal | None
    term_months: int | None
    min_amount: Decimal | None
    max_amount: Decimal | None
    product_type_name: str
