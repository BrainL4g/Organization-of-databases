from sqlalchemy import Integer, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from app.models.base import Base


class Client(Base):
    __tablename__ = "client"

    id_client: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    login: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    contacts: Mapped[List["ClientContact"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    accounts: Mapped[List["Account"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    contracts: Mapped[List["Contract"]] = relationship(back_populates="client", cascade="all, delete-orphan")


class ClientContact(Base):
    __tablename__ = "client_contact"

    id_contact: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_client: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    contact_type: Mapped[str] = mapped_column(String(50), nullable=False)
    contact_value: Mapped[str] = mapped_column(String(100), nullable=False)

    client: Mapped["Client"] = relationship(back_populates="contacts", foreign_keys=[id_client])