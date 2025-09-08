"""Модели депозитов и начислений процентов."""
from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from uuid import UUID
from sqlalchemy import String, Text, Numeric, Boolean, ForeignKey, Index, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, IntIdMixin

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.currency import Currency
    from app.models.product import Contract
    from app.models.transaction import Transaction


class Deposit(Base, IntIdMixin, TimestampMixin):
    """Модель депозита (вклада)."""
    __tablename__ = "deposits"
    __table_args__ = (
        UniqueConstraint("contract_id"),
        Index("ix_deposits_account_id", "account_id"),
        Index("ix_deposits_currency_code", "currency_code"),
    )

    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), nullable=False)
    principal: Mapped[int] = mapped_column(nullable=False)  # Первоначальная сумма в минорных единицах
    currency_code: Mapped[str] = mapped_column(ForeignKey("currencies.currency_code"), nullable=False)
    interest_rate: Mapped[float] = mapped_column(Numeric(8, 6), nullable=False)
    start_date: Mapped[date] = mapped_column(nullable=False)
    maturity_date: Mapped[Optional[date]] = mapped_column()
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # active, matured, withdrawn
    contract_id: Mapped[int] = mapped_column(ForeignKey("contracts.id"), unique=True, nullable=False)

    # Relationships
    account: Mapped["Account"] = relationship("Account", back_populates="deposits")
    currency: Mapped["Currency"] = relationship("Currency", back_populates="deposits")
    contract: Mapped["Contract"] = relationship("Contract", back_populates="deposits")
    interest_payments: Mapped[List["InterestPayment"]] = relationship(
        "InterestPayment",
        back_populates="deposit",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Deposit(id={self.id}, principal={self.principal}, status='{self.status}')>"


class InterestPayment(Base, IntIdMixin, TimestampMixin):
    """Модель начисления и выплаты процентов по депозиту."""
    __tablename__ = "interest_payments"
    __table_args__ = (
        Index("ix_interest_payments_deposit_id", "deposit_id"),
        Index("ix_interest_payments_transaction_id", "transaction_id"),
    )

    deposit_id: Mapped[int] = mapped_column(ForeignKey("deposits.id"), nullable=False)
    transaction_id: Mapped[UUID] = mapped_column(ForeignKey("transactions.id"), nullable=False)
    amount: Mapped[int] = mapped_column(nullable=False)  # Сумма начисленных процентов в минорных единицах
    paid_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    # Relationships
    deposit: Mapped["Deposit"] = relationship("Deposit", back_populates="interest_payments")
    transaction: Mapped["Transaction"] = relationship("Transaction", back_populates="interest_payments")

    def __repr__(self) -> str:
        return f"<InterestPayment(id={self.id}, amount={self.amount})>"