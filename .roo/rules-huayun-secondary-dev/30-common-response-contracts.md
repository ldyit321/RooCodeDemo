# CrownCAD Common Response Contracts

## Common Result Wrapper

Known response wrappers in the provided materials include:

- `CommonResultCreateDocumentVO`
- `CommonResultObject`
- `CommonResultFolderVO`
- `CommonResultListElementVO`
- `CommonResultPageDataFolderVO`

## Shared Top-Level Fields

- `code`: integer or int64 status code
- `message`: string status or error message
- `data`: business payload

## Current Practical Rules

- Always check `code`, `message`, and `data` instead of assuming the payload is returned directly.
- Frontend code should centralize wrapper parsing inside request helpers when possible.
- Backend Python proxy code should normalize wrapper handling and surface clear business errors upstream.
- If a page or service depends on `data`, handle empty or null payloads explicitly.
- Do not let feature components parse wrapper variants ad hoc when a shared request layer can absorb that difference.

## Known Payload Examples

- `CreateDocumentVO`
- `FolderVO`
- `PageDataFolderVO`
- `ElementVO`

## Implementation Guidance

- In frontend code, prefer returning normalized business payloads plus explicit error metadata from shared API helpers.
- In backend Python code, map upstream `code / message / data` into stable internal exceptions or service results before route handlers format the final response.
