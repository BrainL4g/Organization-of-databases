from backend.app.api.health import router as health_router
from backend.app.api.auth import router as auth_router
from backend.app.api.clients import router as clients_router
from backend.app.api.accounts import router as accounts_router
from backend.app.api.products import router as products_router
from backend.app.api.contracts import router as contracts_router
from backend.app.api.deposits import router as deposits_router
from backend.app.api.transactions import router as transactions_router
from backend.app.api.currency_rates import router as currency_rates_router

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