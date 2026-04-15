# Python Backend Scaffold

Use this scaffold whenever CrownCAD requests should be mediated by a backend service.

## Included Layers

- `backend/app/main.py`
    - app bootstrap
- `backend/app/routes/documents.py`
    - route definitions only
- `backend/app/services/document_service.py`
    - business orchestration only
- `backend/app/clients/crowncad_client.py`
    - upstream CrownCAD HTTP calls only
- `backend/app/auth/oauth.py`
    - OAuth2 token acquisition and refresh helpers
- `backend/app/schemas/document.py`
    - request and response models
- `backend/app/utils/config.py`
    - environment configuration
- `backend/tests/test_documents.py`
    - service-level test example
