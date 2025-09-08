"""Базовые схемы и утилиты для Pydantic."""
from typing import Type, Any, Dict
from pydantic import BaseModel
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated


def as_form(cls: Type[BaseModel]) -> Type[BaseModel]:
    """
    Декоратор для создания схемы, которая может принимать данные из form-data.
    Используется для эндпоинтов, принимающих multipart/form-data.
    """
    from pydantic import create_model
    from pydantic.fields import FieldInfo

    # Создаем новые поля с default_factory для Optional полей
    new_fields: Dict[str, tuple[Any, FieldInfo]] = {}
    for field_name, field_info in cls.model_fields.items():
        new_fields[field_name] = (
            field_info.annotation if not field_info.is_required() else field_info.annotation,
            field_info
        )

    # Создаем новую модель с теми же полями
    FormModel = create_model(
        f"{cls.__name__}Form",
        **new_fields,
        __base__=cls
    )

    # Копируем Config
    if hasattr(cls, 'model_config'):
        FormModel.model_config = cls.model_config

    return FormModel