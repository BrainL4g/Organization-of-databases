"""Схемы для пользователей и клиентов банка."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.schemas.base import as_form


class UserContactBase(BaseModel):
    """Базовая схема контактных данных."""
    contact_type: str = Field(..., max_length=20, description="Тип контакта (phone, email, address)")
    contact_value: str = Field(..., description="Значение контакта")

    @field_validator('contact_type')
    @classmethod
    def validate_contact_type(cls, v: str) -> str:
        allowed_types = {'phone', 'email', 'address'}
        if v not in allowed_types:
            raise ValueError(f'contact_type must be one of {allowed_types}')
        return v


class UserContactCreate(UserContactBase):
    """Схема для создания контактных данных."""
    pass


class UserContactUpdate(UserContactBase):
    """Схема для обновления контактных данных."""
    contact_type: Optional[str] = Field(None, max_length=20)
    contact_value: Optional[str] = None


class UserContactInDBBase(UserContactBase):
    """Базовая схема контактных данных из БД."""
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserContact(UserContactInDBBase):
    """Схема контактных данных для ответа."""
    pass


class BankClientBase(BaseModel):
    """Базовая схема клиента банка."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=255)


class BankClientCreate(BankClientBase):
    """Схема для создания клиента банка."""
    # избегаем mutable default прямо в аннотации
    contacts: Optional[List[UserContactCreate]] = None

    @field_validator('contacts', mode='before')
    @classmethod
    def _set_default_contacts(cls, v):
        # если None или отсутствует — возвращаем пустой список
        return v or []


class BankClientUpdate(BankClientBase):
    """Схема для обновления клиента банка."""
    username: Optional[str] = Field(None, min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=255)


class BankClientInDBBase(BankClientBase):
    """Базовая схема клиента банка из БД."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class BankClient(BankClientInDBBase):
    """Схема клиента банка для ответа."""
    contacts: Optional[List[UserContact]] = None

    @field_validator('contacts', mode='before')
    @classmethod
    def _set_default_contacts(cls, v):
        return v or []


class SystemUserBase(BaseModel):
    """Базовая схема пользователя системы."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    role: str = Field(..., max_length=50)
    full_name: Optional[str] = Field(None, max_length=255)
    is_active: bool = True


class SystemUserCreate(SystemUserBase):
    """Схема для создания пользователя системы."""
    password: str = Field(..., min_length=8)


class SystemUserUpdate(SystemUserBase):
    """Схема для обновления пользователя системы."""
    username: Optional[str] = Field(None, min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    role: Optional[str] = Field(None, max_length=50)
    full_name: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8)


class SystemUserInDBBase(SystemUserBase):
    """Базовая схема пользователя системы из БД."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SystemUser(SystemUserInDBBase):
    """Схема пользователя системы для ответа."""
    pass


class SystemUserLogin(BaseModel):
    """Схема для аутентификации пользователя системы."""
    username: str
    password: str
