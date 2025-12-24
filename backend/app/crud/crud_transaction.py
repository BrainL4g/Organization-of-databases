from app.crud.base import CRUDBase
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate

transaction_crud = CRUDBase[Transaction, TransactionCreate, TransactionUpdate](Transaction)
