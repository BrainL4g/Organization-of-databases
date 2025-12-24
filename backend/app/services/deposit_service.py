from decimal import Decimal
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.deposit import Deposit, InterestPayment
from app.models.enums import DepositStatus
from app.models.transaction import Transaction, LedgerEntry
from app.models.enums import OperationType, TransactionStatusEnum

from app.services.account_service import account_service


class DepositService:
    async def calculate_interest(
            self,
            principal: Decimal,
            rate: Decimal,
            months: int
    ) -> Decimal:
        return principal * (rate / Decimal("100")) * (Decimal(months) / Decimal("12"))

    async def accrue_interest(
            self,
            db: AsyncSession,
            *,
            deposit: Deposit,
            payment_date: date,
            payment_period: str
    ) -> InterestPayment:
        interest_amount = self.calculate_interest(
            principal=deposit.principal_amount,
            rate=deposit.interest_rate,
            months=1
        )

        interest_payment = InterestPayment(
            deposit=deposit,
            interest_amount=interest_amount,
            payment_period=payment_period,
            payment_date=payment_date
        )
        db.add(interest_payment)
        await db.flush()

        await account_service.deposit(db, account=deposit.account, amount=interest_amount)

        transaction = Transaction(
            sender_account_id=None,
            receiver_account_id=deposit.account.id_account,
            amount=interest_amount,
            description=f"Начисление процентов по депозиту {deposit.id_deposit}",
            currency_code=deposit.account.currency_code,
            status_code=TransactionStatusEnum.COMPLETED
        )
        db.add(transaction)
        await db.flush()

        ledger_entry = LedgerEntry(
            transaction=transaction,
            account=deposit.account,
            amount=interest_amount,
            operation_type=OperationType.CREDIT,
            balance_after=deposit.account.balance
        )
        db.add(ledger_entry)

        interest_payment.id_transaction = transaction.id_transaction

        await db.commit()
        await db.refresh(deposit)
        return interest_payment

    async def close_deposit(self, db: AsyncSession, *, deposit: Deposit) -> Deposit:
        if deposit.status != DepositStatus.ACTIVE:
            raise ValueError("Депозит уже закрыт или не активен")

        today = date.today()
        await self.accrue_interest(
            db,
            deposit=deposit,
            payment_date=today,
            payment_period="final"
        )

        deposit.status = DepositStatus.CLOSED
        deposit.end_date = today

        db.add(deposit)
        await db.commit()
        await db.refresh(deposit)

        return deposit


deposit_service = DepositService()
