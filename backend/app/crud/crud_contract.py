from backend.app.crud.base import CRUDBase
from backend.app.models.contract import Contract
from backend.app.schemas.contract import ContractCreate, ContractUpdate

contract_crud = CRUDBase[Contract, ContractCreate, ContractUpdate](Contract)
