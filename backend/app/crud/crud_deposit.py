from backend.app.crud.base import CRUDBase
from backend.app.models.deposit import Deposit
from backend.app.schemas.deposit import DepositCreate, DepositUpdate

deposit_crud = CRUDBase[Deposit, DepositCreate, DepositUpdate](Deposit)
