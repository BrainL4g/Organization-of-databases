"""Модели банковских счетов и типов счетов."""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, ForeignKey, Numeric, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, IntIdMixin

if TYPE_CHECKING:
    from app.models.user import BankClient
    from app.models.currency import Currency
    from app.models.transaction import LedgerEntry
    from app.models.product import Contract


class AccountType(Base, IntIdMixin):
    """Модель типа банковского счета."""
    __tablename__ = "account_types"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    accounts: Mapped[List["Account"]] = relationship(
        "Account",
        back_populates="account_type",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<AccountType(id={self.id}, name='{self.name}')>"


class Account(Base, IntIdMixin, TimestampMixin):
    """Модель банковского счета."""
    __tablename__ = "accounts"
    __table_args__ = (
        UniqueConstraint("account_number"),
        Index("ix_accounts_client_id", "client_id"),
        Index("ix_accounts_currency_code", "currency_code"),
    )

    client_id: Mapped[int] = mapped_column(
        ForeignKey("bank_clients.id", ondelete="CASCADE"),
        nullable=False,
    )
    account_type_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("account_types.id"),
    )
    currency_code: Mapped[str] = mapped_column(
        ForeignKey("currencies.currency_code"),
        nullable=False,
    )
    account_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    cached_balance: Mapped[int] = mapped_column(default=0, nullable=False)  # В минорных единицах
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(default=dict)

    # Relationships
    client: Mapped["BankClient"] = relationship("BankClient", back_populates="accounts")
    account_type: Mapped[Optional["AccountType"]] = relationship("AccountType", back_populates="accounts")
    currency: Mapped["Currency"] = relationship("Currency")
    ledger_entries: Mapped[List["LedgerEntry"]] = relationship(
        "LedgerEntry",
        back_populates="account",
        lazy="selectin",
    )
    contracts: Mapped[List["Contract"]] = relationship(
        "Contract",
        back_populates="account",
        lazy="selectin",
    )
    deposits: Mapped[List["Deposit"]] = relationship(
        "Deposit",
        back_populates="account",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Account(id={self.id}, number='{self.account_number}', balance={self.cached_balance})>"


# Импортируем в конце для избежания циклических импортов
from app.models.deposit import Deposit