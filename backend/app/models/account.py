from decimal import Decimal

from sqlalchemy import Integer, String, Boolean, Numeric, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.models.base import Base


class AccountType(Base):
    __tablename__ = "account_type"

    id_account_type: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))

    accounts: Mapped[list["Account"]] = relationship(back_populates="account_type")


class Account(Base):
    __tablename__ = "account"

    id_account: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_client: Mapped[int] = mapped_column(Integer, ForeignKey("client.id_client"), nullable=False, index=True)
    id_account_type: Mapped[int] = mapped_column(Integer, ForeignKey("account_type.id_account_type"), nullable=False)
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("currency.currency_code"), nullable=False)
    account_number: Mapped[str] = mapped_column(String(34), unique=True, nullable=False, index=True)
    balance: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, default=0.00)
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    owner: Mapped["Client"] = relationship(back_populates="accounts", foreign_keys=[id_client])
    account_type: Mapped["AccountType"] = relationship(back_populates="accounts", foreign_keys=[id_account_type])
    currency: Mapped["Currency"] = relationship(foreign_keys=[currency_code])
