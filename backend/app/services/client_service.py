from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.crud_client import client_crud
from app.models.client import Client


class ClientService:
    async def get_client_by_id(self, db: AsyncSession, *, client_id: int) -> Client | None:
        return await client_crud.get(db, id=client_id)

    async def get_client_by_login(self, db: AsyncSession, *, login: str) -> Client | None:
        return await client_crud.get_by_login(db, login=login)

    async def get_client_by_email(self, db: AsyncSession, *, email: str) -> Client | None:
        return await client_crud.get_by_email(db, email=email)

    async def get_client_accounts(self, db: AsyncSession, *, client_id: int):
        from backend.app.crud.crud_account import account_crud
        return await account_crud.get_by_client(db, client_id=client_id)

    async def get_client_contracts(self, db: AsyncSession, *, client_id: int):
        from backend.app.crud.crud_contract import contract_crud
        contracts = await contract_crud.get_multi(db)
        return [c for c in contracts if c.id_client == client_id]

    async def get_client_deposits(self, db: AsyncSession, *, client_id: int):
        from backend.app.crud.crud_deposit import deposit_crud
        deposits = await deposit_crud.get_multi(db)
        return [d for d in deposits if d.contract.id_client == client_id]


client_service = ClientService()