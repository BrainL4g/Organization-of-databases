from decimal import Decimal

from sqlalchemy import Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from backend.app.models.base import Base


class ProductType(Base):
    __tablename__ = "product_type"

    id_product_type: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))

    products: Mapped[list["Product"]] = relationship(back_populates="product_type")


class Product(Base):
    __tablename__ = "product"

    id_product: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_product_type: Mapped[int] = mapped_column(Integer, ForeignKey("product_type.id_product_type"), nullable=False)
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("currency.currency_code"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    interest_rate: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    term_months: Mapped[int | None] = mapped_column(Integer)
    min_amount: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))
    max_amount: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))

    product_type: Mapped["ProductType"] = relationship(back_populates="products")
    currency: Mapped["Currency"] = relationship(back_populates="products")
    contracts: Mapped[list["Contract"]] = relationship(back_populates="product")
