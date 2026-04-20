# CrownCAD Folder Management API

## List Folders

- Method: `GET`
- Path: `/api/folder`
- OperationId: `listFolders`
- Summary: list system folders under the specified parent folder with optional pagination
- Description: use this endpoint to browse standalone system folders, load a root folder list, or paginate nested folders by `parentId`; do not use it for project-internal `FolderDocument` trees
- Response schema:
    - `CommonResultPageDataFolderVO`
    - `data`: `PageDataFolderVO`

### Query Parameters

- `parentId`: string, optional
- `pageNum`: integer, optional
- `pageSize`: integer, optional

## Create Folder

- Method: `POST`
- Path: `/api/folder`
- OperationId: `createFolder`
- Summary: create a standalone system folder under root or under a specified parent folder
- Description: use this endpoint when the requirement is to create a generic system folder resource; the parent-child relationship is controlled by `parentId` in the request body
- Response schema:
    - `CommonResultFolderVO`
    - `data`: `FolderVO`

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
- Summary: create or return a share link configuration for a standalone system folder
- Description: use this endpoint when the requirement is to generate a folder sharing URL, configure password protection, or define share expiration for a system folder
- Response schema:
    - `CommonResultShareLinkVO`
    - `data`: `ShareLinkVO`

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
- Summary: rename a standalone system folder by folder ID
- Description: use this endpoint only for folder rename semantics; the new folder name is passed through the `newName` query parameter and the response `data` is only a success flag
- Response schema:
    - `CommonResultBoolean`
    - `data`: boolean

### Parameters

- Path:
    - `folderId`: string
- Query:
    - `newName`: string, required

## Delete Folder

- Method: `DELETE`
- Path: `/api/folder/{folderId}`
- OperationId: `deleteFolder`
- Summary: delete a standalone system folder by folder ID
- Description: use this endpoint when the requirement is to remove a generic system folder resource; do not reuse it for project document trees or `FolderDocument` deletion
- Response schema:
    - `CommonResultBoolean`
    - `data`: boolean

### Parameters

- Path:
    - `folderId`: string

## Response Entity Notes

### `FolderVO`

- key fields:
    - `id`
    - `name`
    - `parentId`
    - `createTime`

### `PageDataFolderVO`

- key fields:
    - `total`
    - `list`
- `list` item type:
    - `FolderVO`

### `ShareLinkVO`

- key fields:
    - `url`
    - `accessCode`
    - `expireTime`

## Implementation Rules

- The current OpenAPI explicitly provides standard system Folder query, create, share, rename, and delete APIs.
- Do not claim that Folder query, rename, or delete APIs are missing when the task targets standalone system folders.
- Use folder APIs for standalone system `Folder` CRUD instead of overloading document APIs.
- Keep the paged response shape for folder listing; do not flatten away `total` unless the caller intentionally wants only the `list`.
- For folder rename and delete, treat `data` as a boolean success flag instead of inventing a returned `FolderVO`.
- Keep folder listing, creation, rename, share, and deletion as separate request helpers and separate backend service methods.
- Do not infer `parentId`; treat root-level and nested-folder creation as explicit caller choices.
- Expose paging inputs only when the UI actually needs pagination; otherwise wrap pagination defaults in the service layer.
- Do not use system `Folder` APIs for project-internal document folders, document tree folders, or folder-like document resources; those map to the document type `FolderDocument` when supported by document APIs.
- Treat `Folder` and `FolderDocument` as different resource categories with different API contracts.
- If a task needs to convert, sync, or map between system folders and `FolderDocument`, require explicit API evidence before implementing the upstream behavior.
