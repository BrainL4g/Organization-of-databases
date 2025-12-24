from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.dependencies.auth import get_current_user_id
from backend.app.core.exceptions import NotFoundException
from backend.app.crud.crud_client import client_crud
from backend.app.schemas.client import ClientOut, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("/me", response_model=ClientOut)
async def get_me(
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    client = await client_crud.get(db, id=current_user_id)
    if not client:
        raise NotFoundException("Client not found")
    return client

@router.patch("/me", response_model=ClientOut)
async def update_me(
    client_in: ClientUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    client = await client_crud.get(db, id=current_user_id)
    if not client:
        raise NotFoundException("Client not found")
    return await client_crud.update(db, db_obj=client, obj_in=client_in)