from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.crud_currency_rate import currency_rate_crud


class CurrencyService:
    async def get_current_rate(
            self,
            db: AsyncSession,
            *,
            from_code: str,
            to_code: str
    ) -> float | None:
        rate_obj = await currency_rate_crud.get_latest_rate(
            db,
            from_code=from_code,
            to_code=to_code
        )
        if rate_obj and rate_obj.valid_date <= date.today():
            return float(rate_obj.rate)
        return None


currency_service = CurrencyService()
