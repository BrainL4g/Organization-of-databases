"""Схемы для банковских продуктов и договоров."""
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ProductTypeBase(BaseModel):
    """Базовая схема типа продукта."""
    name: str = Field(..., max_length=50)
    description: Optional[str] = None


class ProductTypeCreate(ProductTypeBase):
    """Схема для создания типа продукта."""
    pass


class ProductTypeUpdate(ProductTypeBase):
    """Схема для обновления типа продукта."""
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class ProductTypeInDBBase(ProductTypeBase):
    """Базовая схема типа продукта из БД."""
    id: int

    class Config:
        from_attributes = True


class ProductType(ProductTypeInDBBase):
    """Схема типа продукта для ответа."""
    pass


class ProductBase(BaseModel):
    """Базовая схема банковского продукта."""
    name: str = Field(..., max_length=200)
    interest_rate_min: float = Field(..., ge=0, le=100)
    interest_rate_max: Optional[float] = Field(None, ge=0, le=100)
    term_months_min: Optional[int] = Field(None, ge=0)
    term_months_max: Optional[int] = Field(None, ge=0)
    min_amount: Optional[int] = Field(None, ge=0)
    max_amount: Optional[int] = Field(None, ge=0)
    currency_code: Optional[str] = Field(None, max_length=3)
    is_active: bool = True
    metadata_json: Optional[Dict[str, Any]] = None


class ProductCreate(ProductBase):
    """Схема для создания банковского продукта."""
    prod_type_id: int


class ProductUpdate(ProductBase):
    """Схема для обновления банковского продукта."""
    name: Optional[str] = Field(None, max_length=200)
    interest_rate_min: Optional[float] = Field(None, ge=0, le=100)
    interest_rate_max: Optional[float] = Field(None, ge=0, le=100)
    term_months_min: Optional[int] = Field(None, ge=0)
    term_months_max: Optional[int] = Field(None, ge=0)
    min_amount: Optional[int] = Field(None, ge=0)
    max_amount: Optional[int] = Field(None, ge=0)
    currency_code: Optional[str] = Field(None, max_length=3)
    is_active: Optional[bool] = None
    metadata_json: Optional[Dict[str, Any]] = None
    prod_type_id: Optional[int] = None


class ProductInDBBase(ProductBase):
    """Базовая схема банковского продукта из БД."""
    id: int
    prod_type_id: int

    class Config:
        from_attributes = True


class Product(ProductInDBBase):
    """Схема банковского продукта для ответа."""
    product_type: Optional[ProductType] = None
    currency: Optional[str] = None  # Только код валюты


class ContractBase(BaseModel):
    """Базовая схема договора."""
    start_date: date
    end_date: Optional[date] = None
    principal_amount: int = Field(..., gt=0)
    current_interest_rate: float = Field(..., ge=0, le=100)
    status: str = Field(..., max_length=20)
    signed_by_client: bool = False
    signed_by_bank: bool = False
    metadata_json: Optional[Dict[str, Any]] = None


class ContractCreate(ContractBase):
    """Схема для создания договора."""
    product_id: int
    client_id: int
    account_id: Optional[int] = None


class ContractUpdate(ContractBase):
    """Схема для обновления договора."""
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    principal_amount: Optional[int] = Field(None, gt=0)
    current_interest_rate: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[str] = Field(None, max_length=20)
    signed_by_client: Optional[bool] = None
    signed_by_bank: Optional[bool] = None
    metadata_json: Optional[Dict[str, Any]] = None
    product_id: Optional[int] = None
    client_id: Optional[int] = None
    account_id: Optional[int] = None


class ContractInDBBase(ContractBase):
    """Базовая схема договора из БД."""
    id: int
    product_id: int
    client_id: int
    account_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Contract(ContractInDBBase):
    """Схема договора для ответа."""
    product: Optional[Product] = None