from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.dependencies.auth import get_current_user_id
from backend.app.core.exceptions import NotFoundException, BadRequestException
from backend.app.crud.crud_account import account_crud
from backend.app.crud.crud_transaction import transaction_crud
from backend.app.services.transaction_service import transaction_service
from backend.app.schemas.transaction import TransactionOut
from backend.app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=PaginatedResponse[TransactionOut])
async def get_my_transactions(
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    transactions = await transaction_crud.get_multi(db, skip=skip, limit=size)
    total = len(await transaction_crud.get_multi(db))
    pages = (total + size - 1) // size
    return PaginatedResponse(items=transactions, total=total, page=page, size=size, pages=pages)

@router.post("/transfer", response_model=TransactionOut)
async def transfer(
    sender_account_id: int,
    receiver_account_id: int,
    amount: Decimal,
    description: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    sender = await account_crud.get(db, id=sender_account_id)
    if not sender or sender.id_client != current_user_id:
        raise BadRequestException("Invalid sender account")

    receiver = await account_crud.get(db, id=receiver_account_id)
    if not receiver:
        raise BadRequestException("Invalid receiver account")

    return await transaction_service.transfer(
        db=db,
        sender_account=sender,
        receiver_account=receiver,
        amount=amount,
        description=description,
    )