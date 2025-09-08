"""Модели валют и валютных курсов."""
from datetime import date, datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Numeric, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.transaction import Transaction, LedgerEntry
    from app.models.product import Product
    from app.models.deposit import Deposit


class Currency(Base):
    """Модель валюты (справочник)."""
    __tablename__ = "currencies"

    currency_code: Mapped[str] = mapped_column(String(3), primary_key=True)  # ISO 4217
    display_name: Mapped[str] = mapped_column(Text, nullable=False)
    minor_unit: Mapped[int] = mapped_column(Integer, nullable=False)  # Количество знаков после запятой

    # Relationships
    accounts: Mapped[List["Account"]] = relationship("Account", back_populates="currency")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="currency")
    ledger_entries: Mapped[List["LedgerEntry"]] = relationship("LedgerEntry", back_populates="currency")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="currency")
    deposits: Mapped[List["Deposit"]] = relationship("Deposit", back_populates="currency")
    from_exchange_rates: Mapped[List["ExchangeRate"]] = relationship(
        "ExchangeRate",
        foreign_keys="ExchangeRate.from_currency_code",
        back_populates="from_currency",
    )
    to_exchange_rates: Mapped[List["ExchangeRate"]] = relationship(
        "ExchangeRate",
        foreign_keys="ExchangeRate.to_currency_code",
        back_populates="to_currency",
    )

    def __repr__(self) -> str:
        return f"<Currency(code='{self.currency_code}', name='{self.display_name}')>"


class ExchangeRate(Base, TimestampMixin):
    """Модель валютного курса."""
    __tablename__ = "exchange_rates"
    __table_args__ = (
        UniqueConstraint("from_currency_code", "to_currency_code", "date"),
        Index("ix_exchange_rates_date", "date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    from_currency_code: Mapped[str] = mapped_column(
        ForeignKey("currencies.currency_code"),
        nullable=False,
    )
    to_currency_code: Mapped[str] = mapped_column(
        ForeignKey("currencies.currency_code"),
        nullable=False,
    )
    rate: Mapped[float] = mapped_column(Numeric(20, 10), nullable=False)  # Сколько to_currency за 1 from_currency
    date: Mapped[date] = mapped_column(nullable=False)

    # Relationships
    from_currency: Mapped["Currency"] = relationship(
        "Currency",
        foreign_keys=[from_currency_code],
        back_populates="from_exchange_rates",
    )
    to_currency: Mapped["Currency"] = relationship(
        "Currency",
        foreign_keys=[to_currency_code],
        back_populates="to_exchange_rates",
    )

    def __repr__(self) -> str:
        return f"<ExchangeRate(id={self.id}, {self.from_currency_code}->{self.to_currency_code}, rate={self.rate}, date={self.date})>"