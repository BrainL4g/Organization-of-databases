from typing import Annotated

from fastapi import Depends, HTTPException, status

from backend.app.core.security import get_current_user_id, oauth2_scheme


async def get_current_user_id(token: Annotated[str, Depends(oauth2_scheme)]) -> int:
    return get_current_user_id(token)
