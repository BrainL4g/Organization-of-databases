from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash, verify_password, create_access_token
from app.crud.crud_client import client_crud
from app.schemas.token import Token


class AuthService:
    async def register(self, db: AsyncSession, *, login: str, email: str, full_name: str, password: str):
        client = await client_crud.get_by_login(db, login=login)
        if client:
            raise ValueError("Login already registered")
        client = await client_crud.get_by_email(db, email=email)
        if client:
            raise ValueError("Email already registered")
        hashed_password = get_password_hash(password)
        return await client_crud.create(
            db,
            obj_in={
                "login": login,
                "email": email,
                "full_name": full_name,
                "password_hash": hashed_password
            }
        )

    async def authenticate(self, db: AsyncSession, *, login: str, password: str) -> Token:
        client = await client_crud.get_by_login(db, login=login)
        if not client or not verify_password(password, client.password_hash):
            raise ValueError("Incorrect login or password")
        access_token = create_access_token(
            data={"sub": str(client.id_client)},
            expires_delta=timedelta(minutes=1440)
        )
        return Token(access_token=access_token, token_type="bearer")


auth_service = AuthService()
