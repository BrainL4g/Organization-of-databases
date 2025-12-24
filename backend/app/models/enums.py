from enum import StrEnum, auto

class ContractStatus(StrEnum):
    DRAFT = auto()
    PENDING_SIGNATURE = auto()
    ACTIVE = auto()
    CLOSED = auto()
    TERMINATED = auto()

class DepositStatus(StrEnum):
    ACTIVE = auto()
    CLOSED = auto()
    EXPIRED = auto()

class OperationType(StrEnum):
    DEBIT = auto()
    CREDIT = auto()

class TransactionStatusEnum(StrEnum):
    PENDING = auto()
    COMPLETED = auto()
    FAILED = auto()
    REVERSED = auto()