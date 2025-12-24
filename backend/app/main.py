from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import (
    health_router,
    auth_router,
    clients_router,
    accounts_router,
    products_router,
    contracts_router,
    deposits_router,
    transactions_router,
    currency_rates_router,
)

app = FastAPI(
    title="Автоматизированная банковская система",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(clients_router, prefix="/clients", tags=["clients"])
app.include_router(accounts_router, prefix="/accounts", tags=["accounts"])
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
app.include_router(deposits_router, prefix="/deposits", tags=["deposits"])
app.include_router(transactions_router, prefix="/transactions", tags=["transactions"])
app.include_router(currency_rates_router, prefix="/currency-rates", tags=["currency"])


@app.get("/")
async def root():
    return {"message": "Bank API is running"}
