"""Модели пользователей и клиентов банка."""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from passlib.context import CryptContext
from app.models.base import Base, TimestampMixin, IntIdMixin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class BankClient(Base, IntIdMixin, TimestampMixin):
    """Модель клиента банка."""
    __tablename__ = "bank_clients"

    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    contacts: Mapped[List["UserContact"]] = relationship(
        "UserContact",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    accounts: Mapped[List["Account"]] = relationship(
        "Account",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    contracts: Mapped[List["Contract"]] = relationship(
        "Contract",
        back_populates="client",
        lazy="selectin",
    )
    initiated_transactions: Mapped[List["Transaction"]] = relationship(
        "Transaction",
        foreign_keys="Transaction.initiator_client_id",
        back_populates="initiator_client",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<BankClient(id={self.id}, username='{self.username}')>"


class SystemUser(Base, IntIdMixin, TimestampMixin):
    """Модель пользователя системы (сотрудника банка)."""
    __tablename__ = "system_users"

    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # admin, operator
    full_name: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="user",
        lazy="selectin",
    )

    def set_password(self, password: str) -> None:
        """Устанавливает хэшированный пароль."""
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        """Проверяет пароль."""
        return pwd_context.verify(password, self.hashed_password)

    def __repr__(self) -> str:
        return f"<SystemUser(id={self.id}, username='{self.username}', role='{self.role}')>"


class UserContact(Base, IntIdMixin, TimestampMixin):
    """Модель контактных данных клиентов."""
    __tablename__ = "user_contacts"
    __table_args__ = (UniqueConstraint("client_id", "contact_type", "contact_value"),)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("bank_clients.id", ondelete="CASCADE"),
        nullable=False,
    )
    contact_type: Mapped[str] = mapped_column(String(20), nullable=False)  # phone, email, address
    contact_value: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    client: Mapped["BankClient"] = relationship("BankClient", back_populates="contacts")

    def __repr__(self) -> str:
        return f"<UserContact(id={self.id}, type='{self.contact_type}', value='{self.contact_value}')>"