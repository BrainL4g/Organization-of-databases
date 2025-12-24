from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import NotFoundException
from app.crud.crud_product import product_crud
from app.schemas.product import ProductOut
from app.utils.pagination import PaginatedResponse

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=PaginatedResponse[ProductOut])
async def get_products(
    db: AsyncSession = Depends(get_db),
    page: int = 1,
    size: int = 10,
):
    skip = (page - 1) * size
    products = await product_crud.get_multi(db, skip=skip, limit=size)
    total = len(await product_crud.get_multi(db))
    pages = (total + size - 1) // size
    return PaginatedResponse(items=products, total=total, page=page, size=size, pages=pages)

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    product = await product_crud.get(db, id=product_id)
    if not product:
        raise NotFoundException("Product not found")
    return product