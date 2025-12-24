from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import NotFoundException
from app.crud.crud_currency_rate import currency_rate_crud
from app.services.currency_service import currency_service
from app.schemas.currency import CurrencyRateOut
from app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/currency-rates", tags=["currency"])

@router.get("/", response_model=PaginatedResponse[CurrencyRateOut])
async def get_rates(
    db: AsyncSession = Depends(get_db),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    rates = await currency_rate_crud.get_multi(db, skip=skip, limit=size)
    total = len(await currency_rate_crud.get_multi(db))
    pages = (total + size - 1) // size
    return PaginatedResponse(items=rates, total=total, page=page, size=size, pages=pages)

@router.get("/current/{from_code}/{to_code}")
async def current_rate(
    from_code: str,
    to_code: str,
    db: AsyncSession = Depends(get_db),
):
    rate = await currency_service.get_current_rate(db, from_code=from_code, to_code=to_code)
    if rate is None:
        raise NotFoundException("Current rate not found")
    return {"from": from_code, "to": to_code, "rate": rate}