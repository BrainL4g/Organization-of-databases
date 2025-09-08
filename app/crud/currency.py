"""CRUD операции для валют и курсов."""
from datetime import date
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.currency import Currency, ExchangeRate
from app.schemas.currency import (
    CurrencyCreate, CurrencyUpdate,
    ExchangeRateCreate, ExchangeRateUpdate
)


class CRUDCurrency(CRUDBase[Currency, CurrencyCreate, CurrencyUpdate]):
    """CRUD для валют."""

    async def get(self, db: AsyncSession, id: str) -> Optional[Currency]:
        """Получить валюту по коду."""
        result = await db.execute(select(Currency).where(Currency.currency_code == id))
        return result.scalar_one_or_none()

    async def remove(self, db: AsyncSession, *, id: str) -> bool:
        """Удалить валюту по коду."""
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
            return True
        return False


class CRUDExchangeRate(CRUDBase[ExchangeRate, ExchangeRateCreate, ExchangeRateUpdate]):
    """CRUD для валютных курсов."""

    async def get_rate(
            self, db: AsyncSession, *, from_currency: str, to_currency: str, date: date
    ) -> Optional[ExchangeRate]:
        """Получить курс валют на дату."""
        result = await db.execute(
            select(ExchangeRate).where(
                ExchangeRate.from_currency_code == from_currency,
                ExchangeRate.to_currency_code == to_currency,
                ExchangeRate.date == date
            )
        )
        return result.scalar_one_or_none()

    async def get_rates_for_date(
            self, db: AsyncSession, *, date: date
    ) -> List[ExchangeRate]:
        """Получить все курсы на дату."""
        result = await db.execute(
            select(ExchangeRate).where(ExchangeRate.date == date)
        )
        return list(result.scalars().all())


# Создаем экземпляры CRUD
currency = CRUDCurrency(Currency)
exchange_rate = CRUDExchangeRate(ExchangeRate)