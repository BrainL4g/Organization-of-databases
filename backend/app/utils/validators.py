from pydantic import field_validator


def validate_iban(v: str) -> str:
    v = v.replace(" ", "").upper()
    if len(v) not in range(15, 35):
        raise ValueError("Invalid IBAN length")
    if not v.isalnum():
        raise ValueError("IBAN must be alphanumeric")
    return v
