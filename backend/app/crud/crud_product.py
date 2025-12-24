from backend.app.crud.base import CRUDBase
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductUpdate

product_crud = CRUDBase[Product, ProductCreate, ProductUpdate](Product)
