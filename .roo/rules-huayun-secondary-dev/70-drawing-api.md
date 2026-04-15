# CrownCAD Drawing API

## Drawing Creation And Template Management

- `POST /api/drawing/{documentId}`

    - Path parameter:
        - `documentId`
    - Body: `DrawingCreateDTO`
    - Required fields:
        - `name`
        - `templateId`
    - Optional fields:
        - `referenceDocumentId`

- `PUT /api/drawing/{documentId}/template`
    - Path parameter:
        - `documentId`
    - Body: `TemplateUpdateDTO`
    - Required fields:
        - `newTemplateId`

## Drawing Views

- `GET /api/drawing/{documentId}/views`
- `POST /api/drawing/{documentId}/views/standard`
    - Body: `ViewConfigDTO`
    - Known fields:
        - `scale`
        - `displayStyle`
- `POST /api/drawing/{documentId}/views/section`
    - Body: `SectionViewDTO`
    - Required:
        - `parentViewId`
- `POST /api/drawing/{documentId}/views/projected`
    - Body: `ProjectedViewDTO`
    - Required:
        - `parentViewId`
        - `direction`
- `DELETE /api/drawing/{documentId}/views/{viewId}`
- `GET /api/drawing/{documentId}/views/{viewId}/parent-index`

## Drawing Tables And Export

- `POST /api/drawing/{documentId}/tables/weldment-cut-list`
- `POST /api/drawing/{documentId}/tables/bom`
- `POST /api/drawing/{documentId}/export`
    - Body: `ExportConfigDTO`
    - Required:
        - `format`
    - Optional:
        - `version`

## Implementation Rules

- Treat drawing creation, template switching, view creation, table generation, and export as separate capabilities.
- Do not combine drawing bootstrap, view orchestration, and export logic into one oversized frontend component or one backend route handler.
- When a UI creates views, make the parent-child relationship explicit for section and projected views.
- When exporting, require the caller to choose `format` explicitly instead of guessing from file extension or document type.
