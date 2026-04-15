# CrownCAD Folder Management API

## List Folders

- Method: `GET`
- Path: `/api/folder`
- OperationId: `listFolders`

### Query Parameters

- `parentId`: string, optional
- `pageNum`: integer, optional
- `pageSize`: integer, optional

## Create Folder

- Method: `POST`
- Path: `/api/folder`
- OperationId: `createFolder`

### Request Body

- Content type: `application/json`
- Schema: `FolderCreateDTO`

### Known Fields

- Required:
    - `name`: string
- Optional:
    - `parentId`: string

## Share Folder

- Method: `POST`
- Path: `/api/folder/{folderId}/share`
- OperationId: `shareFolder`

### Parameters

- Path:
    - `folderId`: string

### Request Body

- Content type: `application/json`
- Schema: `ShareConfigDTO`

### Known Fields

- `expireDays`: integer
- `needPassword`: boolean

## Rename Folder

- Method: `PATCH`
- Path: `/api/folder/{folderId}/name`
- OperationId: `renameFolder`

### Parameters

- Path:
    - `folderId`: string
- Query:
    - `newName`: string, required

## Delete Folder

- Method: `DELETE`
- Path: `/api/folder/{folderId}`
- OperationId: `deleteFolder`

### Parameters

- Path:
    - `folderId`: string

## Implementation Rules

- The current OpenAPI explicitly provides standard system Folder query, create, share, rename, and delete APIs.
- Do not claim that Folder query, rename, or delete APIs are missing when the task targets standalone system folders.
- Use folder APIs for standalone system `Folder` CRUD instead of overloading document APIs.
- Keep folder listing, creation, rename, share, and deletion as separate request helpers and separate backend service methods.
- Do not infer `parentId`; treat root-level and nested-folder creation as explicit caller choices.
- Expose paging inputs only when the UI actually needs pagination; otherwise wrap pagination defaults in the service layer.
- Do not use system `Folder` APIs for project-internal document folders, document tree folders, or folder-like document resources; those map to the document type `FolderDocument` when supported by document APIs.
- Treat `Folder` and `FolderDocument` as different resource categories with different API contracts.
- If a task needs to convert, sync, or map between system folders and `FolderDocument`, require explicit API evidence before implementing the upstream behavior.
