# CrownCAD Drawing API

## Drawing Creation And Template Management

- `POST /api/drawing/{documentId}`

    - operationId: `createDrawing`
    - summary: create a drawing document context or drawing sheet resource for the specified source document
    - description: use this endpoint to bootstrap a drawing from a source document, choose a template, and optionally bind a referenced document for drawing generation workflows

    - Path parameter:
        - `documentId`
    - Body: `DrawingCreateDTO`
    - Response schema:
        - `CommonResultString`
        - `data`: drawing-related identifier or upstream result string
    - Required fields:
        - `name`
        - `templateId`
    - Optional fields:
        - `referenceDocumentId`

- `PUT /api/drawing/{documentId}/template`
    - operationId: `replaceDrawingTemplate`
    - summary: replace the active drawing template for the specified drawing document
    - description: use this endpoint when the requirement is to switch title block, drawing format, or template-driven layout for an existing drawing
    - Path parameter:
        - `documentId`
    - Body: `TemplateUpdateDTO`
    - Required fields:
        - `newTemplateId`
    - Response schema:
        - `CommonResultBoolean`
        - `data`: boolean

## Drawing Views

- `GET /api/drawing/{documentId}/views`
    - operationId: `listDrawingViews`
    - summary: list existing drawing views for the specified drawing document
    - description: use this endpoint to load the current drawing view set before creating section, projected, or other dependent view operations
    - Response schema:
        - `CommonResultListString`
        - `data`: `string[]`
- `POST /api/drawing/{documentId}/views/standard`
    - operationId: `createStandardDrawingViews`
    - summary: create one or more standard drawing views for the specified drawing document
    - description: use this endpoint to generate standard orthographic or configured base views, typically with scale and display-style options
    - Body: `ViewConfigDTO`
    - Known fields:
        - `scale`
        - `displayStyle`
    - Response schema:
        - `CommonResultListString`
        - `data`: `string[]`
- `POST /api/drawing/{documentId}/views/section`
    - operationId: `createSectionDrawingView`
    - summary: create a section view derived from an existing parent drawing view
    - description: use this endpoint when the requirement is to cut through a parent view and generate a section-based derived drawing view
    - Body: `SectionViewDTO`
    - Required:
        - `parentViewId`
    - Response schema:
        - `CommonResultString`
        - `data`: string
- `POST /api/drawing/{documentId}/views/projected`
    - operationId: `createProjectedDrawingView`
    - summary: create a projected drawing view from an existing parent drawing view
    - description: use this endpoint when the requirement is to generate a projected or derived view based on a parent view and a projection direction
    - Body: `ProjectedViewDTO`
    - Required:
        - `parentViewId`
        - `direction`
    - Response schema:
        - `CommonResultString`
        - `data`: string
- `DELETE /api/drawing/{documentId}/views/{viewId}`
    - operationId: `deleteDrawingView`
    - summary: delete an existing drawing view from the specified drawing document
    - description: use this endpoint only for removing one explicit drawing view by `viewId`; do not substitute it for drawing deletion or template reset
- `GET /api/drawing/{documentId}/views/{viewId}/parent-index`
    - operationId: `getDrawingViewParentIndex`
    - summary: query the parent index or parent relationship position for a specific drawing view
    - description: use this endpoint when UI logic or derived-view workflows need to know the parent ordering or parent index of an existing view
    - Response schema:
        - `CommonResultInteger`
        - `data`: integer

## Drawing Tables And Export

- `POST /api/drawing/{documentId}/tables/weldment-cut-list`
    - operationId: `createWeldmentCutListTable`
    - summary: generate a weldment cut list table for the specified drawing document
    - description: use this endpoint to insert or preview a weldment-related cut list table in a drawing workflow
    - Response schema:
        - `CommonResultTableVO`
        - `data`: `TableVO`
- `POST /api/drawing/{documentId}/tables/bom`
    - operationId: `createDrawingBomTable`
    - summary: generate a BOM table for the specified drawing document
    - description: use this endpoint when the requirement is to add, preview, or retrieve a bill-of-materials table inside the drawing workflow
    - Response schema:
        - `CommonResultTableVO`
        - `data`: `TableVO`
- `POST /api/drawing/{documentId}/export`
    - operationId: `exportDrawing`
    - summary: export the specified drawing document to a chosen output format
    - description: use this endpoint when the requirement is to export a drawing artifact such as PDF or another supported format, with optional version targeting
    - Body: `ExportConfigDTO`
    - Required:
        - `format`
    - Optional:
        - `version`
    - Response schema:
        - `CommonResultString`
        - `data`: string

## Response Entity Notes

### `TableVO`

- key fields:
    - `tableType`
    - `headers`
    - `rows`

## Implementation Rules

- Treat drawing creation, template switching, view creation, table generation, and export as separate capabilities.
- Do not combine drawing bootstrap, view orchestration, and export logic into one oversized frontend component or one backend route handler.
- When a UI creates views, make the parent-child relationship explicit for section and projected views.
- For current view-related endpoints, do not invent rich `DrawingViewVO` objects when the latest OpenAPI currently returns `string` or `string[]`.
- For table generation, preserve the upstream `TableVO` structure instead of flattening headers and rows into ad hoc shapes in every caller.
- When exporting, require the caller to choose `format` explicitly instead of guessing from file extension or document type.
