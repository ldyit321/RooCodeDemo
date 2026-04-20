# CrownCAD API Overview

These API notes are part of the `huayun-secondary-dev` mode context.

## Runtime Decision Route

For HUAYUN secondary development tasks, follow this route in order:

1. current mode behavior and Secondary Dev runtime configuration
2. current workspace HUAYUN rules under `.roo/rules-huayun-secondary-dev/`
3. the relevant module rule file for the requested capability
4. thin skill and `AGENTS.md` only as supplemental navigation or repository guidance
5. business implementation code only after rule-material conclusions are already clear

Do not skip directly from user wording to business-code lookup when the task is really asking about API existence, contract meaning, enum values, or capability coverage.

## API Lookup Priority

- For API existence, request contract, field, enum, and capability questions, inspect rule materials before implementation code.
- Prefer the most specific module rule file over general inference.
- If overview and module rules agree, treat that result as authoritative.
- If overview is broad but a module file is more specific, follow the module file.
- Thin skill content must not become a second API truth source.
- `AGENTS.md` may refine repository workflow, but it must not replace HUAYUN API truth stored in current workspace rules.

## Latest Source Snapshot

- Latest OpenAPI document provided by the user:
    - `http://10.0.100.54:9000/crowncad-api/openapi/api-docs`
- Latest API explorer provided by the user:
    - `http://10.0.100.54:9000/crowncad-api/explorer`
- Current response wrapper reference:
    - `30-common-response-contracts.md`
- Current response entity catalog:
    - `31-response-entity-catalog.md`

## Current Known Server Base

- The latest OpenAPI snapshot declares the default upstream server as:
    - `http://10.0.100.54:9000`
- The docs themselves are served under the gateway path:
    - `/crowncad-api/openapi/api-docs`
    - `/crowncad-api/explorer`
- When generating proxy or client code, prefer the OpenAPI-declared server base unless deployment docs in the repo override it.

## Current Known API Modules

- Authentication and security
- Document management
- Folder management
- Drawing workflows
- BOM
- Topology queries
- Model structure and data extraction
- Query endpoints

## Current Known Paths

### Authentication

- `/oauth/crownapi/authorize`
- `/oauth/token`

### Document Management

- `GET /api/document/`
- `POST /api/document/`
- `GET /api/document/{documentId}`
- `GET /api/document/project/{projectId}`
- `POST /api/document/rename`
- `DELETE /api/document/document`

### Folder Management

- `GET /api/folder`
- `POST /api/folder`
- `POST /api/folder/{folderId}/share`
- `PATCH /api/folder/{folderId}/name`
- `DELETE /api/folder/{folderId}`

These standard system Folder APIs are officially present in the current OpenAPI snapshot. Do not treat Folder query, create, share, rename, or delete as missing capabilities.

### Drawing

- `POST /api/drawing/{documentId}`
- `PUT /api/drawing/{documentId}/template`
- `GET /api/drawing/{documentId}/views`
- `POST /api/drawing/{documentId}/views/standard`
- `POST /api/drawing/{documentId}/views/section`
- `POST /api/drawing/{documentId}/views/projected`
- `DELETE /api/drawing/{documentId}/views/{viewId}`
- `GET /api/drawing/{documentId}/views/{viewId}/parent-index`
- `POST /api/drawing/{documentId}/tables/weldment-cut-list`
- `POST /api/drawing/{documentId}/tables/bom`
- `POST /api/drawing/{documentId}/export`

### BOM

- `GET /api/bom/documentAttributeManifest`
- `PUT /api/bom/documentAttributeManifest`
- `POST /api/bom/documentAttributeManifest`
- `DELETE /api/bom/documentAttributeManifest`
- `GET /api/bom/levelTable`

Known `documentAttributeManifest` contract:

- `GET /api/bom/documentAttributeManifest` requires query `documentId`
- `PUT /api/bom/documentAttributeManifest` requires query `documentId`, `attributeName`, `attributeType`, `variable`
- `POST /api/bom/documentAttributeManifest` requires query `documentId`, `attributeName`, `attributeType`, `variable`
- `DELETE /api/bom/documentAttributeManifest` requires query `documentId`, `attributeName`
- `attributeType` is currently constrained to `文本`, `数值`, `是否`, `日期`
- Current provided material does not define a request body for these manifest endpoints; do not invent one
- `GET` is for querying all custom attributes of a document by `documentId`
- `PUT` is for modifying an existing custom attribute
- `POST` is for inserting a new custom attribute
- `DELETE` is for deleting one custom attribute by `documentId` + `attributeName`
- Current provided material does not define a separate `attributeValue` request field for this API group; use the documented `variable` parameter only

### Topology

- `GET /api/topo/{documentId}/bodies`
- `GET /api/topo/{documentId}/bodies/{bodyId}/faces`
- `GET /api/topo/{documentId}/bodies/{bodyId}/edges`
- `GET /api/topo/{documentId}/faces/{faceId}/loops`
- `GET /api/topo/{documentId}/faces/{faceId}/edges/unordered`
- `GET /api/topo/{documentId}/loops/{loopId}/edges/ordered`
- `GET /api/topo/{documentId}/edges/{edgeId}/vertices`
- `GET /api/topo/{documentId}/edges/{edgeId}/adjacent-faces`

### Structure And Extraction

- `GET /api/structure/{documentId}/external-references`
- `GET /api/structure/{documentId}/elements/{elementId}/pmi`
- `GET /api/structure/{documentId}/elements/{elementId}/mates`
- `GET /api/structure/{documentId}/elements/{elementId}/instances`
- `GET /api/structure/{documentId}/elements/{elementId}/features`

### Query

- `GET /api/query/features/parameters`
- `GET /api/query/elements`

## Supplemental Legacy Material

- `POST /api/crownscript` is not present in the latest OpenAPI snapshot.
- Treat CrownScript as a supplemental legacy or separately documented interface only when the task explicitly depends on the previously provided CrownScript material.
- Do not treat CrownScript as part of the latest OpenAPI-covered scope unless the user provides a newer CrownScript spec.

## Engineering Rules

- Treat the latest OpenAPI snapshot as the primary source of truth for interface names, methods, and parameter shapes.
- For response wrapper shape, response entity names, and payload field planning, consult `30-common-response-contracts.md` and `31-response-entity-catalog.md` before inventing ad hoc DTOs.
- Reuse these endpoint names exactly when generating frontend request wrappers or backend Python proxy code.
- Prefer module-specific rules for document, folder, drawing, BOM, topology, structure, and query work.
- Do not invent new CrownCAD API paths when the requested feature can be built on top of the known interfaces.
- If a requested feature requires missing APIs, say that explicitly and isolate the missing dependency from the code that can already be implemented.
