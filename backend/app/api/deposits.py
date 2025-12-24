from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.dependencies.auth import get_current_user_id
from backend.app.core.exceptions import NotFoundException, BadRequestException
from backend.app.crud.crud_deposit import deposit_crud
from backend.app.services.deposit_service import deposit_service
from backend.app.schemas.deposit import DepositOut, InterestPaymentOut
from backend.app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/deposits", tags=["deposits"])

@router.get("/", response_model=PaginatedResponse[DepositOut])
async def get_my_deposits(
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    deposits = await deposit_crud.get_multi(db, skip=skip, limit=size)
    total = len(await deposit_crud.get_multi(db))
    pages = (total + size - 1) // size
    return PaginatedResponse(items=deposits, total=total, page=page, size=size, pages=pages)

@router.get("/{deposit_id}", response_model=DepositOut)
async def get_deposit(
    deposit_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    deposit = await deposit_crud.get(db, id=deposit_id)
    if not deposit:
        raise NotFoundException("Deposit not found")
    return deposit

@router.post("/{deposit_id}/accrue-interest", response_model=InterestPaymentOut)
async def accrue_interest(
    deposit_id: int,
    payment_period: str = "monthly",
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    deposit = await deposit_crud.get(db, id=deposit_id)
    if not deposit:
        raise NotFoundException("Deposit not found")
    payment_date = date.today()
    return await deposit_service.accrue_interest(
        db=db,
        deposit=deposit,
        payment_date=payment_date,
        payment_period=payment_period,
    )

@router.post("/{deposit_id}/close", response_model=DepositOut)
async def close_deposit(
    deposit_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    deposit = await deposit_crud.get(db, id=deposit_id)
    if not deposit:
        raise NotFoundException("Deposit not found")
    try:
        return await deposit_service.close_deposit(db=db, deposit=deposit)
    except ValueError as e:
        raise BadRequestException(str(e))