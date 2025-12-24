from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.crud.base import CRUDBase
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate


class CRUDClient(CRUDBase[Client, ClientCreate, ClientUpdate]):
    async def get_by_login(self, db: AsyncSession, *, login: str) -> Optional[Client]:
        result = await db.execute(select(Client).where(Client.login == login))
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[Client]:
        result = await db.execute(select(Client).where(Client.email == email))
        return result.scalar_one_or_none()


client_crud = CRUDClient(Client)
