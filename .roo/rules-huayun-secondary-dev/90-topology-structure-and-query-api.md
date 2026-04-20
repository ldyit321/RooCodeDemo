# CrownCAD Topology, Structure, And Query API

Derived from the latest OpenAPI snapshot fetched on 2026-04-17.

## Topology Endpoints

- `GET /api/topo/{documentId}/bodies`
    - operationId: `listBodies`
    - summary: list topology bodies contained in the specified document
    - description: use this endpoint as the topology traversal entry point when the requirement is to inspect bodies, browse solid or sheet body information, or drill down into face and edge data
    - response schema:
        - `CommonResultListBodyVO`
        - `data`: `BodyVO[]`
- `GET /api/topo/{documentId}/bodies/{bodyId}/faces`
    - operationId: `listFacesByBody`
    - summary: list faces that belong to the specified body in the specified document
    - description: use this endpoint when the requirement is to inspect surface regions, enumerate face geometry, or continue topology traversal from body to face level
    - response schema:
        - `CommonResultListFaceVO`
        - `data`: `FaceVO[]`
- `GET /api/topo/{documentId}/bodies/{bodyId}/edges`
    - operationId: `listEdgesByBody`
    - summary: list edges that belong to the specified body in the specified document
    - description: use this endpoint when the requirement is to inspect body boundary edges, traverse edge geometry, or prepare downstream edge-to-vertex and edge-to-face queries
    - response schema:
        - `CommonResultListEdgeVO`
        - `data`: `EdgeVO[]`
- `GET /api/topo/{documentId}/faces/{faceId}/loops`
    - operationId: `listLoopsByFace`
    - summary: list loops that belong to the specified face in the specified document
    - description: use this endpoint when the requirement is to inspect face boundary loops, outer versus inner loops, or prepare ordered edge traversal inside a loop
    - response schema:
        - `CommonResultListLoopVO`
        - `data`: `LoopVO[]`
- `GET /api/topo/{documentId}/faces/{faceId}/edges/unordered`
    - operationId: `listUnorderedEdgesByFace`
    - summary: list unordered edges attached to the specified face
    - description: use this endpoint when face-related edge membership is needed but loop-based edge ordering is not required
    - response schema:
        - `CommonResultListEdgeVO`
        - `data`: `EdgeVO[]`
- `GET /api/topo/{documentId}/loops/{loopId}/edges/ordered`
    - operationId: `listOrderedEdgesByLoop`
    - summary: list ordered edges that make up the specified loop
    - description: use this endpoint when the requirement depends on loop edge order, boundary traversal direction, or sequential geometry processing around a loop
    - response schema:
        - `CommonResultListEdgeVO`
        - `data`: `EdgeVO[]`
- `GET /api/topo/{documentId}/edges/{edgeId}/vertices`
    - operationId: `getEdgeVertices`
    - summary: query the start and end vertices of the specified edge
    - description: use this endpoint when the requirement is to retrieve explicit edge endpoints, vertex coordinates, or directional edge endpoint semantics
    - response schema:
        - `CommonResultEdgeVerticesVO`
        - `data`: `EdgeVerticesVO`
- `GET /api/topo/{documentId}/edges/{edgeId}/adjacent-faces`
    - operationId: `listAdjacentFacesByEdge`
    - summary: list faces adjacent to the specified edge
    - description: use this endpoint when the requirement is to inspect face adjacency across an edge or analyze local topology relationships between edges and faces
    - response schema:
        - `CommonResultListFaceVO`
        - `data`: `FaceVO[]`

## Structure And Data Extraction Endpoints

- `GET /api/structure/{documentId}/external-references`
    - operationId: `listExternalReferences`
    - summary: list external references used by the specified document
    - description: use this endpoint when the requirement is to inspect linked documents, referenced elements, or cross-document dependencies
    - response schema:
        - `CommonResultListExternalReferenceVO`
        - `data`: `ExternalReferenceVO[]`
- `GET /api/structure/{documentId}/elements/{elementId}/pmi`
    - operationId: `listElementPmi`
    - summary: list PMI data attached to the specified element
    - description: use this endpoint when the requirement is to browse product manufacturing information, annotations, dimensions, or element-level semantic marks
    - response schema:
        - `CommonResultListPmiVO`
        - `data`: `PmiVO[]`
- `GET /api/structure/{documentId}/elements/{elementId}/mates`
    - operationId: `listElementMates`
    - summary: list mate relationships that involve the specified element
    - description: use this endpoint when the requirement is to inspect assembly constraints, mating relationships, or motion-related element bindings
    - response schema:
        - `CommonResultListMateVO`
        - `data`: `MateVO[]`
- `GET /api/structure/{documentId}/elements/{elementId}/instances`
    - operationId: `getElementInstanceTree`
    - summary: query the instance tree rooted at or associated with the specified element
    - description: use this endpoint when the requirement is to inspect assembly instance hierarchy, nested occurrences, or transform-linked instance structures
    - response schema:
        - `CommonResultInstanceTreeVO`
        - `data`: `InstanceTreeVO`
- `GET /api/structure/{documentId}/elements/{elementId}/features`
    - operationId: `getElementFeatureTree`
    - summary: query the feature tree associated with the specified element
    - description: use this endpoint when the requirement is to inspect modeling features, feature hierarchy, suppressed features, or feature-driven structure of an element
    - response schema:
        - `CommonResultFeatureTreeVO`
        - `data`: `FeatureTreeVO`

## Query Endpoints

- `GET /api/query/features/parameters`
    - operationId: `getFeatureParameters`
    - summary: query parameter data for a named feature on the specified element
    - description: use this endpoint when the requirement is to inspect feature parameter values, editable feature settings, or feature configuration metadata by `featureName`
    - required query parameters:
        - `elementId`
        - `featureName`
    - response schema:
        - `CommonResultFeatureParamsVO`
        - `data`: `FeatureParamsVO`
- `GET /api/query/elements`
    - operationId: `queryElementsByName`
    - summary: query document elements by element name
    - description: use this endpoint when the requirement is to find elements by name, resolve element identifiers from a known label, or drive structure lookup from a textual element query
    - required query parameters:
        - `name`
    - response schema:
        - `CommonResultListElementVO`
        - `data`: `ElementVO[]`

## Response Entity Notes

### `BodyVO`

- key fields:
    - `id`
    - `bodyType`
    - `volume`

### `FaceVO`

- key fields:
    - `id`
    - `surfaceType`
    - `area`

### `EdgeVO`

- key fields:
    - `id`
    - `curveType`
    - `length`

### `LoopVO`

- key fields:
    - `id`
    - `isOuter`

### `Point3D`

- key fields:
    - `x`
    - `y`
    - `z`

### `EdgeVerticesVO`

- key fields:
    - `startVertex`
    - `endVertex`

### `ExternalReferenceVO`

- key fields:
    - `documentId`
    - `elementId`
    - `versionId`

### `PmiVO`

- key fields:
    - `id`
    - `type`
    - `value`

### `MateVO`

- key fields:
    - `id`
    - `name`
    - `mateType`
    - `matedEntities`

### `InstanceTreeVO`

- key fields:
    - `id`
    - `name`
    - `referenceElementId`
    - `transformMatrix`
    - `children`

### `FeatureTreeVO`

- key fields:
    - `id`
    - `name`
    - `featureType`
    - `isSuppressed`
    - `subFeatures`

### `FeatureParamsVO`

- key fields:
    - `featureId`
    - `parameters`

### `ElementVO`

- key fields:
    - `id`
    - `name`
    - `elementType`

## Implementation Rules

- These endpoints are read-heavy exploration and extraction APIs. Treat them as query capabilities, not mutation workflows.
- Keep topology traversal logic separate from generic document CRUD and separate from drawing logic.
- Keep topology endpoints, structure endpoints, and query endpoints as separate request helpers and separate backend service methods even when they appear in the same explorer page.
- When building UI for these endpoints, prefer lazy loading and drill-down navigation instead of loading the whole graph at once.
- For topology traversal, preserve upstream list ordering when the endpoint semantics imply ordered edges, and do not reorder payloads client-side unless the product explicitly needs a derived sort.
- For tree payloads like `InstanceTreeVO` and `FeatureTreeVO`, preserve recursive nesting instead of flattening the structure too early.
- For `EdgeVerticesVO`, treat `startVertex` and `endVertex` as explicit semantic endpoints; do not collapse them into an unordered vertex array.
- For backend Python proxies, keep document-level path parameters and element-level path parameters explicit and validated.
- If the user asks for a geometry browser, topology inspector, structure explorer, PMI viewer, mate browser, or feature inspector, prefer these APIs instead of inventing custom parsing logic.
