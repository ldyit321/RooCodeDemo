# HUAYUN Secondary Development Backend

This backend scaffold is packaged from the `backend/` directory itself.

Key expectations:

- App entrypoint: `app.main:app`
- Project manifest: `backend/pyproject.toml`
- Local config template: `backend/.env.example`

This README intentionally lives inside `backend/` so editable installs such as
`python -m pip install -e .` do not need to read files outside the package root.
