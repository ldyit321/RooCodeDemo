# HUAYUN API Hard Constraints

This file defines non-negotiable API usage rules for `huayun-secondary-dev`.

## Source Of Truth

- Use only the APIs, paths, fields, and authentication information that have been explicitly provided in the repository rules, docs, or user materials.
- Treat the latest OpenAPI snapshot as the primary source of truth for current CrownCAD-covered capabilities.
- Treat older supplemental materials such as CrownScript as secondary references that require explicit task relevance.
- Enforce this HUAYUN decision order for interpretation:
    1. current mode behavior and Secondary Dev runtime configuration
    2. current workspace HUAYUN rules
    3. relevant module-specific HUAYUN rule file
    4. thin skill and `AGENTS.md` only as supplements
    5. business implementation code only after rule-material conclusions are clear
- Do not let thin skill content override current workspace HUAYUN rules.
- Do not let `AGENTS.md` override current workspace HUAYUN API truth.
- For this project, treat the current workspace HUAYUN rules under `.roo/rules-huayun-secondary-dev` as the primary local rule source.
- Do not prefer user-home rule directories such as `C:\Users\admin\.roo\...` when the current workspace already contains the relevant HUAYUN mode and rules.
- Use user-home or global rule directories only as a fallback when the current workspace does not contain the needed HUAYUN rule material.
- Treat `.roo/...` paths as internal implementation details unless the user explicitly asks for them.
- In normal user-facing answers, refer to `current project rule materials` or `current project configuration` instead of assuming the user knows internal rule directory names.
- When the user asks whether rule materials define an API, contract, field, enum, or capability, treat the task as rule-material lookup by default, not as business implementation-code lookup.
- For rule-material lookup tasks, answer the rule-material conclusion first, and only then optionally state whether business code has already implemented it.
- If concluding that rule materials do not define an interface or contract, provide the lookup basis instead of inferring from missing implementation code.
- When the task asks whether an API, request contract, field, enum, or capability exists, inspect HUAYUN rule materials first, especially `.roo/rules-huayun-secondary-dev`, before concluding from business implementation code.
- Distinguish `present in rules/materials` from `already implemented in business code`.
- For API lookup tasks, stop at the earliest authoritative rule layer that answers the question; do not continue searching business code just to overturn a clear rule conclusion.
- Do not report `missing API material` or `not found` merely because `src`, `webview-ui`, backend, or other implementation directories do not yet contain a concrete wrapper, request client, or usage site.
- When multiple HTTP methods share the same path, do not determine API semantics from URL alone.
- For same-path multi-method interfaces, determine semantics by `Method + Path` together.
- Do not collapse `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` on the same path into one generic endpoint meaning.
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

## Route Enforcement

- For HUAYUN tasks, treat prompt-time rule interpretation and code-time implementation lookup as separate steps.
- First determine the requested capability from mode + runtime settings + current workspace rules.
- Then map the capability to the most specific known `Method + Path`.
- Only after the rule-material mapping is clear may business implementation code be used to choose where to place wrappers, routes, services, or UI.
- Do not reverse this order.
- Do not use absence of local wrappers, services, or proxy files as evidence that a rule-defined upstream API is missing.
- Once the current task is conclusively answered by the earliest authoritative rule layer, stop expanding rule lookup.
- Do not continue broad searches across unrelated modules after a clear rule-material conclusion has already been reached.
- If thin skill guidance is broader than a module rule file, follow the module rule file.
- If `AGENTS.md` guidance is broader than HUAYUN rules, follow HUAYUN rules for API truth and use `AGENTS.md` only for repository workflow constraints.

## Frontend And Proxy Accuracy Constraints

- For frontend-backend integration, do not stop at matching a nominal endpoint path; also confirm the request method, request parameter position, route prefix, and runtime base URL source.
- Do not treat an API as correctly wired merely because the frontend code contains a similar-looking path string.
- Do not infer frontend proxy targets, backend local ports, or backend route prefixes from habit or generic framework defaults when current project configuration or runtime settings provide a more authoritative source.
- Do not hardcode or guess frontend proxy destinations when the task depends on current runtime configuration, `secondaryDevBaseUrl`, frontend env files, dev-server proxy settings, or other project-local configuration.
- When generating frontend request code, preserve the exact upstream `Method + Path` semantics after proxy translation; do not silently change method, prefix, or parameter location during frontend abstraction.
- When generating backend proxy routes or adapter routes, ensure the exposed frontend-facing path and the upstream target path remain intentionally mapped; do not allow duplicate prefixes, dropped prefixes, or accidental path rewrites.
- If the task depends on a frontend request reaching a backend route, accuracy of the request target is a required part of completion, not an optional extra check.

## Execution Scope Constraints

- Keep each HUAYUN task scoped to the user’s current objective; do not automatically attach nearby enhancements, side quests, or cleanup work unless required.
- Prefer minimum sufficient API lookup, minimum sufficient code change, and minimum sufficient validation for the current request.
- For large requests, prefer staged implementation over a single oversized execution path when staging materially reduces risk, latency, or stream instability.
- Do not spend long analysis budgets restating already-known HUAYUN background when the current project rules already establish it.
- Default to concise conclusions and concrete next actions instead of long exploratory narration.

## Current Known API Scope

- OAuth2 authorization:
    - `/oauth/crownapi/authorize`
    - `/oauth/token`
- Document management:
    - `GET /api/document/`
    - `POST /api/document/`
    - `GET /api/document/{documentId}`
    - `GET /api/document/project/{projectId}`
    - `POST /api/document/rename`
    - `DELETE /api/document/document`
- Folder management:
    - `GET /api/folder`
    - `POST /api/folder`
    - `POST /api/folder/{folderId}/share`
    - `PATCH /api/folder/{folderId}/name`
    - `DELETE /api/folder/{folderId}`
- Drawing:
    - `/api/drawing/...`
- BOM:
    - `GET /api/bom/documentAttributeManifest`
    - `PUT /api/bom/documentAttributeManifest`
    - `POST /api/bom/documentAttributeManifest`
    - `DELETE /api/bom/documentAttributeManifest`
    - `GET /api/bom/levelTable`
    - Treat document custom attribute list/query/insert/update/delete as BOM behavior in the current API scope, not as generic document-management behavior
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

- `GET /api/document/` is a batch document query endpoint and must not be rewritten into a generic search endpoint.
- `POST /api/document/` must use the documented required query parameters.
- `GET /api/document/{documentId}` must preserve the `documentId` path parameter.
- Any requirement that semantically means "query document by document ID" or "get document detail" must first match `GET /api/document/{documentId}` before declaring the capability missing.
- `GET /api/document/project/{projectId}` must preserve the `projectId` path parameter.
- Any requirement that semantically means "query documents by project ID" must first match `GET /api/document/project/{projectId}` before declaring the capability missing.
- If the user explicitly provides a 项目id / `projectId`, that value must bind directly to `projectId`.
- If the user explicitly provides a 文档id / `documentId`, that value must bind directly to `documentId`.
- Do not swap, infer, or silently remap an explicitly provided `projectId` and `documentId`.
- `POST /api/document/rename` must use `documentId` and `documentName`.
- Any requirement that semantically means "rename document" must first match `POST /api/document/rename` before declaring the capability missing.
- Do not output any missing-API judgment for the following already-provided document capabilities:
    - `GET /api/document/{documentId}`
    - `GET /api/document/project/{projectId}`
    - `POST /api/document/rename`
- Do not substitute these capabilities with fabricated alternatives such as generic document search, project list lookup, or folder rename APIs.
- Do not return placeholder `501`, `not implemented`, `missing upstream API`, or equivalent blocked-capability responses for:
    - document detail by `documentId`
    - project-scoped document listing by `projectId`
    - document rename by `documentId`
- For document management, the following keyword groups are fixed semantic mappings and must override generic inference:
    - `project documents`, `documents under project`, `query documents by projectId`, `list project documents`, `load project document list`, `get all documents under a project` -> `GET /api/document/project/{projectId}`
    - `document detail`, `get document by id`, `query document by documentId`, `view document detail`, `load document detail`, `single document detail` -> `GET /api/document/{documentId}`
    - `rename document`, `update document name`, `modify document name`, `change document name` -> `POST /api/document/rename`
    - `create document`, `new document`, `create part`, `create assembly`, `create drawing`, `create folder document` -> `POST /api/document/`
    - `batch query documents`, `get documents by ids`, `lookup documents by ids` -> `GET /api/document/`
    - `delete document`, `remove document`, `delete document resource` -> `DELETE /api/document/document`
- Do not remap project-scoped document listing semantics to `GET /api/document/`.
- Do not remap project-scoped document listing semantics to any folder-list endpoint.
- Do not remap single-document detail semantics to `GET /api/document/project/{projectId}`.
- Do not remap single-document detail semantics to batch query by IDs unless the task is explicitly batch-oriented.
- Do not remap document rename semantics to folder rename APIs or document creation APIs.
- Do not treat the existence of document creation via `POST /api/document/` as evidence that document detail, project document listing, or document rename are missing.
- Do not treat missing implementation code as evidence that the upstream contract for document detail, project document listing, or document rename is missing.
- `DELETE /api/document/document` must use `documentName`.
- `GET /api/bom/documentAttributeManifest`, `PUT /api/bom/documentAttributeManifest`, `POST /api/bom/documentAttributeManifest`, and `DELETE /api/bom/documentAttributeManifest` are known provided BOM APIs and must not be reported as missing.
- Any requirement that semantically means "query document attribute list" or "load document attribute manifest" must first match `GET /api/bom/documentAttributeManifest`.
- Any requirement that semantically means "insert document attribute" must first match `POST /api/bom/documentAttributeManifest`.
- Any requirement that semantically means "modify document attribute", "edit attribute", or "row-level button writes attribute" must first match `PUT /api/bom/documentAttributeManifest` when updating an existing attribute.
- Any requirement that semantically means "delete document attribute" must first match `DELETE /api/bom/documentAttributeManifest`.
- `GET /api/bom/documentAttributeManifest` is only for querying all custom attributes of the specified document by `documentId`; do not use it as a create, update, or delete endpoint.
- `PUT /api/bom/documentAttributeManifest` is only for modifying an existing custom attribute; do not use it for pure list query or insertion.
- `POST /api/bom/documentAttributeManifest` is only for inserting a new custom attribute; do not use it for pure list query.
- `DELETE /api/bom/documentAttributeManifest` is only for deleting one custom attribute by `documentId` + `attributeName`.
- For `documentAttributeManifest`, the following keyword groups are fixed semantic mappings and must override generic inference:
    - `属性列表`, `文档属性列表`, `查询属性`, `查询文档属性`, `获取属性列表`, `获取文档属性`, `加载属性列表`, `加载属性清单` -> `GET /api/bom/documentAttributeManifest`
    - `新增属性`, `添加属性`, `新建属性`, `新增一条属性`, `增加文档属性` -> `POST /api/bom/documentAttributeManifest`
    - `修改属性`, `编辑属性`, `更新属性`, `写入属性`, `保存属性修改`, `行级按钮写入属性` -> `PUT /api/bom/documentAttributeManifest`
    - `删除属性`, `移除属性`, `删除一条属性`, `移除一条属性` -> `DELETE /api/bom/documentAttributeManifest`
- Do not remap the `documentAttributeManifest` query/list keyword group to `POST`, `PUT`, or `DELETE`.
- Do not remap the `documentAttributeManifest` create keyword group to `GET`.
- Do not remap the `documentAttributeManifest` update keyword group to `GET`, and do not downgrade it to `POST` when the task is explicitly about updating an existing attribute.
- Do not remap the `documentAttributeManifest` delete keyword group to any non-`DELETE` method.
- `GET /api/bom/documentAttributeManifest` must preserve query parameter `documentId`.
- `PUT /api/bom/documentAttributeManifest` and `POST /api/bom/documentAttributeManifest` must preserve query parameters `documentId`, `attributeName`, `attributeType`, and `variable`.
- `DELETE /api/bom/documentAttributeManifest` must preserve query parameters `documentId` and `attributeName`.
- Do not invent request bodies for `documentAttributeManifest`; current known contract is query-parameter-based.
- Current known `attributeType` enum values for `documentAttributeManifest` are `文本`, `数值`, `是否`, and `日期`.
- Do not invent a separate `attributeValue` request field for `documentAttributeManifest`; current known contract uses `variable` as the documented expression/value carrier.
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
- Current known `docType` values include `PartDocument`, `AssemblyDocument`, `DrawingDocument`, and `FolderDocument`.
- If CrownScript is used, it must be generated as `multipart/form-data`, not JSON, and include the `code` form field.

## Missing Capability Rule

- If a feature asks for project list, model list, user profile, or any other capability not present in current source material, do not invent the missing interface.
- Instead:
    - say that the API is not currently provided
    - implement only the code that can be safely scaffolded
    - mark the missing interface as a dependency for later completion
