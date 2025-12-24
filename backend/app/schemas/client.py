from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.base import BaseResponse


class ClientContactOut(BaseResponse):
    id_contact: int
    contact_type: str
    contact_value: str


class ClientCreate(BaseModel):
    login: str
    email: EmailStr
    full_name: str
    password: str


class ClientUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None


class ClientOut(BaseResponse):
    id_client: int
    login: str
    email: EmailStr
    full_name: str
    created_at: datetime
    contacts: Optional[List[ClientContactOut]] = None
