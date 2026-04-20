# HUAYUN Secondary Dev Scaffolds

This directory provides the reference scaffolds used by `HUAYUN Secondary Dev`.

## Available Scaffolds

- `vue-frontend/`
    - For HUAYUN frontend features using Vue
- `python-backend/`
    - Shared backend service layout for OAuth2, CrownCAD proxying, and business orchestration

## How To Apply

1. Choose the Vue frontend scaffold using `docs/huayun-secondary-dev-guides/16-frontend-selection-matrix.md`.
2. Reuse the `python-backend` scaffold whenever the feature requires server-side mediation.
3. Rename placeholder modules such as `sample-feature`, `documents`, and `DocumentPage`.
4. Replace placeholder OAuth2 values, scopes, endpoints, and environment variables with real CrownCAD project values.
5. Extend existing repository structure instead of copying the scaffold verbatim when the target project already has compatible layers.
