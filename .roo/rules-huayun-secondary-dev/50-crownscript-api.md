# CrownCAD CrownScript API

## Current Status

- `POST /api/crownscript` was provided in earlier HUAYUN materials.
- This endpoint is not present in the latest OpenAPI snapshot from:
    - `http://10.0.100.54:9000/crowncad-api/openapi/api-docs`
- Treat this file as supplemental legacy guidance, not as part of the current OpenAPI-covered scope.

## Execute CrownScript Program

- Method: `POST`
- Path: `/api/crownscript`
- Tag: `CrownScript`
- OperationId: `executeProgram`

## Required Query Parameters

- `projectId`: string
- `documentId`: string
- `docType`: string
- `overwrite`: boolean

## Known docType Values

- `PartDocument`
- `AssemblyDocument`

## Request Body

- Content type: `multipart/form-data`
- Required field:
    - `code`: string

## Response

- Wrapper: `CommonResultObject`

## Implementation Rules

- Use this rule only when the task explicitly depends on the earlier CrownScript material or the user confirms the endpoint still exists in the deployment.
- Generate this request as multipart form data, not JSON.
- Restrict `docType` to the known enum values unless newer documentation says otherwise.
- Because this endpoint executes business logic against a model document, always validate authentication success before attempting execution.
- For frontend integrations, surface execution success and failure states clearly.
- For backend Python proxies, log upstream execution failures with enough context to trace the target project and document.
