# CrownCAD Document Management API

## Project Document List

### Known Endpoints

- `GET /api/document/project/{projectId}`
    - operationId: `projectDocuments`
    - summary: list all document resources under the specified project by `projectId`
    - description: use this endpoint to load the document collection of a project, populate project-scoped document trees or lists, and resolve all document resources that belong to one project context
    - required path:
        - `projectId`: string
    - response schema:
        - `CommonResultMapStringDocumentVo`
        - `data`: `Map<string, DocumentVo>`

### Behavior Rules

- Treat `GET /api/document/project/{projectId}` as the official project-scoped document listing API.
- Treat this capability as already defined and non-missing in the current CrownCAD API material.
- Use this endpoint when the requirement is project-scoped document retrieval.
- Do not replace this capability with generic document search, batch document lookup, or folder listing.

### Request Contract Rules

- Preserve `projectId` as a required path parameter.
- Do not remap an explicitly provided `projectId` to `documentId`.
- Do not invent request bodies, undocumented query filters, or extra path segments for this endpoint.

### Semantic Mapping Rules

- Project/list semantics:
    - keywords: `project documents`, `documents under project`, `query documents by projectId`, `list project documents`, `load project document list`, `get all documents under a project`
    - fixed mapping: `GET /api/document/project/{projectId}`
    - required path: `projectId`
    - forbidden confusion:
        - do not map these semantics to `GET /api/document/`
        - do not map these semantics to folder listing APIs
        - do not report these semantics as missing

## Document Detail

### Known Endpoints

- `GET /api/document/{documentId}`
    - operationId: `getDocumentById`
    - summary: get a document resource and its detail by `documentId`
    - description: use this endpoint to retrieve one explicit document record, its metadata, ownership fields, project linkage, and other single-document detail information
    - required path:
        - `documentId`: string
    - response schema:
        - `CommonResultDocument`
        - `data`: `Document`

### Behavior Rules

- Treat `GET /api/document/{documentId}` as the official single-document detail API.
- Treat this capability as already defined and non-missing in the current CrownCAD API material.
- Use this endpoint only when the requirement is detail retrieval for one explicit document.
- Do not replace this capability with project-level document listing or batch document lookup unless the task is explicitly batch-oriented.

### Request Contract Rules

- Preserve `documentId` as a required path parameter.
- Do not remap an explicitly provided `documentId` to `projectId`.
- Do not invent request bodies, undocumented query fields, or extra selectors for this endpoint.

### Semantic Mapping Rules

- Detail semantics:
    - keywords: `document detail`, `get document by id`, `query document by documentId`, `view document detail`, `load document detail`, `single document detail`
    - fixed mapping: `GET /api/document/{documentId}`
    - required path: `documentId`
    - forbidden confusion:
        - do not map these semantics to `GET /api/document/project/{projectId}`
        - do not map these semantics to `GET /api/document/` unless the task is explicitly batch-oriented
        - do not report these semantics as missing

## Document Rename

### Known Endpoints

- `POST /api/document/rename`
    - operationId: `renameDocument`
    - summary: rename a document resource by `documentId` and `documentName`
    - description: use this endpoint when the requirement is to change the display name or stored name of one existing document without altering its project binding or document type
    - required query:
        - `documentId`: string
        - `documentName`: string
    - response schema:
        - `CommonResultDocument`
        - `data`: `Document`

### Behavior Rules

- Treat `POST /api/document/rename` as the official document rename API.
- Treat this capability as already defined and non-missing in the current CrownCAD API material.
- Use this endpoint only for document rename semantics.
- Do not reuse folder rename APIs for document rename.

### Request Contract Rules

- Preserve `documentId` and `documentName` as required query parameters.
- Bind an explicitly provided document ID directly to `documentId`.
- Treat the new document name as `documentName`.
- Do not invent a request body or substitute a folder rename contract.

### Semantic Mapping Rules

- Rename semantics:
    - keywords: `rename document`, `update document name`, `modify document name`, `change document name`
    - fixed mapping: `POST /api/document/rename`
    - required query: `documentId`, `documentName`
    - forbidden confusion:
        - do not map these semantics to folder rename APIs
        - do not map these semantics to `POST /api/document/`
        - do not report these semantics as missing

## Document Creation

### Known Endpoints

- `POST /api/document/`
    - operationId: `createDocument`
    - summary: create document
    - description: use this endpoint to create a new project-scoped document resource such as part, assembly, drawing, or folder-document, optionally under a specific folder path or template
    - required query:
        - `projectId`: string
        - `docName`: string
        - `docType`: string
    - optional query:
        - `folderPath`: string
        - `templateName`: string
    - response schema:
        - `CommonResultCreateDocumentVO`
        - `data`: `CreateDocumentVO`

### Behavior Rules

- Treat `POST /api/document/` as the official document creation API.
- Use this endpoint for document creation only.
- Do not use document creation as evidence that document detail, project document listing, or document rename are missing.

### Request Contract Rules

- Preserve `projectId`, `docName`, and `docType` as required query parameters.
- Preserve `folderPath` and `templateName` as optional query parameters only.
- Do not silently infer undocumented `docType` values.

### Semantic Mapping Rules

- Create semantics:
    - keywords: `create document`, `new document`, `create part`, `create assembly`, `create drawing`, `create folder document`
    - fixed mapping: `POST /api/document/`
    - required query: `projectId`, `docName`, `docType`
    - forbidden confusion:
        - do not map these semantics to detail, list, or rename endpoints

## Batch Document Lookup

### Known Endpoints

- `GET /api/document/`
    - operationId: `getDocumentsByIds`
    - summary: batch query documents by explicit document IDs
    - description: use this endpoint for explicit multi-document lookup when the caller already knows one or more document IDs and needs a mapped result set instead of project-wide listing
    - query:
        - `documentIds`: string array, optional
    - response schema:
        - `CommonResultMapStringDocumentVo`
        - `data`: `Map<string, DocumentVo>`

### Behavior Rules

- Treat `GET /api/document/` as a batch document lookup endpoint only.
- Do not treat this endpoint as a generic project document listing API.
- Do not rewrite it into a generic search endpoint.

### Request Contract Rules

- Use `documentIds` for explicit batch lookup.
- Do not reuse this endpoint for project-scoped retrieval.
- Do not invent generic search query fields.

### Semantic Mapping Rules

- Batch semantics:
    - keywords: `batch query documents`, `get documents by ids`, `lookup documents by ids`
    - fixed mapping: `GET /api/document/`
    - query: `documentIds`
    - forbidden confusion:
        - do not use this endpoint for project-level list semantics

## Document Deletion

### Known Endpoints

- `DELETE /api/document/document`
    - operationId: `deleteDocument`
    - summary: delete a document resource by the documented document name contract
    - description: use this endpoint only when the requirement is to remove an existing document resource and the upstream contract is explicitly name-driven rather than ID-driven
    - required query:
        - `documentName`: string
    - current response note:
        - latest fetched OpenAPI path exists
        - current response schema was not explicitly resolved from the fetched content in this update pass
        - do not invent a deletion payload shape without re-checking the latest OpenAPI when deletion response fields matter

## Response Entity Notes

### `Document`

- key fields:
    - `id`
    - `documentType`
    - `documentName`
    - `projectId`
    - `projectName`
    - `activeVersionId`
    - `folderCode`
    - `filePath`
    - `documentMassAttribute`
    - `templateId`
    - `templateDoc`
    - `ownerName`
    - `createUserName`
    - `editorName`

### `DocumentVo`

- key fields:
    - `id`
    - `documentType`
    - `documentName`
    - `projectId`
    - `projectName`
    - `activeVersionId`
    - `folderCode`
    - `filePath`
    - `documentMassAttribute`
    - `templateId`
    - `templateDoc`
    - `ownerName`
    - `createUserName`
    - `editorName`
    - `errorMessage`

### `CreateDocumentVO`

- key fields:
    - `documentName`
    - `documentType`
    - `projectId`
    - `createTime`

### Behavior Rules

- Treat `DELETE /api/document/document` as the documented document deletion API.
- Use this endpoint only when the task is clearly deleting a document resource.

### Request Contract Rules

- Preserve `documentName` as the documented required query parameter.
- Do not invent undocumented delete-by-ID behavior unless newer source material adds it.

### Semantic Mapping Rules

- Delete semantics:
    - keywords: `delete document`, `remove document`, `delete document resource`
    - fixed mapping: `DELETE /api/document/document`
    - required query: `documentName`
    - forbidden confusion:
        - do not map these semantics to folder delete APIs

## Common Document Rules

### Known Non-Missing Capabilities

- Treat the following as already provided and available in the current CrownCAD API material:
    - query project documents by `projectId` via `GET /api/document/project/{projectId}`
    - query document detail by `documentId` via `GET /api/document/{documentId}`
    - rename document by `documentId` via `POST /api/document/rename`
- Do not output blocked-capability statements claiming that the three capabilities above are missing.
- Do not return placeholder `501`, `not implemented`, or equivalent blocked-capability responses for these three capabilities.

### Parameter Binding Rules

- When the user explicitly provides `projectId`, a project ID, or equivalent project identifier in the conversation:
    - bind that value directly to the API parameter `projectId`
- When the user explicitly provides `documentId`, a document ID, or equivalent document identifier in the conversation:
    - bind that value directly to the API parameter `documentId`
- Do not swap, infer, or silently remap an explicitly provided `projectId` and `documentId`.

### Known Document Type Values

- `PartDocument`
- `AssemblyDocument`
- `DrawingDocument`
- `FolderDocument`

Keep `docType` constrained to the known enum values above unless newer source material explicitly expands them.

### Known Document Response Type Values

The latest fetched OpenAPI currently exposes a broader `DocumentVo.documentType` enum family including:

- `Document`
- `PartDocument`
- `AssemblyDocument`
- `ApplicationDocument`
- `DrawingDocument`
- `Drawing3dDocument`
- `FolderDocument`
- `PdfDocument`
- `PictureDocument`
- `VideoDocument`
- `MeshDocument`
- `ToConvertDocument`
- `VirtualSpaceDocument`
- `LightDocument`
- `StructuralProfileDocument`
- `PlantDocument`
- `CompositeDocument`
- `FactoryDocument`
- `UnSupportedDocument`
- `PRDocument`
- `WordDocument`
- `PptDocument`

Do not use the broader response enum as evidence that creation via `POST /api/document/` supports all of those values. For creation, stay constrained to the documented creation enum unless the OpenAPI explicitly expands that request contract.

### Folder Boundary Rules

- Treat `FolderDocument` as a document type, not as the same resource as the system `Folder` returned by folder management APIs.
- Use `FolderDocument` when the requirement says project-internal folder, document folder, document tree folder, or folder-like item that belongs to a project/document hierarchy.
- Use system folder APIs when the user says generic folder list, folder rename, folder share, folder deletion, or standalone folder CRUD without project/document-tree context.
- Do not use folder management APIs to rename or delete a `FolderDocument` unless newer API material explicitly says those resources are mapped.
- Do not use document APIs to implement generic system folder CRUD.
- If the task wording is ambiguous between `Folder` and `FolderDocument`, state the ambiguity and choose the safer interpretation from project/document context instead of silently mixing both resource types.

### Implementation Rules

- Use document management APIs only for document resources and project-internal document tree items.
- When creating backend Python proxies, validate required path and query parameters before forwarding the request.
- When creating frontend request wrappers, keep batch query, detail query, project query, create, rename, and delete operations as separate methods.
- When building UI for document creation, expose `docType` as an explicit choice or derive it from a clearly selected business action; do not silently infer undocumented values.
- If a future task asks for fields, methods, or bodies that are not documented here, report the missing contract instead of guessing.

### Missing Capability Rules

- If the user asks for document move, document copy, document share, document version rollback, or other document behavior not present above, state that the capability is not provided in the current API material.
- If the user asks for project-internal folder creation and only `FolderDocument` creation is available, use `POST /api/document/` with `docType=FolderDocument` only when the surrounding requirement is explicitly document-tree/project-internal rather than standalone folder management.
- If a requested document-folder behavior is not covered by the provided APIs, state the missing capability instead of inventing a new endpoint, request field, or response structure.
