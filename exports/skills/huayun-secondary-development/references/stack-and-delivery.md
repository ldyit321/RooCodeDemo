# HUAYUN Secondary Development Rules

These rules apply specifically when using the `huayun-secondary-dev` mode.

## 1. Project Framing

- Treat all tasks in this mode as software secondary development for a target platform such as CrownCAD
- Prefer adapting to existing platform constraints over creating generic greenfield solutions
- Check project docs, examples, APIs, and repository conventions before making architectural assumptions

## 2. Required Stack Policy

- Frontend work may use either plain JavaScript plus HTML/CSS or Vue
- For small or page-local features, prefer plain JavaScript plus HTML/CSS
- For medium or large interactive frontend modules, Vue is allowed and recommended when it better fits the existing project structure
- Unless the user explicitly requests it, do not default to TypeScript even when using Vue
- Backend services, scripts, middleware, and integration logic must use Python unless the user explicitly requests another stack
- Do not default to React, Node.js backend frameworks, Java, or Go without explicit approval

## 3. Mandatory OAuth2 First Phase

- OAuth2 authentication must be treated as the first delivery phase in this mode unless the user explicitly says it has already been completed for the current task
- Assume the required OAuth2 endpoints and related interfaces have already been provided by the user or project materials
- Before implementing business pages, backend services, or integration features, first determine:
    - the OAuth2 grant flow to use
    - token acquisition and refresh behavior
    - required scopes
    - how the authorization entry URL is constructed from `baseUrl`, `authorizePath`, `applicationId`, and `redirectUrl`
    - redirect or callback handling
    - how returned `code` and `scope` are parsed from the redirect callback
    - how `code` is exchanged for token through `POST {baseUrl}/{tokenPath}`
    - how token form fields map to `grant_type`, `code`, `client_id`, `client_secret`, and `client_scope`
    - token storage and injection strategy
- Reuse existing authentication code if present; otherwise create the minimum required authentication bootstrap before proceeding to downstream business functionality
- Unless the user explicitly overrides it, assume the authorization entry page uses the HUAYUN query parameters `applicationId` and `redirectUrl`
- Unless the user explicitly overrides it, assume the redirect callback returns `code` and `scope` query parameters to the configured redirect URI
- Unless the user explicitly overrides it, exchange the callback `code` for token with `application/x-www-form-urlencoded` rather than JSON
- Unless the user explicitly overrides it, map callback `scope` to token exchange field `client_scope`
- Do not use `state`, `scope`, `applicationId`, `redirectUrl`, or `redirect_uri` as default token exchange form field names
- If the Secondary Dev settings indicate Client Secret is configured, do not ask the user to paste it; generated OAuth code must read it from the configured secret/config source
- Never hardcode, print, log, or expose the raw Client Secret; use a backend secret provider, config module, or environment binding such as `HUAYUN_CLIENT_SECRET`
- If a generated standalone project cannot access extension settings directly, report the missing secret binding and create only a placeholder/config interface instead of requesting the raw Client Secret in chat
- If full runtime validation is not possible, explicitly state how OAuth2 success should be verified manually
- When the task is design-first or architecture-first, prefer OAuth2 and architecture design output before broad code generation

## 4. Frontend Delivery Rules

- Keep structure, style, and behavior clearly separated
- Prefer maintainable JS/HTML/CSS implementations for plain pages and clear component boundaries for Vue implementations
- Include loading, empty, and error states when the task involves async data
- Reuse existing request wrappers, utility modules, and styling conventions when available
- Do not mix OAuth2 bootstrap, raw request wiring, DOM rendering, and feature business logic in one file when the task exceeds a trivial demo

## 5. Backend Python Delivery Rules

- Use Python for server-side and automation work
- Keep route, service, and utility responsibilities separated when the project structure supports it
- Add clear error handling and logs where integration failures are possible
- Use type hints for public functions when practical
- Do not place route handlers, upstream CrownCAD request code, token management, and business orchestration in the same module without a strong reason

## 6. Standard Architecture Contract

- When creating a feature from scratch, start from the matching scaffold under `templates/huayun-secondary-dev/` instead of inventing a new layout
- Use `plain-frontend/` for simple page-local features, `vue-frontend/` for richer interactive modules, and `python-backend/` whenever backend mediation is needed

### Frontend Layers

- Plain page option:
    - `frontend/pages/<feature>/index.html`: page structure only
    - `frontend/pages/<feature>/styles.css`: page styles only
    - `frontend/pages/<feature>/app.js`: page entry and UI orchestration only
- Vue option:
    - `frontend/src/pages/<FeaturePage>.vue`: page-level composition
    - `frontend/src/components/`: reusable Vue components
    - `frontend/src/composables/`: reusable stateful frontend logic
    - `frontend/src/services/`: frontend request and integration services
    - `frontend/src/router/`: route definitions when routing exists
- `frontend/shared/auth/`: OAuth2 login, callback, token storage, token injection
- `frontend/shared/api/`: request wrappers and CrownCAD API calls
- `frontend/shared/components/`: reusable UI fragments when needed
- `frontend/shared/utils/`: formatting, validation, helpers

### Backend Python Layers

- `backend/app/main.py`: application bootstrap
- `backend/app/routes/`: HTTP route definitions only
- `backend/app/services/`: business orchestration only
- `backend/app/clients/`: CrownCAD upstream API clients only
- `backend/app/auth/`: OAuth2 token exchange, refresh, session or credential helpers
- `backend/app/schemas/`: request and response models
- `backend/app/utils/`: logging, config, shared helpers
- `backend/tests/`: tests grouped by route, service, and client responsibilities

### Architecture Rules

- Frontend pages may call shared API/auth modules, but should not embed OAuth2 token exchange logic directly in feature rendering code
- Vue pages and components may use composables and services, but should not embed raw CrownCAD HTTP calls repeatedly inside SFCs
- Backend routes may call services, and services may call clients/auth modules, but routes should not contain upstream CrownCAD calling logic
- Upstream CrownCAD API access should be centralized in `clients` or equivalent request modules
- Shared response parsing for `code / message / data` should be centralized instead of duplicated across every call site
- New features should plug into this structure instead of inventing a one-off layout

## 7. Secondary Development Safety

- Do not invent undocumented APIs, fields, workflow steps, or business rules
- Treat the latest OpenAPI snapshot as the primary source of truth for document, folder, drawing, BOM, topology, structure, and query APIs
- Treat older supplemental materials such as CrownScript as explicit add-on references, not as automatically current API surface
- If the platform capability is unclear, search the repository or provided docs before implementing
- If the required API is not present in the current docs or user-provided materials, explicitly report the missing capability and implement only safe scaffolding or integration seams
- Do not create fake upstream paths, fake request/response fields, or fake backend proxy methods that appear to call real CrownCAD APIs
- Treat standard system Folder APIs as known current OpenAPI capabilities: `GET /api/folder`, `POST /api/folder`, `POST /api/folder/{folderId}/share`, `PATCH /api/folder/{folderId}/name`, and `DELETE /api/folder/{folderId}`
- Do not report system Folder query, create, share, rename, or delete as blocked by missing API when using those known paths and documented fields
- Distinguish standalone system `Folder` resources from project-internal `FolderDocument` document-type folders; use the resource type implied by the task wording and API evidence
- Prefer incremental extension over broad refactors
- Avoid introducing large new dependencies unless the task clearly requires them
- If the task continues a previous HUAYUN secondary development design, extend that established structure instead of silently redesigning it
- During ordinary implementation scenes, do not automatically start long-running frontend or backend services unless the user explicitly asks for runtime execution now
- Prefer the dedicated run flow for runtime validation and the dedicated package flow for packaging validation

## 8. Completion Expectations

- Confirm that the output still matches the required stack policy
- Confirm that the OAuth2 first-phase requirement has been handled or explicitly acknowledged as already completed
- Verify tests, checks, or preview steps when applicable
- If you cannot fully verify the result, explicitly state what requires manual validation
