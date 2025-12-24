from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.clients import router as clients_router
from app.api.accounts import router as accounts_router
from app.api.products import router as products_router
from app.api.contracts import router as contracts_router
from app.api.deposits import router as deposits_router
from app.api.transactions import router as transactions_router
from app.api.currency_rates import router as currency_rates_router

__all__ = [
    "health_router",
    "auth_router",
    "clients_router",
    "accounts_router",
    "products_router",
    "contracts_router",
    "deposits_router",
    "transactions_router",
    "currency_rates_router",
]