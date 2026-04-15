import pytest

from app.schemas.document import DocumentCreateRequest
from app.services.document_service import DocumentService


class FakeClient:
    async def get_documents(self, **params):
        return [{"docName": "demo", "status": params.get("status", "draft")}]

    async def create_document(self, payload):
        return {"docName": payload["docName"], "status": "created"}


@pytest.mark.asyncio
async def test_document_service_list_documents():
    service = DocumentService(client=FakeClient())
    documents = await service.list_documents(keyword="demo", status="draft")
    assert documents[0]["status"] == "draft"


@pytest.mark.asyncio
async def test_document_service_create_document():
    service = DocumentService(client=FakeClient())
    payload = DocumentCreateRequest(
        projectId="project-1",
        docName="demo",
        docType="part",
        folderPath="/",
    )

    result = await service.create_document(payload)
    assert result["status"] == "created"
