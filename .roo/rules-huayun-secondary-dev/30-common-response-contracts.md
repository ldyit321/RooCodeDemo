# CrownCAD Common Response Contracts

Derived from the latest OpenAPI snapshot fetched on 2026-04-17 from:

- `http://10.0.100.54:9000/crowncad-api/openapi/api-docs`

## Common Wrapper Shape

The latest OpenAPI consistently uses a `CommonResult*` wrapper:

- `code`: integer / int64-style status code
- `message`: string status or error message
- `data`: business payload

## Wrapper Families Confirmed In Current OpenAPI

### Scalar Wrappers

- `CommonResultBoolean`
    - `data`: boolean
- `CommonResultString`
    - `data`: string
- `CommonResultInteger`
    - `data`: integer

### Collection Wrappers

- `CommonResultListString`
    - `data`: `string[]`
- `CommonResultListBodyVO`
    - `data`: `BodyVO[]`
- `CommonResultListFaceVO`
    - `data`: `FaceVO[]`
- `CommonResultListEdgeVO`
    - `data`: `EdgeVO[]`
- `CommonResultListLoopVO`
    - `data`: `LoopVO[]`
- `CommonResultListVertexVO`
    - `data`: `VertexVO[]`
- `CommonResultListExternalReferenceVO`
    - `data`: `ExternalReferenceVO[]`
- `CommonResultListPmiVO`
    - `data`: `PmiVO[]`
- `CommonResultListMateVO`
    - `data`: `MateVO[]`
- `CommonResultListElementVO`
    - `data`: `ElementVO[]`

### Object / Tree / Paged Wrappers

- `CommonResultDocument`
    - `data`: `Document`
- `CommonResultCreateDocumentVO`
    - `data`: `CreateDocumentVO`
- `CommonResultMapStringDocumentVo`
    - `data`: `Map<string, DocumentVo>`
- `CommonResultFolderVO`
    - `data`: `FolderVO`
- `CommonResultShareLinkVO`
    - `data`: `ShareLinkVO`
- `CommonResultPageDataFolderVO`
    - `data`: `PageDataFolderVO`
- `CommonResultTableVO`
    - `data`: `TableVO`
- `CommonResultVersionAttributeManifest`
    - `data`: `VersionAttributeManifest`
- `CommonResultAttributeManifest`
    - `data`: `AttributeManifest`
- `CommonResultBomLevelTable`
    - `data`: `BomLevelTable`
- `CommonResultEdgeVerticesVO`
    - `data`: `EdgeVerticesVO`
- `CommonResultInstanceTreeVO`
    - `data`: `InstanceTreeVO`
- `CommonResultFeatureTreeVO`
    - `data`: `FeatureTreeVO`
- `CommonResultFeatureParamsVO`
    - `data`: `FeatureParamsVO`

## Key Shared Payload Entities

### Document-Family Entities

- `Document`
    - key fields: `id`, `documentType`, `documentName`, `projectId`, `projectName`, `activeVersionId`, `folderCode`, `filePath`, `documentMassAttribute`, `templateId`, `templateDoc`, `ownerName`, `createUserName`, `editorName`
- `DocumentVo`
    - key fields: `id`, `documentType`, `documentName`, `projectId`, `projectName`, `activeVersionId`, `folderCode`, `filePath`, `documentMassAttribute`, `templateId`, `templateDoc`, `ownerName`, `createUserName`, `editorName`, `errorMessage`
- `CreateDocumentVO`
    - key fields: `documentName`, `documentType`, `projectId`, `createTime`

### Folder-Family Entities

- `FolderVO`
    - key fields: `id`, `name`, `parentId`, `createTime`
- `PageDataFolderVO`
    - key fields: `total`, `list`
    - `list`: `FolderVO[]`
- `ShareLinkVO`
    - key fields: `url`, `accessCode`, `expireTime`

### Drawing / Table Entities

- `TableVO`
    - key fields: `tableType`, `headers`, `rows`
- Current drawing view endpoints in the latest OpenAPI mainly return:
    - `string`
    - `string[]`
    - `integer`
    - `TableVO`
    - `boolean`

### BOM Entities

- `VersionAttributeManifest`
    - key fields: `id`, `type`, `manifestItems`, `docId`, `versionId`, `evaluateMass`, `realMass`, `docType`, `blankSize`, `manifestOrder`, `versionName`
- `AttributeManifest`
    - key fields: `id`, `type`, `manifestItems`
- `ManifestItem`
    - key fields: `id`, `name`, `value`, `valueType`, `enumValue`, `fitDocType`
- `BomLevelTable`
    - key fields: `maxLevel`, `keys`, `items`, `preference`, `page`, `pages`, `size`, `total`
- `BomItem`
    - key fields: `id`, `parent`, `mark`, `massValue`, `level`, `documentId`, `documentName`, `instanceName`, `versionId`, `versionName`, `type`, `isLost`, `visible`, `isVirtual`, `pipeInfo`, `other`, `origin`

### Topology / Structure / Query Entities

- `BodyVO`
    - key fields: `id`, `bodyType`, `volume`
- `FaceVO`
    - key fields: `id`, `surfaceType`, `area`
- `EdgeVO`
    - key fields: `id`, `curveType`, `length`
- `LoopVO`
    - key fields: `id`, `isOuter`
- `EdgeVerticesVO`
    - key fields: `startVertex`, `endVertex`
- `Point3D`
    - key fields: `x`, `y`, `z`
- `ExternalReferenceVO`
    - key fields: `documentId`, `elementId`, `versionId`
- `PmiVO`
    - key fields: `id`, `type`, `value`
- `MateVO`
    - key fields: `id`, `name`, `mateType`, `matedEntities`
- `InstanceTreeVO`
    - key fields: `id`, `name`, `referenceElementId`, `transformMatrix`, `children`
- `FeatureTreeVO`
    - key fields: `id`, `name`, `featureType`, `isSuppressed`, `subFeatures`
- `FeatureParamsVO`
    - key fields: `featureId`, `parameters`
- `ElementVO`
    - key fields: `id`, `name`, `elementType`

## Practical Parsing Rules

- Always parse `code / message / data` first; do not assume upstream returns raw business JSON.
- Treat `data` shape as endpoint-specific; do not reuse one `data` parser across unrelated modules.
- Map `CommonResult*` wrappers into stable internal service results in backend Python code before route handlers respond.
- In frontend request helpers, centralize wrapper parsing and normalize `data` before components consume it.
- For list / tree / map payloads, preserve the upstream nesting instead of flattening it too early.
- For paged payloads like `PageDataFolderVO` and `BomLevelTable`, keep paging metadata (`total`, `page`, `pages`, `size`) available to the caller.
- If a task asks for a field that is not present in the current OpenAPI entity definition, report the missing field instead of inventing it.
