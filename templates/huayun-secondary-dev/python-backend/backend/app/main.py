from fastapi import FastAPI

from app.routes.documents import router as document_router

app = FastAPI(title="HUAYUN Secondary Dev Backend")
app.include_router(document_router, prefix="/api")
