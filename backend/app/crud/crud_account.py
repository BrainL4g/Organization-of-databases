from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Sequence

from app.crud.base import CRUDBase
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


class CRUDAccount(CRUDBase[Account, AccountCreate, AccountUpdate]):
    async def get_by_client(
            self,
            db: AsyncSession,
            *,
            client_id: int,
            skip: int = 0,
            limit: int = 100
    ) -> Sequence[Account]:
        result = await db.execute(
            select(Account)
            .where(Account.id_client == client_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


account_crud = CRUDAccount(Account)
