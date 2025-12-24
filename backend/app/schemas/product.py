from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

from app.schemas.base import BaseResponse


class ProductCreate(BaseModel):
    id_product_type: int
    currency_code: str
    name: str
    interest_rate: Optional[Decimal] = None
    term_months: Optional[int] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    interest_rate: Optional[Decimal] = None
    term_months: Optional[int] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None


class ProductOut(BaseResponse):
    id_product: int
    name: str
    currency_code: str
    interest_rate: Optional[Decimal]
    term_months: Optional[int]
    min_amount: Optional[Decimal]
    max_amount: Optional[Decimal]
    product_type_name: str