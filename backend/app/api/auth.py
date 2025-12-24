from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.client import ClientCreate
from app.schemas.token import Token
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    client_in: ClientCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        await auth_service.register(
            db=db,
            login=client_in.login,
            email=client_in.email,
            full_name=client_in.full_name,
            password=client_in.password,
        )
        return {"message": "Registration successful"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=Token)
async def login(
    login: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await auth_service.authenticate(db=db, login=login, password=password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))