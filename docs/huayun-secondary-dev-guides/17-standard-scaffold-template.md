# HUAYUN Standard Scaffold Template

This file defines the default scaffold references for `huayun-secondary-dev`.

## When To Use A Scaffold

- When the task creates a new feature, page, module, integration, or service from scratch
- When the current repository does not already provide a stronger local structure to extend
- When you need a predictable starting point before filling in CrownCAD-specific business logic

## Required Behavior

- Do not invent a one-off folder layout if one of the standard scaffolds already fits
- Use the Vue frontend scaffold by default according to `16-frontend-selection-matrix.md`
- Pair the chosen frontend scaffold with the shared Python backend scaffold when server-side mediation is required
- Keep OAuth2 setup in dedicated auth files before implementing business flows
- Rename `sample-feature`, `DocumentPage`, and placeholder module names to the real feature name

## Scaffold Paths

- Vue frontend scaffold:
    - `templates/huayun-secondary-dev/vue-frontend/`
- Python backend scaffold:
    - `templates/huayun-secondary-dev/python-backend/`

## Selection Rules

- Use `vue-frontend` for HUAYUN frontend delivery, including small, page-local, reusable, multi-step, and shared-state interfaces
- Use `python-backend` whenever the feature needs backend proxying, token handling, upstream request mediation, or business orchestration
- For new HUAYUN Python backends, the default required output is `backend/app/main.py` plus `backend/pyproject.toml` and `backend/.env` or `backend/.env.example`

## Template Application Rules

- Preserve the separation between auth, request/client, service, and UI layers shown in the scaffold
- Replace placeholder endpoints, scopes, and configuration names with real project values
- Centralize `code / message / data` response handling instead of duplicating parsing logic
- Add loading, empty, success, and error states in the frontend template before considering the feature complete
- If the repository already has matching layers, adapt the scaffold shape into the existing project instead of copying it blindly
