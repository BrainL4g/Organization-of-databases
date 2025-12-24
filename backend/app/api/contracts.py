from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.dependencies.auth import get_current_user_id
from backend.app.core.exceptions import NotFoundException
from backend.app.crud.crud_contract import contract_crud
from backend.app.schemas.contract import ContractOut, ContractCreate
from backend.app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/contracts", tags=["contracts"])

@router.get("/", response_model=PaginatedResponse[ContractOut])
async def get_my_contracts(
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    contracts = await contract_crud.get_multi(db, skip=skip, limit=size)
    total = len(await contract_crud.get_multi(db))
    pages = (total + size - 1) // size
    return PaginatedResponse(items=contracts, total=total, page=page, size=size, pages=pages)

@router.post("/", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
async def create_contract(
    contract_in: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    data = contract_in.model_dump()
    data["id_client"] = current_user_id
    return await contract_crud.create(db, obj_in=data)

@router.get("/{contract_id}", response_model=ContractOut)
async def get_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    contract = await contract_crud.get(db, id=contract_id)
    if not contract or contract.id_client != current_user_id:
        raise NotFoundException("Contract not found")
    return contract