from fastapi import APIRouter, Depends

from app.schemas.document import DocumentCreateRequest
from app.services.document_service import DocumentService, get_document_service

router = APIRouter(tags=["documents"])


@router.get("/documents")
async def list_documents(
    keyword: str | None = None,
    status: str | None = None,
    service: DocumentService = Depends(get_document_service),
):
    return await service.list_documents(keyword=keyword, status=status)


@router.post("/documents")
async def create_document(
    payload: DocumentCreateRequest,
    service: DocumentService = Depends(get_document_service),
):
    return await service.create_document(payload)
