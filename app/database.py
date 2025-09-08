"""Настройка асинхронного подключения к базе данных."""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.settings import settings

# Создание асинхронного движка SQLAlchemy
engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=False,  # Установить True для отладки SQL запросов
    future=True,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Фабрика асинхронных сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    """Базовый класс для всех моделей SQLAlchemy."""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency для получения сессии БД в эндпоинтах."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
