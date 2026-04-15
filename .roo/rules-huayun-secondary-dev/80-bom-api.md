# CrownCAD BOM API

## Document Attribute Manifest

### Known Endpoints

- `GET /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - summary: `获取文档属性列表，用于根据文档的ID查询文档的所有自定义属性列表。`
    - operationId: `getDocumentAttribute`
    - required query:
        - `documentId`: string
    - response schema:
        - `CommonResultVersionAttributeManifest`
- `PUT /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - summary: `修改文档的属性，用于根据文档ID结合属性名，属性值，属性类型，属性表达式进行修改。`
    - operationId: `modifyDocumentAttributeManifest`
    - required query:
        - `documentId`: string
        - `attributeName`: string
        - `attributeType`: string, enum `文本 | 数值 | 是否 | 日期`
        - `variable`: string
    - response schema:
        - `CommonResultAttributeManifest`
- `POST /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - summary: `新增文档属性，根据文档ID结合属性名，属性值，属性类型，属性表达式进行新增。`
    - operationId: `insertDocumentAttributeManifest`
    - required query:
        - `documentId`: string
        - `attributeName`: string
        - `attributeType`: string, enum `文本 | 数值 | 是否 | 日期`
        - `variable`: string
    - response schema:
        - `CommonResultAttributeManifest`
- `DELETE /api/bom/documentAttributeManifest`
    - tag: `BOM`
    - summary: `删除文档中的一条属性，根据文档ID结合属性名进行删除。`
    - operationId: `deleteDocumentAttributeManifest`
    - required query:
        - `documentId`: string
        - `attributeName`: string
    - response schema:
        - `CommonResultAttributeManifest`

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
- If business wording mentions `属性值`, map that requirement to the documented `variable` parameter for this API group instead of fabricating a new parameter.

### Semantic Mapping Rules

- Query/list semantics:
    - keywords: `属性列表`, `文档属性列表`, `查询属性`, `查询文档属性`, `获取属性列表`, `获取文档属性`, `加载属性列表`, `加载属性清单`
    - fixed mapping: `GET /api/bom/documentAttributeManifest`
    - required query: `documentId`
    - forbidden confusion:
        - do not map these query/list semantics to `POST`, `PUT`, or `DELETE`
        - do not require `attributeName`, `attributeType`, or `variable` for pure list query
- Insert/create semantics:
    - keywords: `新增属性`, `添加属性`, `新建属性`, `新增一条属性`, `增加文档属性`
    - fixed mapping: `POST /api/bom/documentAttributeManifest`
    - required query: `documentId`, `attributeName`, `attributeType`, `variable`
    - forbidden confusion:
        - do not map create semantics to `GET`
- Update/edit semantics:
    - keywords: `修改属性`, `编辑属性`, `更新属性`, `写入属性`, `保存属性修改`, `行级按钮写入属性`
    - fixed mapping: `PUT /api/bom/documentAttributeManifest`
    - required query: `documentId`, `attributeName`, `attributeType`, `variable`
    - forbidden confusion:
        - do not map update semantics to `GET`
        - do not downgrade explicit existing-attribute update semantics to `POST`
- Delete/remove semantics:
    - keywords: `删除属性`, `移除属性`, `删除一条属性`, `移除一条属性`
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

### Level Table Rules

- Treat BOM level table querying as a separate responsibility from document attribute manifest mutation.
- If the UI only needs table display, do not couple it to manifest mutation flows.
- Preserve the upstream pagination contract when it is explicitly documented; do not infer level table paging fields from `documentAttributeManifest`.

## Implementation Rules

- For backend Python code, isolate BOM query and mutation forwarding in a dedicated BOM client or service instead of mixing it into generic document clients.
- Keep manifest list/query logic separate from row mutation handlers.
- If a future task asks for fields or bodies that are not documented here, report the missing contract instead of guessing.
