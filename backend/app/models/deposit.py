from decimal import Decimal

from sqlalchemy import Integer, Numeric, Date, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from backend.app.models.base import Base
from backend.app.models.enums import DepositStatus


class Deposit(Base):
    __tablename__ = "deposit"

    id_deposit: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_contract: Mapped[int] = mapped_column(Integer, ForeignKey("contract.id_contract"), nullable=False, unique=True)
    id_account: Mapped[int] = mapped_column(Integer, ForeignKey("account.id_account"), nullable=False)
    principal_amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    interest_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Date | None] = mapped_column(Date)
    status: Mapped[DepositStatus] = mapped_column(
        String(50),
        nullable=False,
        default=DepositStatus.ACTIVE
    )

    contract: Mapped["Contract"] = relationship(back_populates="deposits")
    account: Mapped["Account"] = relationship()
    interest_payments: Mapped[list["InterestPayment"]] = relationship(back_populates="deposit",
                                                                      cascade="all, delete-orphan")


class InterestPayment(Base):
    __tablename__ = "interest_payment"

    id_payment: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_deposit: Mapped[int] = mapped_column(Integer, ForeignKey("deposit.id_deposit"), nullable=False)
    id_transaction: Mapped[int | None] = mapped_column(Integer, ForeignKey("transaction.id_transaction"))
    interest_amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    payment_period: Mapped[str] = mapped_column(String(50), nullable=False)
    payment_date: Mapped[Date] = mapped_column(Date, nullable=False)

    deposit: Mapped["Deposit"] = relationship(back_populates="interest_payments")
    transaction: Mapped["Transaction"] = relationship()
