from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from backend.app.crud.base import CRUDBase
from backend.app.models.currency import CurrencyRate
from backend.app.schemas.currency import CurrencyRateCreate, CurrencyRateUpdate


class CRUDCurrencyRate(CRUDBase[CurrencyRate, CurrencyRateCreate, CurrencyRateUpdate]):
    async def get_latest_rate(
            self,
            db: AsyncSession,
            *,
            from_code: str,
            to_code: str
    ) -> Optional[CurrencyRate]:
        result = await db.execute(
            select(CurrencyRate)
            .where(
                and_(
                    CurrencyRate.from_currency_code == from_code,
                    CurrencyRate.to_currency_code == to_code
                )
            )
            .order_by(desc(CurrencyRate.valid_date))
            .limit(1)
        )
        return result.scalar_one_or_none()


currency_rate_crud = CRUDCurrencyRate(CurrencyRate)
