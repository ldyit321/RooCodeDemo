# CrownCAD BOM API

Derived from the latest OpenAPI snapshot fetched on 2026-04-17.

## Document Attribute Manifest

### Known Endpoints

- `GET /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - operationId: `getDocumentAttributeManifest`
    - summary: `[BOM] 查询文档自定义属性列表`
    - description: 根据文档 ID 获取该文档关联的所有自定义属性配置
    - required query:
        - `documentId`: string
    - response schema:
        - `CommonResultVersionAttributeManifest`
        - `data`: `VersionAttributeManifest`
- `PUT /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - operationId: `modifyDocumentAttributeManifest`
    - summary: `[BOM] 更新文档自定义属性`
    - description: 根据文档 ID 和属性名称修改指定的自定义属性配置。
    - required query:
        - `documentId`: string
        - `attributeName`: string
        - `attributeType`: string, enum `文本 | 数值 | 是否 | 日期`
        - `variable`: string
    - response schema:
        - `CommonResultAttributeManifest`
        - `data`: `AttributeManifest`
- `POST /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - operationId: `insertDocumentAttributeManifest`
    - summary: `[BOM] 创建文档自定义属性定义`
    - description: 新增一条文档的自定义属性配置
    - required query:
        - `documentId`: string
        - `attributeName`: string
        - `attributeType`: string, enum `文本 | 数值 | 是否 | 日期`
        - `variable`: string
    - response schema:
        - `CommonResultAttributeManifest`
        - `data`: `AttributeManifest`
- `DELETE /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - operationId: `deleteDocumentAttributeManifest`
    - summary: `[BOM] 删除文档自定义属性`
    - description: 根据文档 ID 和属性名称删除指定的自定义属性配置
    - required query:
        - `documentId`: string
        - `attributeName`: string
    - response schema:
        - `CommonResultAttributeManifest`
        - `data`: `AttributeManifest`

### Response Entity Notes

#### `VersionAttributeManifest`

- key fields:
    - `id`
    - `type`
    - `manifestItems`
    - `docId`
    - `versionId`
    - `evaluateMass`
    - `realMass`
    - `docType`
    - `blankSize`
    - `manifestOrder`
    - `versionName`

#### `AttributeManifest`

- key fields:
    - `id`
    - `type`
    - `manifestItems`

#### `ManifestItem`

- key fields:
    - `id`
    - `name`
    - `value`
    - `valueType`
    - `enumValue`
    - `fitDocType`

### Behavior Rules

- Treat `/api/bom/documentAttributeManifest` as a fully known interface set; do not report it as missing.
- This interface group is for document custom attributes only. Do not mix it with BOM level table querying or generic document metadata querying.
- Determine semantics by `Method + Path` together, not by URL alone.
- `GET /api/bom/documentAttributeManifest` is only for querying all custom attributes of the specified document.
- `PUT /api/bom/documentAttributeManifest` is only for modifying an existing document custom attribute.
- `POST /api/bom/documentAttributeManifest` is only for inserting a new document custom attribute.
- `DELETE /api/bom/documentAttributeManifest` is only for deleting one document custom attribute.

### Request Contract Rules

- Use query parameters exactly as documented above; do not move these fields into a request body.
- Do not invent JSON body fields for `GET`, `PUT`, `POST`, or `DELETE` on `documentAttributeManifest`.
- Keep `attributeType` constrained to the documented enum values `文本`, `数值`, `是否`, and `日期`.
- Preserve `documentId` as the document identifier for all document attribute manifest operations.
- Preserve `attributeName` as the custom attribute name for modify, insert, and delete flows.
- Preserve `variable` as the only documented expression/value carrier for insert and modify flows.
- Do not invent a separate `attributeValue` request field for this API group unless newer source material explicitly adds it.

### Semantic Mapping Rules

- Query/list semantics:
    - keywords: `查询文档属性`, `查询自定义属性`, `获取属性列表`, `加载属性列表`, `查看文档属性`
    - fixed mapping: `GET /api/bom/documentAttributeManifest`
    - required query: `documentId`
    - forbidden confusion:
        - do not map these query/list semantics to `POST`, `PUT`, or `DELETE`
        - do not require `attributeName`, `attributeType`, or `variable` for pure list query
- Insert/create semantics:
    - keywords: `新增属性`, `创建属性`, `添加自定义属性`
    - fixed mapping: `POST /api/bom/documentAttributeManifest`
    - required query: `documentId`, `attributeName`, `attributeType`, `variable`
    - forbidden confusion:
        - do not map create semantics to `GET`
- Update/edit semantics:
    - keywords: `修改属性`, `更新属性`, `编辑属性`, `修改BOM文档属性`
    - fixed mapping: `PUT /api/bom/documentAttributeManifest`
    - required query: `documentId`, `attributeName`, `attributeType`, `variable`
    - forbidden confusion:
        - do not map update semantics to `GET`
        - do not downgrade explicit existing-attribute update semantics to `POST`
- Delete/remove semantics:
    - keywords: `删除属性`, `移除属性`
    - fixed mapping: `DELETE /api/bom/documentAttributeManifest`
    - required query: `documentId`, `attributeName`
    - forbidden confusion:
        - do not map delete semantics to `GET`, `POST`, or `PUT`

### UI And Integration Rules

- If the UI has row-level action buttons:
    - list/load should call `GET`
    - create row should call `POST`
    - edit existing row should call `PUT`
    - delete row should call `DELETE`
- If the user explicitly provides `documentId`, bind it directly to the query parameter `documentId`.
- Do not infer hidden request bodies, extra filters, or extra mutation parameters that are not documented here.

## Level Table

- `GET /api/bom/levelTable`
    - operationId: `getLevelTable`
    - summary: `[BOM] 获取 BOM 级别表数据`
    - description: 根据项目 ID 和文档 ID 获取 BOM 的层级结构数据
    - required query:
        - `projectId`: string
        - `documentId`: string
    - optional query:
        - `currentPage`: integer
    - response schema:
        - `CommonResultBomLevelTable`
        - `data`: `BomLevelTable`

### `BomLevelTable`

- key fields:
    - `maxLevel`
    - `keys`
    - `items`
    - `preference`
    - `page`
    - `pages`
    - `size`
    - `total`

### `BomItem`

- key fields:
    - `id`
    - `parent`
    - `mark`
    - `massValue`
    - `level`
    - `documentId`
    - `documentName`
    - `instanceName`
    - `versionId`
    - `versionName`
    - `type`
    - `isLost`
    - `visible`
    - `isVirtual`
    - `pipeInfo`
    - `other`
    - `origin`

### Level Table Rules

- Treat BOM level table querying as a separate responsibility from document attribute manifest mutation.
- If the UI only needs table display, do not couple it to manifest mutation flows.
- Preserve `projectId` and `documentId` as required query parameters for level table queries; do not silently drop either one.
- Use `currentPage` only as an optional paging input when the caller really needs paged retrieval behavior.
- Preserve the upstream pagination contract on `BomLevelTable`; do not flatten away `page`, `pages`, `size`, or `total` too early.
- Do not infer level table paging fields from `documentAttributeManifest`.

## Implementation Rules

- For backend Python code, isolate BOM query and mutation forwarding in a dedicated BOM client or service instead of mixing it into generic document clients.
- Keep manifest list/query logic separate from row mutation handlers.
- If a future task asks for fields or bodies that are not documented here, report the missing contract instead of guessing.
