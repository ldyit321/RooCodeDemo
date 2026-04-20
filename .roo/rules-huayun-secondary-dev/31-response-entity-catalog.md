# CrownCAD Response Entity Catalog

This file is a compact entity lookup companion to `30-common-response-contracts.md`.

Use it when a task explicitly needs:

- response entity names
- key payload fields
- backend Pydantic schema planning
- frontend TypeScript interface planning

## Document Management

### `Document`

- `id`: string
- `documentType`: string
- `documentName`: string
- `projectId`: string
- `projectName`: string
- `activeVersionId`: string
- `folderCode`: string
- `filePath`: string
- `documentMassAttribute`: object
- `templateId`: string
- `templateDoc`: boolean
- `ownerName`: string
- `createUserName`: string
- `editorName`: string

### `DocumentVo`

- `id`: string
- `documentType`: string
- `documentName`: string
- `projectId`: string
- `projectName`: string
- `activeVersionId`: string
- `folderCode`: string
- `filePath`: string
- `documentMassAttribute`: object
- `templateId`: string
- `templateDoc`: boolean
- `ownerName`: string
- `createUserName`: string
- `editorName`: string
- `errorMessage`: string

### `CreateDocumentVO`

- `documentName`: string
- `documentType`: string
- `projectId`: string
- `createTime`: date-time string

## Folder Management

### `FolderVO`

- `id`: string
- `name`: string
- `parentId`: string
- `createTime`: date-time string

### `PageDataFolderVO`

- `total`: int64
- `list`: `FolderVO[]`

### `ShareLinkVO`

- `url`: string
- `accessCode`: string
- `expireTime`: date-time string

## Drawing

### `TableVO`

- `tableType`: string
- `headers`: `string[]`
- `rows`: `array`

### Drawing Response Patterns

- create drawing: `CommonResultString`
- replace template: `CommonResultBoolean`
- list views: `CommonResultListString`
- create standard views: `CommonResultListString`
- create section/projected view: `CommonResultString`
- parent-index query: `CommonResultInteger`
- generate tables: `CommonResultTableVO`
- export drawing: `CommonResultString`

## BOM

### `VersionAttributeManifest`

- `id`: string
- `type`: string
- `manifestItems`: `ManifestItem[]`
- `docId`: string
- `versionId`: string
- `evaluateMass`: double
- `realMass`: double
- `docType`: string
- `blankSize`: string
- `manifestOrder`: `string[]`
- `versionName`: string

### `AttributeManifest`

- `id`: string
- `type`: string
- `manifestItems`: `ManifestItem[]`

### `ManifestItem`

- `id`: string
- `name`: string
- `value`: string
- `valueType`: string
- `enumValue`: string
- `fitDocType`: `string[]`

### `BomLevelTable`

- `maxLevel`: int32
- `keys`: `string[]`
- `items`: `BomItem[]`
- `preference`: `DocumentBOMPreference`
- `page`: int32
- `pages`: int32
- `size`: int32
- `total`: int64

### `BomItem`

- `id`: string
- `parent`: string
- `mark`: string
- `massValue`: string
- `level`: int32
- `curLevelCount`: int64
- `total`: int32
- `documentId`: string
- `documentName`: string
- `instanceName`: string
- `versionId`: string
- `versionName`: string
- `type`: string
- `isLost`: boolean
- `protoId`: string
- `protoName`: string
- `protoType`: string
- `index`: string
- `visible`: boolean
- `isVirtual`: boolean
- `pipeInfo`: object
- `other`: `Map<string, string>`
- `origin`: `Map<string, ManifestItem>`

## Topology

### `BodyVO`

- `id`: string
- `bodyType`: string
- `volume`: double

### `FaceVO`

- `id`: string
- `surfaceType`: string
- `area`: double

### `EdgeVO`

- `id`: string
- `curveType`: string
- `length`: double

### `LoopVO`

- `id`: string
- `isOuter`: boolean

### `Point3D`

- `x`: double
- `y`: double
- `z`: double

### `EdgeVerticesVO`

- `startVertex`: `Point3D`
- `endVertex`: `Point3D`

## Structure / Extraction / Query

### `ExternalReferenceVO`

- `documentId`: string
- `elementId`: string
- `versionId`: string

### `PmiVO`

- `id`: string
- `type`: string
- `value`: string

### `MateVO`

- `id`: string
- `name`: string
- `mateType`: string
- `matedEntities`: `string[]`

### `InstanceTreeVO`

- `id`: string
- `name`: string
- `referenceElementId`: string
- `transformMatrix`: `number[]`
- `children`: `InstanceTreeVO[]`

### `FeatureTreeVO`

- `id`: string
- `name`: string
- `featureType`: string
- `isSuppressed`: boolean
- `subFeatures`: `FeatureTreeVO[]`

### `FeatureParamsVO`

- `featureId`: string
- `parameters`: `Map<string, object>`

### `ElementVO`

- `id`: string
- `name`: string
- `elementType`: string

## Schema Planning Rules

- Prefer explicit backend schema names that mirror upstream entity names when building transparent proxy layers.
- For frontend code, expose only fields actually consumed by the page, but do not invent fields not present in the current entity catalog.
- When a task needs a full mirror of one upstream entity, prefer a dedicated schema/type over anonymous inline object definitions.
