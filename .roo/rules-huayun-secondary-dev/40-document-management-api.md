# CrownCAD Document Management API

## Core Semantic Map

Treat the following document capabilities as already defined, official, and non-missing in the current CrownCAD API material:

- Project-scoped document listing
    - fixed mapping: `GET /api/document/project/{projectId}`
- Single document detail by explicit document ID
    - fixed mapping: `GET /api/document/{documentId}`
- Document rename
    - fixed mapping: `POST /api/document/rename`
- Document creation
    - fixed mapping: `POST /api/document/`
- Batch document lookup by explicit document IDs
    - fixed mapping: `GET /api/document/`
- Document deletion
    - fixed mapping: `DELETE /api/document/document`

Do not report the first three capabilities above as blocked, missing, undefined, or unsupported.

## High-Priority Recognition Rules

- If the requirement semantically means `query documents by project ID`, `list project documents`, `get all documents under a project`, `load a project's document list`, or equivalent project-level document retrieval:

    - must first match `GET /api/document/project/{projectId}`
    - must not be reported as missing

- If the requirement semantically means `query document by document ID`, `get document detail`, `view document detail`, `load document detail`, or equivalent single-document retrieval:

    - must first match `GET /api/document/{documentId}`
    - must not be reported as missing

- If the requirement semantically means `rename document`, `update document name`, `modify document name`, or equivalent document-renaming wording:

    - must first match `POST /api/document/rename`
    - must not be reported as missing

- If the requirement semantically means `create document`, `new document`, `create part`, `create assembly`, `create drawing`, or `create project-internal folder document`:

    - must first match `POST /api/document/`

- If the requirement semantically means `batch query documents by explicit IDs`:

    - must first match `GET /api/document/`

- If the requirement semantically means `delete document resource`:
    - must first match `DELETE /api/document/document`

## Keyword Trigger Map

- Project document list semantics

    - keywords:
        - `project documents`
        - `documents under project`
        - `query documents by projectId`
        - `list project documents`
        - `load project document list`
        - `get all documents under a project`
    - fixed mapping:
        - `GET /api/document/project/{projectId}`
    - required path:
        - `projectId`

- Document detail semantics

    - keywords:
        - `document detail`
        - `get document by id`
        - `query document by documentId`
        - `view document detail`
        - `load document detail`
        - `single document detail`
    - fixed mapping:
        - `GET /api/document/{documentId}`
    - required path:
        - `documentId`

- Document rename semantics

    - keywords:
        - `rename document`
        - `update document name`
        - `modify document name`
        - `change document name`
    - fixed mapping:
        - `POST /api/document/rename`
    - required query:
        - `documentId`
        - `documentName`

- Document create semantics

    - keywords:
        - `create document`
        - `new document`
        - `create part`
        - `create assembly`
        - `create drawing`
        - `create folder document`
    - fixed mapping:
        - `POST /api/document/`
    - required query:
        - `projectId`
        - `docName`
        - `docType`

- Batch document lookup semantics

    - keywords:
        - `batch query documents`
        - `get documents by ids`
        - `lookup documents by ids`
    - fixed mapping:
        - `GET /api/document/`
    - query:
        - `documentIds`

- Document delete semantics
    - keywords:
        - `delete document`
        - `remove document`
        - `delete document resource`
    - fixed mapping:
        - `DELETE /api/document/document`
    - required query:
        - `documentName`

## Current Known Document Endpoints

- `GET /api/document/`

    - operationId: `getDocumentsByIds`
    - summary: batch query documents by explicit document IDs
    - query:
        - `documentIds`: string array, optional

- `POST /api/document/`

    - operationId: `createDocument`
    - summary: create document
    - required query:
        - `projectId`: string
        - `docName`: string
        - `docType`: string
    - optional query:
        - `folderPath`: string
        - `templateName`: string

- `GET /api/document/{documentId}`

    - operationId: `getDocumentById`
    - summary: get a document resource and its detail by `documentId`
    - path:
        - `documentId`: string, required

- `GET /api/document/project/{projectId}`

    - operationId: `projectDocuments`
    - summary: list all document resources under the specified project by `projectId`
    - path:
        - `projectId`: string, required

- `POST /api/document/rename`

    - operationId: `renameDocument`
    - summary: rename a document resource by `documentId` and `documentName`
    - required query:
        - `documentId`: string
        - `documentName`: string

- `DELETE /api/document/document`
    - operationId: `deleteDocument`
    - summary: delete a document resource
    - required query:
        - `documentName`: string

## Parameter Binding Rules

- When the user explicitly provides `projectId`, a project ID, or equivalent project identifier in the conversation:

    - bind that value directly to the API parameter `projectId`

- When the user explicitly provides `documentId`, a document ID, or equivalent document identifier in the conversation:

    - bind that value directly to the API parameter `documentId`

- Do not remap an explicitly provided project ID to `documentId`.
- Do not remap an explicitly provided document ID to `projectId`.

## Minimal Request Contracts

- `GET /api/document/project/{projectId}`

    - path:
        - `projectId`
    - use for:
        - project-scoped document listing only

- `GET /api/document/{documentId}`

    - path:
        - `documentId`
    - use for:
        - single document detail only

- `POST /api/document/rename`

    - query:
        - `documentId`
        - `documentName`
    - use for:
        - rename document only

- `POST /api/document/`

    - query:
        - `projectId`
        - `docName`
        - `docType`
    - optional query:
        - `folderPath`
        - `templateName`
    - use for:
        - create document only

- `GET /api/document/`

    - query:
        - `documentIds`
    - use for:
        - batch lookup by explicit document IDs only

- `DELETE /api/document/document`
    - query:
        - `documentName`
    - use for:
        - delete document resource only

## Known Document Type Values

- `PartDocument`
- `AssemblyDocument`
- `DrawingDocument`
- `FolderDocument`

Keep `docType` constrained to the known enum values above unless newer source material explicitly expands them.

## Implementation Rules

- Use document management APIs only for document resources and project-internal document tree items.
- Use `GET /api/document/project/{projectId}` when the requirement is project-scoped document listing.
- Use `GET /api/document/{documentId}` when the requirement is document detail by explicit document ID.
- Use `GET /api/document/` only for batch lookup by explicit document IDs.
- Use `POST /api/document/rename` for document rename.
- Do not reuse folder rename APIs for document rename.
- Use `DELETE /api/document/document` for document deletion only when the task is clearly deleting a document resource.
- When creating backend Python proxies, validate required path and query parameters before forwarding the request.
- When creating frontend request wrappers, keep batch query, detail query, project query, create, rename, and delete operations as separate methods.
- When building UI for document creation, expose `docType` as an explicit choice or derive it from a clearly selected business action; do not silently infer undocumented values.

## Known Non-Missing Document Capabilities

Treat the following as already provided and available in the current CrownCAD API material:

- query document detail by `documentId` via `GET /api/document/{documentId}`
- query project documents by `projectId` via `GET /api/document/project/{projectId}`
- rename document by `documentId` via `POST /api/document/rename`

Do not:

- output blocked-capability statements claiming that the three capabilities above are missing
- replace these capabilities with fabricated alternatives such as generic search, project list lookup, or folder rename endpoints
- return placeholder `501` responses for these three capabilities on the grounds that the upstream contract is undefined

## Anti-Confusion Rules

- Do not map project-scoped document listing semantics to `GET /api/document/`.
- Do not map project-scoped document listing semantics to folder listing APIs.
- Do not map single-document detail semantics to project-level document listing.
- Do not map single-document detail semantics to batch query by document IDs unless the task is explicitly batch-oriented.
- Do not map document rename semantics to folder rename APIs.
- Do not map document rename semantics to document creation APIs.
- Do not treat document creation as evidence that document detail, project document listing, or document rename are missing.
- Do not treat missing implementation code as evidence that the upstream contract for detail, project listing, or rename is missing.

## Folder Boundary Rules

- Treat `FolderDocument` as a document type, not as the same resource as the system `Folder` returned by folder management APIs.
- Use `FolderDocument` when the requirement says project-internal folder, document folder, document tree folder, or folder-like item that belongs to a project/document hierarchy.
- Use system folder APIs when the user says generic folder list, folder rename, folder share, folder deletion, or standalone folder CRUD without project/document-tree context.
- Do not use folder management APIs to rename or delete a `FolderDocument` unless newer API material explicitly says those resources are mapped.
- Do not use document APIs to implement generic system folder CRUD.
- If the task wording is ambiguous between `Folder` and `FolderDocument`, state the ambiguity and choose the safer interpretation from project/document context instead of silently mixing both resource types.

## Missing Capability Rules

- If the user asks for document move, document copy, document share, document version rollback, or other document behavior not present above, state that the capability is not provided in the current API material.
- If the user asks for project-internal folder creation and only `FolderDocument` creation is available, use `POST /api/document/` with `docType=FolderDocument` only when the surrounding requirement is explicitly document-tree/project-internal rather than standalone folder management.
- If a requested document-folder behavior is not covered by the provided APIs, state the missing capability instead of inventing a new endpoint, request field, or response structure.
