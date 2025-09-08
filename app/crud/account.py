"""CRUD операции для банковских счетов."""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.crud.base import CRUDBase
from app.models.account import Account, AccountType
from app.schemas.account import AccountCreate, AccountUpdate, AccountTypeCreate, AccountTypeUpdate


class CRUDAccount(CRUDBase[Account, AccountCreate, AccountUpdate]):
    """CRUD для банковских счетов."""

    async def get_by_account_number(
            self, db: AsyncSession, *, account_number: str
    ) -> Optional[Account]:
        """Получить счет по номеру."""
        return await self.get_by_field(db, "account_number", account_number)

    async def get_client_accounts(
            self, db: AsyncSession, *, client_id: int
    ) -> List[Account]:
        """Получить все счета клиента."""
        return await self.get_multi_by_field(db, "client_id", client_id)

    async def create(self, db: AsyncSession, *, obj_in: AccountCreate) -> Account:
        """Создать счет с загруженными отношениями."""
        db_obj = await super().create(db, obj_in=obj_in)
        # Перезагружаем с отношениями
        result = await db.execute(
            select(Account)
            .where(Account.id == db_obj.id)
            .options(
                selectinload(Account.currency),
                selectinload(Account.account_type)
            )
        )
        return result.scalar_one_or_none()


class CRUDAccountType(CRUDBase[AccountType, AccountTypeCreate, AccountTypeUpdate]):
    """CRUD для типов счетов."""

    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[AccountType]:
        """Получить тип счета по имени."""
        return await self.get_by_field(db, "name", name)


# Создаем экземпляры CRUD
account = CRUDAccount(Account)
account_type = CRUDAccountType(AccountType)