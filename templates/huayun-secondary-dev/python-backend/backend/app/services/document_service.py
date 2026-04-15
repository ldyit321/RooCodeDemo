from app.clients.crowncad_client import CrownCADClient
from app.schemas.document import DocumentCreateRequest


class DocumentService:
    def __init__(self, client: CrownCADClient):
        self._client = client

    async def list_documents(self, keyword: str | None, status: str | None):
        return await self._client.get_documents(keyword=keyword, status=status)

    async def create_document(self, payload: DocumentCreateRequest):
        return await self._client.create_document(payload.model_dump())


def get_document_service() -> DocumentService:
    return DocumentService(client=CrownCADClient())
