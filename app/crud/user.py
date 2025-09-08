"""CRUD операции для пользователей и клиентов банка."""
from typing import Any, Dict, List, Optional, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from sqlalchemy.orm import selectinload
from app.crud.base import CRUDBase
from app.models.user import BankClient, SystemUser, UserContact
from app.schemas.user import (
    BankClientCreate, BankClientUpdate,
    SystemUserCreate, SystemUserUpdate,
    UserContactCreate, UserContactUpdate
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CRUDBankClient(CRUDBase[BankClient, BankClientCreate, BankClientUpdate]):
    """CRUD для клиентов банка."""

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[BankClient]:
        """Получить клиента по username."""
        return await self.get_by_field(db, "username", username)

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[BankClient]:
        """Получить клиента по email."""
        return await self.get_by_field(db, "email", email)

    async def create(self, db: AsyncSession, *, obj_in: BankClientCreate) -> BankClient:
        """Создать клиента с контактами."""
        # Создаем клиента без контактов
        client_data = obj_in.model_dump(exclude={'contacts'})
        db_obj = BankClient(**client_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)

        # Создаем контакты
        for contact_in in obj_in.contacts:
            contact_data = contact_in.model_dump()
            contact_data['client_id'] = db_obj.id
            contact_obj = UserContact(**contact_data)
            db.add(contact_obj)

        await db.commit()
        await db.refresh(db_obj)
        # Обновляем отношения для возврата
        result = await db.execute(
            select(BankClient)
            .where(BankClient.id == db_obj.id)
            .options(selectinload(BankClient.contacts))
        )
        return result.scalar_one_or_none()


class CRUDSystemUser(CRUDBase[SystemUser, SystemUserCreate, SystemUserUpdate]):
    """CRUD для пользователей системы."""

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[SystemUser]:
        """Получить пользователя системы по username."""
        return await self.get_by_field(db, "username", username)

    async def create(self, db: AsyncSession, *, obj_in: SystemUserCreate) -> SystemUser:
        """Создать пользователя системы с хэшированным паролем."""
        obj_in_data = obj_in.model_dump()
        password = obj_in_data.pop("password")
        obj_in_data["hashed_password"] = pwd_context.hash(password)
        db_obj = SystemUser(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: SystemUser,
            obj_in: Union[SystemUserUpdate, Dict[str, Any]]
    ) -> SystemUser:
        """Обновить пользователя системы с возможным хэшированием пароля."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        if update_data.get("password"):
            password = update_data.pop("password")
            update_data["hashed_password"] = pwd_context.hash(password)

        return await super().update(db, db_obj=db_obj, obj_in=update_data)

    async def authenticate(
            self, db: AsyncSession, *, username: str, password: str
    ) -> Optional[SystemUser]:
        """Аутентификация пользователя."""
        user = await self.get_by_username(db, username=username)
        if not user:
            return None
        if not pwd_context.verify(password, user.hashed_password):
            return None
        return user


class CRUDUserContact(CRUDBase[UserContact, UserContactCreate, UserContactUpdate]):
    """CRUD для контактных данных клиентов."""

    async def get_by_client_and_type(
            self, db: AsyncSession, *, client_id: int, contact_type: str
    ) -> List[UserContact]:
        """Получить контакты клиента по типу."""
        result = await db.execute(
            select(UserContact).where(
                and_(
                    UserContact.client_id == client_id,
                    UserContact.contact_type == contact_type
                )
            )
        )
        return list(result.scalars().all())

    async def get_client_contacts(
            self, db: AsyncSession, *, client_id: int
    ) -> List[UserContact]:
        """Получить все контакты клиента."""
        return await self.get_multi_by_field(db, "client_id", client_id)


# Создаем экземпляры CRUD
bank_client = CRUDBankClient(BankClient)
system_user = CRUDSystemUser(SystemUser)
user_contact = CRUDUserContact(UserContact)