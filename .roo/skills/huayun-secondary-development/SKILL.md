---
name: huayun-secondary-development
description: Thin navigation skill for HUAYUN secondary development. Use when tasks involve CrownCAD or HUAYUN-specific frontend, backend, OAuth2 integration, or platform API work. This skill does not duplicate API definitions; it routes the model to the current workspace rules under `.roo/rules-huayun-secondary-dev/`.
---

# HUAYUN Secondary Development Skill

## Purpose

This is a thin skill for `huayun-secondary-dev`.

Use it to:

- recognize that the task belongs to HUAYUN / CrownCAD secondary development
- route the model to the current workspace rule set
- keep runtime behavior aligned with the built-in HUAYUN mode and rules-first source of truth

This skill must not become a second API knowledge base.

## Source Of Truth

- Treat `.roo/rules-huayun-secondary-dev/` as the primary local source of truth
- Do not duplicate HUAYUN API definitions in this skill
- Do not maintain a `references/` tree for HUAYUN API materials under skills or exported skills
- If the rules and any auxiliary material disagree, follow the current workspace rules
- This skill is downstream of mode selection and prompt assembly; it is not an alternative entry point for HUAYUN API truth
- This skill may route the model to the right rules, but it must not override conclusions already established by current workspace rules

## When To Use This Skill

Use this skill when the task involves:

- CrownCAD or HUAYUN-specific secondary development
- Vue frontend pages for HUAYUN features
- Python backend services, middleware, or proxy routes for CrownCAD integration
- OAuth2 access flow for HUAYUN / CrownCAD integration
- HUAYUN document, folder, drawing, BOM, topology, structure, query, or CrownScript work
- checking whether a capability is defined in current HUAYUN rule materials

## When NOT To Use This Skill

Do not use this skill when:

- the task is unrelated to HUAYUN or CrownCAD
- the task is generic repository work with no HUAYUN-specific constraints
- the task only needs normal repository guidance from `AGENTS.md`

## Required Behavior

- Read the relevant files from `.roo/rules-huayun-secondary-dev/` before making API assumptions
- Follow this route in order:
    - current mode and Secondary Dev runtime configuration
    - current workspace HUAYUN rules
    - relevant module rule file
    - thin skill and `AGENTS.md` only as supplements
    - business implementation code only after rule conclusions are clear
- Prefer module-specific rule files over generic inference
- Treat `Method + Path` together for same-path multi-method APIs
- Report missing APIs explicitly instead of fabricating them
- Keep frontend/backend/OAuth2 decisions aligned with the current rules and mode configuration

## Recommended Rule Reading Order

Start with:

- `.roo/rules-huayun-secondary-dev/10-api-overview.md`
- `.roo/rules-huayun-secondary-dev/11-workflow-phases.md`
- `.roo/rules-huayun-secondary-dev/13-api-hard-constraints.md`

Then read as needed:

- `.roo/rules-huayun-secondary-dev/20-authentication-and-security.md`
- `.roo/rules-huayun-secondary-dev/30-common-response-contracts.md`
- the relevant module file such as:
    - `.roo/rules-huayun-secondary-dev/40-document-management-api.md`
    - `.roo/rules-huayun-secondary-dev/50-crownscript-api.md`
    - `.roo/rules-huayun-secondary-dev/60-folder-management-api.md`
    - `.roo/rules-huayun-secondary-dev/70-drawing-api.md`
    - `.roo/rules-huayun-secondary-dev/80-bom-api.md`
    - `.roo/rules-huayun-secondary-dev/90-topology-structure-and-query-api.md`

For deeper non-runtime guidance, read from:

- `docs/huayun-secondary-dev-guides/`
- `docs/huayun-secondary-dev-rules-skill-boundary.md`

## Design Constraint

- This skill is intentionally thin
- HUAYUN mode selection is built-in; this skill is only a thin navigation supplement
- If additional HUAYUN guidance is needed, add it to the rules or docs instead of turning this skill into a duplicate API reference set
