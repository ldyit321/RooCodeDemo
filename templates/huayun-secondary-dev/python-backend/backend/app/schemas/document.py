from pydantic import BaseModel


class DocumentCreateRequest(BaseModel):
    projectId: str
    docName: str
    docType: str
    folderPath: str
