# Organization-of-databases
# Banking API

Высокопроизводительный асинхронный API для управления банковскими операциями, построенный на FastAPI и SQLAlchemy 2.0.

## Особенности
- Полностью асинхронная архитектура (async/await)
- Современный стек: FastAPI, SQLAlchemy 2.0, PostgreSQL (asyncpg)
- Чистая архитектура с разделением на слои (models, schemas, crud, services, api)
- Полное покрытие типами (mypy --strict совместимость)
- Готов к production использованию

## Быстрый старт
1. Установите зависимости: `pip install -r requirements.txt`
2. Создайте .env файл (см. .env.example)
3. Примените миграции: `alembic upgrade head`
4. Запустите сервер: `uvicorn app.main:app --reload`

## Архитектура
- `app/models/` - SQLAlchemy ORM модели
- `app/schemas/` - Pydantic схемы для валидации
- `app/crud/` - Операции с БД (Create, Read, Update, Delete)
- `app/services/` - Бизнес-логика приложения
- `app/api/` - API роутеры FastAPI
- `app/database.py` - Настройка подключения к БД
- `app/settings.py` - Конфигурация приложения

## Тестирование
- Запуск тестов: `pytest`
- Проверка типов: `mypy --strict .`
- Форматирование: `black .` и `isort .`