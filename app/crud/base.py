"""Базовый CRUD класс для работы с моделями SQLAlchemy."""
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import BinaryExpression
from pydantic import BaseModel

ModelType = TypeVar("ModelType")  # Тип модели SQLAlchemy
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)  # Схема создания
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)  # Схема обновления


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Базовый класс CRUD операций."""

    def __init__(self, model: Type[ModelType]):
        """
        Инициализация CRUD объекта.

        Args:
            model: Модель SQLAlchemy
        """
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        """Получить объект по ID."""
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_multi(
            self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """Получить список объектов с пагинацией."""
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        """Создать новый объект."""
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data)  # type: ignore
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: ModelType,
            obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """Обновить существующий объект."""
        obj_data = vars(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> bool:
        """Удалить объект по ID."""
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
            return True
        return False

    async def get_by_field(
            self, db: AsyncSession, field: str, value: Any
    ) -> Optional[ModelType]:
        """Получить объект по значению поля."""
        result = await db.execute(
            select(self.model).where(getattr(self.model, field) == value)
        )
        return result.scalar_one_or_none()

    async def get_multi_by_field(
            self, db: AsyncSession, field: str, value: Any, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """Получить список объектов по значению поля."""
        result = await db.execute(
            select(self.model)
            .where(getattr(self.model, field) == value)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())