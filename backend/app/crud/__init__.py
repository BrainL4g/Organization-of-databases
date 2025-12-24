from backend.app.crud.base import CRUDBase
from backend.app.crud.crud_client import client_crud
from backend.app.crud.crud_account import account_crud
from backend.app.crud.crud_product import product_crud
from backend.app.crud.crud_contract import contract_crud
from backend.app.crud.crud_deposit import deposit_crud
from backend.app.crud.crud_transaction import transaction_crud
from backend.app.crud.crud_currency_rate import currency_rate_crud

__all__ = [
    "CRUDBase",
    "client_crud",
    "account_crud",
    "product_crud",
    "contract_crud",
    "deposit_crud",
    "transaction_crud",
    "currency_rate_crud",
]
