from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.account import Account


class AccountService:
    async def deposit(self, db: AsyncSession, *, account: Account, amount: Decimal):
        account.balance += amount
        db.add(account)
        await db.commit()
        await db.refresh(account)
        return account

    async def withdraw(self, db: AsyncSession, *, account: Account, amount: Decimal):
        if account.balance < amount:
            raise ValueError("Insufficient funds")
        if account.is_blocked:
            raise ValueError("Account is blocked")
        account.balance -= amount
        db.add(account)
        await db.commit()
        await db.refresh(account)
        return account


account_service = AccountService()
