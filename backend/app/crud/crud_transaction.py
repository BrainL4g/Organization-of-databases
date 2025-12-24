from backend.app.crud.base import CRUDBase
from backend.app.models.transaction import Transaction
from backend.app.schemas.transaction import TransactionCreate, TransactionUpdate

transaction_crud = CRUDBase[Transaction, TransactionCreate, TransactionUpdate](Transaction)
