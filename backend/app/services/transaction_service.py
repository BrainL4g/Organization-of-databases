from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, LedgerEntry
from app.models.enums import OperationType
from app.services.account_service import account_service


class TransactionService:
    async def transfer(
            self,
            db: AsyncSession,
            *,
            sender_account,
            receiver_account,
            amount: Decimal,
            description: str | None = None
    ) -> Transaction:
        # Проверка и списание
        await account_service.withdraw(db, account=sender_account, amount=amount)
        # Зачисление
        await account_service.deposit(db, account=receiver_account, amount=amount)

        # Создание транзакции и проводок (упрощённо)
        transaction = Transaction(
            sender_account_id=sender_account.id_account,
            receiver_account_id=receiver_account.id_account,
            amount=amount,
            description=description,
            currency_code=sender_account.currency_code
        )
        db.add(transaction)
        await db.flush()

        # Проводки
        db.add(LedgerEntry(
            transaction=transaction,
            account=sender_account,
            amount=amount,
            operation_type=OperationType.DEBIT,
            balance_after=sender_account.balance
        ))
        db.add(LedgerEntry(
            transaction=transaction,
            account=receiver_account,
            amount=amount,
            operation_type=OperationType.CREDIT,
            balance_after=receiver_account.balance
        ))

        await db.commit()
        return transaction


transaction_service = TransactionService()
