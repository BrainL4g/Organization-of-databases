"""Модели банковских продуктов и договоров."""
from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Numeric, Integer, Boolean, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, IntIdMixin

if TYPE_CHECKING:
    from app.models.user import BankClient
    from app.models.account import Account
    from app.models.currency import Currency
    from app.models.deposit import Deposit


class ProductType(Base, IntIdMixin):
    """Модель типа банковского продукта (справочник)."""
    __tablename__ = "product_types"

    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    products: Mapped[List["Product"]] = relationship("Product", back_populates="product_type")

    def __repr__(self) -> str:
        return f"<ProductType(id={self.id}, name='{self.name}')>"


class Product(Base, IntIdMixin):
    """Модель банковского продукта (шаблон)."""
    __tablename__ = "products"
    __table_args__ = (
        Index("ix_products_prod_type_id", "prod_type_id"),
        Index("ix_products_currency_code", "currency_code"),
    )

    prod_type_id: Mapped[int] = mapped_column(ForeignKey("product_types.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    interest_rate_min: Mapped[float] = mapped_column(Numeric(8, 6), nullable=False)
    interest_rate_max: Mapped[Optional[float]] = mapped_column(Numeric(8, 6))
    term_months_min: Mapped[Optional[int]] = mapped_column(Integer)
    term_months_max: Mapped[Optional[int]] = mapped_column(Integer)
    min_amount: Mapped[Optional[int]] = mapped_column()  # В минорных единицах
    max_amount: Mapped[Optional[int]] = mapped_column()  # В минорных единицах
    currency_code: Mapped[Optional[str]] = mapped_column(ForeignKey("currencies.currency_code"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(default=dict)

    # Relationships
    product_type: Mapped["ProductType"] = relationship("ProductType", back_populates="products")
    currency: Mapped[Optional["Currency"]] = relationship("Currency", back_populates="products")
    contracts: Mapped[List["Contract"]] = relationship("Contract", back_populates="product")

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, name='{self.name}')>"


class Contract(Base, IntIdMixin, TimestampMixin):
    """Модель договора с клиентом."""
    __tablename__ = "contracts"
    __table_args__ = (
        Index("ix_contracts_product_id", "product_id"),
        Index("ix_contracts_client_id", "client_id"),
        Index("ix_contracts_account_id", "account_id"),
    )

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    client_id: Mapped[int] = mapped_column(ForeignKey("bank_clients.id"), nullable=False)
    account_id: Mapped[Optional[int]] = mapped_column(ForeignKey("accounts.id"))
    start_date: Mapped[date] = mapped_column(nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column()
    principal_amount: Mapped[int] = mapped_column(nullable=False)  # В минорных единицах
    current_interest_rate: Mapped[float] = mapped_column(Numeric(8, 6), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # active, closed, overdue
    signed_by_client: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    signed_by_bank: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="contracts")
    client: Mapped["BankClient"] = relationship("BankClient", back_populates="contracts")
    account: Mapped[Optional["Account"]] = relationship("Account", back_populates="contracts")
    deposits: Mapped[List["Deposit"]] = relationship("Deposit", back_populates="contract")

    def __repr__(self) -> str:
        return f"<Contract(id={self.id}, status='{self.status}')>"