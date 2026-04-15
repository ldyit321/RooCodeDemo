# CrownCAD BOM API

## Document Attribute Manifest

- `GET /api/bom/documentAttributeManifest`
- `PUT /api/bom/documentAttributeManifest`
- `POST /api/bom/documentAttributeManifest`
- `DELETE /api/bom/documentAttributeManifest`

## Level Table

- `GET /api/bom/levelTable`

### Required Query Parameters

- `projectId`: string
- `documentId`: string

### Optional Query Parameters

- `currentPage`: integer

## Implementation Rules

- Treat BOM manifest management and BOM table querying as different responsibilities.
- For backend Python code, isolate BOM query forwarding in a dedicated client or service instead of mixing it into generic document clients.
- If the UI only needs table display, do not couple it to manifest mutation flows.
- When pagination is present, preserve the upstream page contract rather than inventing a different paging shape.
