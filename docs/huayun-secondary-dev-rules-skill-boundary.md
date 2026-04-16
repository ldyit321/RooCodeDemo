# HUAYUN Rules And Skill Boundary

This document defines the recommended boundary between rules, skills, and repository-level guidance for `huayun-secondary-dev`.

## Goal

- Keep runtime guidance fast enough for normal HUAYUN tasks
- Keep API truth in one place
- Prevent future drift between rules, skills, and exported references

## Recommended Runtime Model

- Treat `huayun-secondary-dev` as a built-in mode, not a project-specific third-party mode
- Use `.roo/rules-huayun-secondary-dev/` as the primary runtime constraint source
- Keep the built-in HUAYUN mode prompt aligned with the rules-first design
- Do not rely on duplicated HUAYUN API definitions in skills or exported references for normal runtime behavior

## What Belongs In Rules

Rules are the always-on runtime constraints for HUAYUN tasks.

Put the following in rules:

- current known API scope
- hard constraints
- authentication and security requirements
- common response contracts
- high-frequency module API rules
- non-missing capability declarations
- semantic mapping rules
- anti-confusion rules
- parameter binding rules

Recommended active rules:

- `10-api-overview.md`
- `11-workflow-phases.md`
- `13-api-hard-constraints.md`
- `20-authentication-and-security.md`
- `30-common-response-contracts.md`
- high-frequency module files such as document, folder, and BOM

Optional active rules:

- `50-crownscript-api.md`
- `70-drawing-api.md`
- `90-topology-structure-and-query-api.md`

Keep optional module files active only when they are common enough to justify always being present in the mode prompt.

## What Should Not Live In Active Rules

Do not keep long authoring or process guidance in active rules when it is not required for normal task execution.

Move or keep outside active rules:

- rule authoring guides
- checklist-style validation documents
- long scaffold commentary
- repetitive explanatory prose that does not change runtime behavior

These documents are still useful, but they should live in `docs/` instead of the active rule directory when prompt size becomes a problem.

Recommended docs location for these heavier HUAYUN guides:

- `docs/huayun-secondary-dev-guides/`

## What Belongs In Skills

The current HUAYUN skill layer should remain thin.

A thin skill may:

- explain when to use the HUAYUN mode
- point the model toward the rules directory
- describe high-level workflow phases

A thin skill must not:

- duplicate full API definitions
- duplicate hard constraints that already exist in rules
- maintain an exported `references/` tree that can drift from the rules

In short:

- rules hold API truth
- skill should only help navigation

## What Belongs In AGENTS.md

`AGENTS.md` should remain short and repository-wide.

It is appropriate to keep in `AGENTS.md`:

- repo-wide implementation pitfalls
- high-value architectural invariants
- one short note about the HUAYUN rules source of truth

It is not appropriate to copy full HUAYUN API materials into `AGENTS.md`.

## Single-Source Rule

- HUAYUN API truth should exist in one primary place: `.roo/rules-huayun-secondary-dev/`
- If any auxiliary copy is created later, update it in the same change
- If an auxiliary copy cannot be kept synchronized, delete it instead of letting it drift

## Update Workflow

When a HUAYUN API contract changes:

1. Update the relevant module rule
2. Update `10-api-overview.md` if current known scope changed
3. Update `13-api-hard-constraints.md` if the capability is easy to misjudge
4. Do not create a second API truth source unless there is a specific operational reason

## Current Recommendation

For this repository, the recommended design is:

- use a built-in HUAYUN mode with rules-first runtime constraints
- keep AGENTS.md minimal
- keep the current thin HUAYUN skill as a router to rules rather than a second knowledge base
- do not restore the previous duplicated HUAYUN skill/exported-reference stack
