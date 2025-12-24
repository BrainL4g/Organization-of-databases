from app.crud.base import CRUDBase
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractOut

contract_crud = CRUDBase[Contract, ContractCreate, ContractOut](Contract)
