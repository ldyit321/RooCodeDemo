# HUAYUN API Hard Constraints

This file defines non-negotiable API usage rules for `huayun-secondary-dev`.

## Source Of Truth

- Use only the APIs, paths, fields, and authentication information that have been explicitly provided in the repository rules, docs, or user materials.
- Treat the latest OpenAPI snapshot as the primary source of truth for current CrownCAD-covered capabilities.
- Treat older supplemental materials such as CrownScript as secondary references that require explicit task relevance.
- Do not invent undocumented API endpoints when the requested feature can be implemented with known interfaces.
- If the requested feature depends on missing APIs, say so explicitly and isolate the missing dependency instead of fabricating it.
- If an API path, method, request field, response field, enum value, or workflow step is not present in the current source material, treat it as missing instead of guessing.
- Do not create placeholder upstream endpoints such as `/api/projects`, `/api/users/me`, `/api/files`, `/api/search`, or similar generic paths unless they are explicitly present in the provided API material.

## Missing API Response Contract

- When a required interface is missing, respond with:
    - the missing capability
    - the closest known provided APIs, if any
    - which parts can still be safely scaffolded
    - which code paths are blocked until the real API is provided
- Code may include typed placeholders or TODO boundaries only when they do not pretend to call a real upstream endpoint.
- Do not implement fake request wrappers, fake backend proxy routes, fake response models, or fake mock-to-production paths that look like real CrownCAD APIs.
- If the user asks for a business feature whose core API is missing, build only the UI skeleton, local validation, or integration seam that can be verified without inventing the upstream API.

## Current Known API Scope

- OAuth2 authorization:
    - `/oauth/crownapi/authorize`
    - `/oauth/token`
- Document management:
    - `POST /api/document`
    - `DELETE /api/document`
- Folder management:
    - `GET /api/folder`
    - `POST /api/folder`
    - `POST /api/folder/{folderId}/share`
    - `PATCH /api/folder/{folderId}/name`
    - `DELETE /api/folder/{folderId}`
- Drawing:
    - `/api/drawing/...`
- BOM:
    - `/api/bom/...`
- Topology:
    - `/api/topo/...`
- Structure:
    - `/api/structure/...`
- Query:
    - `/api/query/...`

## Supplemental Scope

- `POST /api/crownscript` exists only in earlier provided materials and is not part of the latest OpenAPI snapshot.
- Use it only when the task explicitly depends on that earlier material or the user confirms the endpoint is still deployed.

## Hard Constraints

- `POST /api/document` must use the documented required query parameters.
- `DELETE /api/document` must use `documentName`.
- Standard system Folder operations are not missing in the current OpenAPI; `GET /api/folder`, `POST /api/folder`, `POST /api/folder/{folderId}/share`, `PATCH /api/folder/{folderId}/name`, and `DELETE /api/folder/{folderId}` are known provided APIs.
- Do not output a blocked-capability statement claiming that standard Folder query, rename, or delete APIs are unavailable.
- Folder operations must use the documented folder endpoints instead of overloading document APIs.
- Distinguish system folders from folder-type documents:
    - Use `Folder` / folder management APIs only when the task is about standalone system folders, generic folder CRUD, folder listing, folder rename, folder share, or folder deletion.
    - Use document management with `docType=FolderDocument` when the task is about a project-internal folder, document tree folder, document folder, or folder-like item inside a project/document context.
    - Do not treat `Folder` and `FolderDocument` as interchangeable resource types.
    - If the wording is ambiguous, state the ambiguity and choose the safer interpretation from the surrounding context instead of silently mixing both APIs.
- Drawing exports must require an explicit `format`.
- Query endpoints must preserve their documented parameter names.
- Known enum values such as `docType` must stay constrained to documented values unless newer source material explicitly expands them.
- If CrownScript is used, it must be generated as `multipart/form-data`, not JSON, and include the `code` form field.

## Missing Capability Rule

- If a feature asks for project list, model list, user profile, or any other capability not present in current source material, do not invent the missing interface.
- Instead:
    - say that the API is not currently provided
    - implement only the code that can be safely scaffolded
    - mark the missing interface as a dependency for later completion
