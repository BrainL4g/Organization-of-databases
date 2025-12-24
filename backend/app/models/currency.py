from decimal import Decimal

from sqlalchemy import String, Integer, Numeric, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from backend.app.models.base import Base


class Currency(Base):
    __tablename__ = "currency"

    currency_code: Mapped[str] = mapped_column(String(3), primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    decimal_places: Mapped[int] = mapped_column(Integer, nullable=False)

    accounts: Mapped[list["Account"]] = relationship(back_populates="currency")
    products: Mapped[list["Product"]] = relationship(back_populates="currency")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="currency")
    rates_from: Mapped[list["CurrencyRate"]] = relationship(back_populates="from_currency",
                                                            foreign_keys="CurrencyRate.from_currency_code")
    rates_to: Mapped[list["CurrencyRate"]] = relationship(back_populates="to_currency",
                                                          foreign_keys="CurrencyRate.to_currency_code")


class CurrencyRate(Base):
    __tablename__ = "currency_rate"

    id_rate: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    from_currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("currency.currency_code"), nullable=False)
    to_currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("currency.currency_code"), nullable=False)
    rate: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    valid_date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)

    from_currency: Mapped["Currency"] = relationship(foreign_keys=[from_currency_code])
    to_currency: Mapped["Currency"] = relationship(foreign_keys=[to_currency_code])
