# HUAYUN Standard Architecture

This file defines the default implementation shape for `huayun-secondary-dev`.

## Goal

- Keep frontend, backend, auth, and CrownCAD integration code organized into predictable layers
- Avoid "single-file feature piles" where page rendering, auth, request logic, and business rules are all mixed together

## Default Delivery Order

1. Establish or reuse OAuth2 authentication layer
2. Establish or reuse shared request/client layer for CrownCAD APIs
3. Establish backend Python proxy or service layer when server-side mediation is required
4. Build frontend feature page on top of shared auth and API layers
5. Add validation, error handling, and manual verification notes

## Scaffold Baseline

- When the feature is new, start from `templates/huayun-secondary-dev/`
- Use `plain-frontend/` as the baseline for small page-local work
- Use `vue-frontend/` as the baseline for reusable or shared-state modules
- Use `python-backend/` as the backend baseline whenever server-side mediation is required

## Default Frontend Shape

For non-trivial features, prefer:

- Plain page option:
    - `frontend/pages/<feature>/index.html`
    - `frontend/pages/<feature>/styles.css`
    - `frontend/pages/<feature>/app.js`
- Vue option:
    - `frontend/src/pages/<FeaturePage>.vue`
    - `frontend/src/components/`
    - `frontend/src/composables/`
    - `frontend/src/services/`
    - `frontend/src/router/`
- `frontend/shared/auth/oauth.js`
- `frontend/shared/api/crowncad.js`
- `frontend/shared/utils/*.js`

## Default Backend Shape

For non-trivial server-side work, prefer:

- `backend/app/main.py`
- `backend/app/routes/<feature>.py`
- `backend/app/services/<feature>_service.py`
- `backend/app/clients/crowncad_client.py`
- `backend/app/auth/oauth.py`
- `backend/app/schemas/<feature>.py`
- `backend/tests/`

## Responsibility Boundaries

- HTML defines structure
- CSS defines presentation
- Frontend JS coordinates user interaction and view state
- Vue SFCs define component composition and delegate shared logic to composables and services
- Shared auth modules own OAuth2 state and token handling
- Shared API modules own request construction and response parsing
- Python routes expose HTTP endpoints and validate input
- Python services own feature orchestration
- Python clients own CrownCAD upstream HTTP calls

## Anti-Patterns To Avoid

- Putting OAuth2 token exchange code directly inside a feature page script
- Putting raw CrownCAD request code directly inside multiple Vue components instead of shared services
- Repeating raw fetch or requests code in every feature instead of reusing shared clients
- Mixing route handlers and upstream request code in the same Python module
- Embedding large amounts of business logic directly in DOM event handlers
- Creating a new ad hoc folder layout for every feature
