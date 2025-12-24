from decimal import Decimal

from sqlalchemy import Integer, Numeric, Date, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from app.models.base import Base
from app.models.enums import ContractStatus


class Contract(Base):
    __tablename__ = "contract"

    id_contract: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_client: Mapped[int] = mapped_column(Integer, ForeignKey("client.id_client"), nullable=False, index=True)
    id_product: Mapped[int] = mapped_column(Integer, ForeignKey("product.id_product"), nullable=False)
    id_account: Mapped[int] = mapped_column(Integer, ForeignKey("account.id_account"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Date | None] = mapped_column(Date)
    status: Mapped[ContractStatus] = mapped_column(
        String(50),
        nullable=False,
        default=ContractStatus.DRAFT
    )
    signed_by_client: Mapped[bool] = mapped_column(Boolean, default=False)
    signed_by_bank: Mapped[bool] = mapped_column(Boolean, default=False)

    client: Mapped["Client"] = relationship(back_populates="contracts")
    product: Mapped["Product"] = relationship(back_populates="contracts")
    account: Mapped["Account"] = relationship()
    deposits: Mapped[list["Deposit"]] = relationship(back_populates="contract", cascade="all, delete-orphan")
