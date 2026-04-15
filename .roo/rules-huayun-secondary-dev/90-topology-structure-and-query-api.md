# CrownCAD Topology, Structure, And Query API

## Topology Endpoints

- `GET /api/topo/{documentId}/bodies`
- `GET /api/topo/{documentId}/bodies/{bodyId}/faces`
- `GET /api/topo/{documentId}/bodies/{bodyId}/edges`
- `GET /api/topo/{documentId}/faces/{faceId}/loops`
- `GET /api/topo/{documentId}/faces/{faceId}/edges/unordered`
- `GET /api/topo/{documentId}/loops/{loopId}/edges/ordered`
- `GET /api/topo/{documentId}/edges/{edgeId}/vertices`
- `GET /api/topo/{documentId}/edges/{edgeId}/adjacent-faces`

## Structure And Data Extraction Endpoints

- `GET /api/structure/{documentId}/external-references`
- `GET /api/structure/{documentId}/elements/{elementId}/pmi`
- `GET /api/structure/{documentId}/elements/{elementId}/mates`
- `GET /api/structure/{documentId}/elements/{elementId}/instances`
- `GET /api/structure/{documentId}/elements/{elementId}/features`

## Query Endpoints

- `GET /api/query/features/parameters`
    - Required query parameters:
        - `elementId`
        - `featureName`
- `GET /api/query/elements`
    - Required query parameters:
        - `name`

## Implementation Rules

- These endpoints are read-heavy exploration and extraction APIs. Treat them as query capabilities, not mutation workflows.
- Keep topology traversal logic separate from generic document CRUD and separate from drawing logic.
- When building UI for these endpoints, prefer lazy loading and drill-down navigation instead of loading the whole graph at once.
- When building backend Python proxies, keep document-level path parameters and element-level path parameters explicit and validated.
- If the user asks for a geometry browser, topology inspector, or structure explorer, prefer these APIs instead of inventing custom parsing logic.
