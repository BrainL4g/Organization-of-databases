from decimal import Decimal
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.dependencies.auth import get_current_user_id
from backend.app.core.exceptions import NotFoundException
from backend.app.crud.crud_account import account_crud
from backend.app.schemas.account import AccountOut, AccountCreate, AccountUpdate
from backend.app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("/", response_model=PaginatedResponse[AccountOut])
async def get_my_accounts(
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    accounts = await account_crud.get_by_client(db, client_id=current_user_id, skip=skip, limit=size)
    total_accounts = await account_crud.get_by_client(db, client_id=current_user_id)
    total = len(total_accounts)
    pages = (total + size - 1) // size
    return PaginatedResponse(items=accounts, total=total, page=page, size=size, pages=pages)

@router.post("/", response_model=AccountOut, status_code=status.HTTP_201_CREATED)
async def create_account(
    account_in: AccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    data = account_in.model_dump()
    data["id_client"] = current_user_id
    return await account_crud.create(db, obj_in=data)

@router.get("/{account_id}", response_model=AccountOut)
async def get_account(
    account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    account = await account_crud.get(db, id=account_id)
    if not account or account.id_client != current_user_id:
        raise NotFoundException("Account not found")
    return account

@router.patch("/{account_id}", response_model=AccountOut)
async def update_account(
    account_id: int,
    account_in: AccountUpdate,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    account = await account_crud.get(db, id=account_id)
    if not account or account.id_client != current_user_id:
        raise NotFoundException("Account not found")
    return await account_crud.update(db, db_obj=account, obj_in=account_in)