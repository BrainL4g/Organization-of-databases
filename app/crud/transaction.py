"""CRUD операции для транзакций и проводок."""
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, desc
from app.crud.base import CRUDBase
from app.models.transaction import Transaction, LedgerEntry, TransactionType, TransactionStatus
from app.schemas.transaction import (
    TransactionCreate, TransactionUpdate,
    LedgerEntryCreate, LedgerEntryUpdate,
    TransactionTypeCreate, TransactionTypeUpdate,
    TransactionStatusCreate, TransactionStatusUpdate
)


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    """CRUD для транзакций."""

    async def get_client_transactions(
            self, db: AsyncSession, *, client_id: int, skip: int = 0, limit: int = 100
    ) -> List[Transaction]:
        """Получить транзакции клиента."""
        result = await db.execute(
            select(Transaction)
            .where(Transaction.initiator_client_id == client_id)
            .order_by(desc(Transaction.created_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_status(
            self, db: AsyncSession, *, status_code: str, skip: int = 0, limit: int = 100
    ) -> List[Transaction]:
        """Получить транзакции по статусу."""
        result = await db.execute(
            select(Transaction)
            .where(Transaction.status_code == status_code)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())


class CRUDLedgerEntry(CRUDBase[LedgerEntry, LedgerEntryCreate, LedgerEntryUpdate]):
    """CRUD для проводок."""

    async def get_account_entries(
            self, db: AsyncSession, *, account_id: int, skip: int = 0, limit: int = 100
    ) -> List[LedgerEntry]:
        """Получить проводки по счету."""
        result = await db.execute(
            select(LedgerEntry)
            .where(LedgerEntry.account_id == account_id)
            .order_by(desc(LedgerEntry.created_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_transaction_entries(
            self, db: AsyncSession, *, transaction_id: UUID
    ) -> List[LedgerEntry]:
        """Получить проводки по транзакции."""
        result = await db.execute(
            select(LedgerEntry)
            .where(LedgerEntry.transaction_id == transaction_id)
        )
        return list(result.scalars().all())


class CRUDTransactionType(CRUDBase[TransactionType, TransactionTypeCreate, TransactionTypeUpdate]):
    """CRUD для типов транзакций."""

    async def get(self, db: AsyncSession, id: int) -> Optional[TransactionType]:
        """Получить тип транзакции по ID."""
        result = await db.execute(select(TransactionType).where(TransactionType.id == id))
        return result.scalar_one_or_none()

    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[TransactionType]:
        """Получить тип транзакции по имени."""
        return await self.get_by_field(db, "name", name)


class CRUDTransactionStatus(CRUDBase[TransactionStatus, TransactionStatusCreate, TransactionStatusUpdate]):
    """CRUD для статусов транзакций."""

    async def get(self, db: AsyncSession, id: str) -> Optional[TransactionStatus]:
        """Получить статус транзакции по коду."""
        result = await db.execute(select(TransactionStatus).where(TransactionStatus.code == id))
        return result.scalar_one_or_none()


# Создаем экземпляры CRUD
transaction = CRUDTransaction(Transaction)
ledger_entry = CRUDLedgerEntry(LedgerEntry)
transaction_type = CRUDTransactionType(TransactionType)
transaction_status = CRUDTransactionStatus(TransactionStatus)