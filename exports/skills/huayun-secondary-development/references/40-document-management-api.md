# CrownCAD Document Management API

## Create Document

- Method: `POST`
- Path: `/api/document`
- Tag: `文档管理`
- OperationId: `createDocument`

### Required Query Parameters

- `projectId`: string
- `docName`: string
- `docType`: string
- `folderPath`: string

### Optional Query Parameters

- `axisUp`: integer, default `0`
- `pluginId`: string
- `templateId`: string
- `relatedModelVersionId`: string
- `relatedModelDocId`: string

### Known docType Values

- `PartDocument`
- `AssemblyDocument`
- `DrawingDocument`
- `FolderDocument`

### Response

- Wrapper: `CommonResultCreateDocumentVO`
- Payload: `CreateDocumentVO`

## Delete Document

- Method: `DELETE`
- Path: `/api/document`
- Tag: `文档管理`
- OperationId: `deleteDocument`

### Required Query Parameters

- `documentName`: string

## Implementation Rules

- When creating frontend request wrappers, keep create and delete operations separate.
- When generating backend Python proxies, validate required query parameters before forwarding the request.
- Do not silently infer `docType`; make the caller provide it or choose it explicitly in UI logic.
- When creating document-related UI, expose document type choices using the known enum values above.
- Treat `FolderDocument` as a document type, not as the same resource as the system `Folder` returned by folder management APIs.
- Use `FolderDocument` when the requirement says project-internal folder, document folder, document tree folder, or a folder-like item that belongs to the project/document hierarchy.
- Do not use folder management APIs to create a project-internal document folder unless the API material explicitly says that system `Folder` maps to document tree folders.
- If the user only says generic folder, folder list, folder rename, folder share, or folder deletion without a project/document-tree context, use folder management APIs instead of document creation.
- If the required document-folder behavior is not covered by the provided APIs, state the missing capability instead of inventing a new endpoint or request field.
