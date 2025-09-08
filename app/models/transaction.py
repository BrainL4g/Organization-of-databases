"""Модели транзакций и проводок."""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from sqlalchemy import String, Text, BigInteger, ForeignKey, Enum, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import BankClient
    from app.models.currency import Currency
    from app.models.account import Account
    from app.models.deposit import InterestPayment


class TransactionType(Base):
    """Модель типа транзакции (справочник)."""
    __tablename__ = "transaction_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="transaction_type")

    def __repr__(self) -> str:
        return f"<TransactionType(id={self.id}, name='{self.name}')>"


class TransactionStatus(Base):
    """Модель статуса транзакции (справочник)."""
    __tablename__ = "transaction_statuses"

    code: Mapped[str] = mapped_column(String(20), primary_key=True)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="status")

    def __repr__(self) -> str:
        return f"<TransactionStatus(code='{self.code}')>"


class Transaction(Base, TimestampMixin):
    """Модель заголовка транзакции."""
    __tablename__ = "transactions"
    __table_args__ = (
        Index("ix_transactions_initiator_client_id", "initiator_client_id"),
        Index("ix_transactions_currency_code", "currency_code"),
        Index("ix_transactions_created_at", "created_at"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    initiator_client_id: Mapped[Optional[int]] = mapped_column(ForeignKey("bank_clients.id"))
    transaction_type_id: Mapped[int] = mapped_column(ForeignKey("transaction_types.id"))
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)  # В минорных единицах
    currency_code: Mapped[str] = mapped_column(ForeignKey("currencies.currency_code"), nullable=False)
    status_code: Mapped[str] = mapped_column(
        ForeignKey("transaction_statuses.code"),
        default="created",
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    initiator_client: Mapped[Optional["BankClient"]] = relationship(
        "BankClient",
        foreign_keys=[initiator_client_id],
        back_populates="initiated_transactions",
    )
    transaction_type: Mapped["TransactionType"] = relationship("TransactionType", back_populates="transactions")
    currency: Mapped["Currency"] = relationship("Currency", back_populates="transactions")
    status: Mapped["TransactionStatus"] = relationship("TransactionStatus", back_populates="transactions")
    ledger_entries: Mapped[List["LedgerEntry"]] = relationship(
        "LedgerEntry",
        back_populates="transaction",
        lazy="selectin",
    )
    interest_payments: Mapped[List["InterestPayment"]] = relationship(
        "InterestPayment",
        back_populates="transaction",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Transaction(id={self.id}, amount={self.amount}, status='{self.status_code}')>"


class LedgerEntry(Base, TimestampMixin):
    """Модель проводки по счету (неизменяемый журнал)."""
    __tablename__ = "ledger_entries"
    __table_args__ = (
        CheckConstraint("amount > 0", name="check_amount_positive"),
        Index("ix_ledger_entries_transaction_id", "transaction_id"),
        Index("ix_ledger_entries_account_id", "account_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    transaction_id: Mapped[UUID] = mapped_column(ForeignKey("transactions.id"), nullable=False)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), nullable=False)
    entry_type: Mapped[str] = mapped_column(Enum("DEBIT", "CREDIT", name="entry_type_enum"), nullable=False)
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)  # В минорных единицах
    currency_code: Mapped[str] = mapped_column(ForeignKey("currencies.currency_code"), nullable=False)
    balance_after: Mapped[Optional[int]] = mapped_column(BigInteger)  # Баланс после операции
    note: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    transaction: Mapped["Transaction"] = relationship("Transaction", back_populates="ledger_entries")
    account: Mapped["Account"] = relationship("Account", back_populates="ledger_entries")
    currency: Mapped["Currency"] = relationship("Currency", back_populates="ledger_entries")

    def __repr__(self) -> str:
        return f"<LedgerEntry(id={self.id}, type='{self.entry_type}', amount={self.amount})>"