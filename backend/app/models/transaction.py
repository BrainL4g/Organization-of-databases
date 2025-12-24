from decimal import Decimal

from sqlalchemy import Integer, String, Numeric, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from backend.app.models.base import Base
from backend.app.models.enums import TransactionStatusEnum, OperationType


class TransactionType(Base):
    __tablename__ = "transaction_type"

    id_transaction_type: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="transaction_type")


class TransactionStatus(Base):
    __tablename__ = "transaction_status"

    status_code: Mapped[str] = mapped_column(String(30), primary_key=True)
    description: Mapped[str | None] = mapped_column(String(255))

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="status")


class Transaction(Base):
    __tablename__ = "transaction"

    id_transaction: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender_account_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("account.id_account"))
    receiver_account_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("account.id_account"))
    id_transaction_type: Mapped[int] = mapped_column(Integer, ForeignKey("transaction_type.id_transaction_type"),
                                                     nullable=False)
    status_code: Mapped[TransactionStatusEnum] = mapped_column(
        String(30),
        ForeignKey("transaction_status.status_code"),
        nullable=False,
        default=TransactionStatusEnum.PENDING
    )
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("currency.currency_code"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    sender_account: Mapped["Account"] = relationship(foreign_keys=[sender_account_id])
    receiver_account: Mapped["Account"] = relationship(foreign_keys=[receiver_account_id])
    transaction_type: Mapped["TransactionType"] = relationship(back_populates="transactions")
    status: Mapped["TransactionStatus"] = relationship(back_populates="transactions")
    currency: Mapped["Currency"] = relationship(back_populates="transactions")
    ledger_entries: Mapped[list["LedgerEntry"]] = relationship(back_populates="transaction",
                                                               cascade="all, delete-orphan")
    interest_payment: Mapped["InterestPayment"] = relationship(back_populates="transaction")


class LedgerEntry(Base):
    __tablename__ = "ledger_entry"

    id_entry: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_transaction: Mapped[int] = mapped_column(Integer, ForeignKey("transaction.id_transaction"), nullable=False)
    id_account: Mapped[int] = mapped_column(Integer, ForeignKey("account.id_account"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    operation_type: Mapped[OperationType] = mapped_column(String(50), nullable=False)
    balance_after: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    entry_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    transaction: Mapped["Transaction"] = relationship(back_populates="ledger_entries")
    account: Mapped["Account"] = relationship()
