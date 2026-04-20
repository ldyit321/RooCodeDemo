# Vue Frontend Scaffold

Use this scaffold for HUAYUN frontend delivery by default, including small page-local tools and larger interactive modules.

## Included Layers

- `frontend/src/pages/DocumentPage.vue`
    - page-level composition
- `frontend/src/components/DocumentList.vue`
    - reusable presentation component
- `frontend/src/composables/useDocuments.js`
    - feature state and orchestration
- `frontend/src/services/`
    - auth, HTTP, and document request layers
- `frontend/src/router/index.js`
    - route entry for the feature

## Default HUAYUN Frontend Rule

- In `huayun-secondary-dev`, frontend implementation must use Vue
- Do not create new plain HTML, CSS, and JavaScript page scaffolds for new HUAYUN delivery work
- Keep even small frontend utilities inside the Vue page, service, and router structure so OAuth2 flow, request reuse, and later expansion stay consistent
