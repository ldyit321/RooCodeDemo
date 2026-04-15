---
name: huayun-secondary-development
description: CrownCAD and HUAYUN secondary development workflow for CAD engineering users, OAuth2-first customization, scaffold-based frontend and Python backend implementation, platform API integration, and Run/Package delivery rules. Use when tasks involve HUAYUN-specific secondary development, concise CAD/business requests from non-developer users, CrownCAD document, folder, drawing, BOM, topology, structure, query, supplemental CrownScript APIs, architecture continuation, or validating whether work follows the HUAYUN secondary-dev constraints.
modeSlugs:
    - huayun-secondary-dev
---

# Huayun Secondary Development

Follow this skill when working on HUAYUN-specific secondary development in `huayun-secondary-dev`.

## Workflow

1. Treat the request as HUAYUN/CrownCAD secondary development by default, not generic app generation.
2. If no mode is explicitly supplied, assume `huayun-secondary-dev`; do not drift into Code, Architect, or generic OAuth behavior.
3. Accept concise CAD/business wording from engineering designers and translate it into the technical workflow internally.
4. Do not make users repeat OAuth2, stack, API, scaffold, run, package, or security constraints already defined by this mode.
5. Do not ask the user to restate that HUAYUN mode is active, that configured Secondary Dev settings should be used, that frontend handles OAuth browser entry/callback, that backend owns token exchange and token storage, or that missing APIs must be reported instead of fabricated; treat all of those as built-in defaults.
6. Ask follow-up questions only for missing business decisions, destructive actions, or genuinely ambiguous requirements.
7. Start with OAuth2 planning or implementation unless the user explicitly says auth is already complete for this task.
8. Classify the task as one of:
    - design-first
    - implementation
    - runtime verification
    - packaging
9. Keep design-first tasks focused on auth, module boundaries, scaffold choice, and delivery order.
10. Keep normal implementation tasks focused on code and structure. Do not automatically start long-running services.
11. Use the dedicated run flow for runtime checks and the dedicated package flow for packaging checks.
12. Extend the previously established HUAYUN structure when the task continues an earlier design or implementation.

## User Simplicity Defaults

- Treat short user prompts as valid requirements, especially from CAD engineering designers.
- Internally expand phrases like "做个文件夹管理工具", "查一下图纸", "跑一下看看", or "帮我打包" into the HUAYUN workflow without asking the user to restate technical defaults.
- Prefer short, actionable Chinese responses for users unless they ask for technical detail.
- Do not ask the user to provide OAuth2, base URL, frontend redirect URL, token URL, client ID, client secret, stack, scaffold, run, or package details when those are already available in settings, rules, or project files.
- Ask the user only when a business choice is missing, an operation may delete or overwrite data, or the API/materials genuinely do not define the needed capability.

## Configuration Defaults

- Read Secondary Dev settings or generated prompt context before asking for platform configuration.
- Treat configured `baseUrl`, authorization URL/path, token URL/path, frontend OAuth redirect URL, client ID, client secret, and scope as the source of truth.
- If Client Secret is configured, never ask the user to paste it in chat.
- If generated standalone code cannot read extension settings directly, create a backend `.env` file or `.env` template plus a backend-only environment/config binding and explain that deployment must bind the configured secret.
- If configured secret reading fails, never fall back to writing the secret literal into project files.
- Keep `client_secret` backend-only; never put it in frontend code, browser storage, logs, docs, or generated examples.

## Stack Rules

- Prefer frontend as `Vue` by default.
- Use plain `JavaScript + HTML/CSS` only for very small, mostly static, or explicitly native-frontend tasks.
- Keep backend and integrations in `Python` unless the user explicitly asks for another stack.
- Do not default to React, TypeScript-by-default, or Node.js backend frameworks.

## Architecture Rules

- Start new work from the HUAYUN scaffold instead of inventing a new folder layout.
- Keep auth, request/client logic, services, routes, and UI code separated.
- Keep OAuth2 logic in dedicated auth modules.
- Default to an authorization entry URL shaped like `{baseUrl}/{authorizePath}?applicationId=<applicationId>&redirectUrl=<redirectUrl>`.
- Resolve `redirectUrl` from the configured Frontend OAuth Redirect URL.
- Treat the frontend OAuth redirect URL as the redirect address used by generated frontend services.
- Implement and register the exact frontend callback path implied by the configured Frontend OAuth Redirect URL; do not omit the frontend route/path segment.
- Keep the HUAYUN authorization entry parameter names as `applicationId` and `redirectUrl`; do not silently rewrite them to `client_id` or `redirect_uri`.
- Default to a token endpoint URL shaped like `{baseUrl}/{tokenPath}`.
- Exchange `code` for token with `POST {baseUrl}/{tokenPath}` using `application/x-www-form-urlencoded` fields `grant_type`, `code`, `client_id`, `client_secret`, and `client_scope`.
- Map callback `scope` to token form field `client_scope`; do not use `scope` or `state` as default token exchange fields.
- Default to a callback contract where the configured Frontend OAuth Redirect URL receives `code` and `scope` query parameters after authorization.
- Put OAuth browser entry and callback parsing in the frontend by default.
- Let the frontend call the backend with `code` and `scope`; only the backend should exchange token with `client_secret`.
- Never expose `client_secret` to frontend/browser code.
- Keep final OAuth tokens backend-only; frontend should work through backend session, cookie, or proxy endpoints instead of receiving raw token values.
- Do not assume the platform callback returns `state` unless the user explicitly confirms that their platform does.
- If Client Secret is configured in Secondary Dev settings, do not ask the user to paste it in chat.
- For generated standalone backend projects, write HUAYUN secondary-development configuration into backend `.env` / `.env.example` by default and load it through a centralized backend settings module.
- Populate OAuth `client_secret` from the configured secret/config source, backend secret provider, or environment binding such as `HUAYUN_CLIENT_SECRET`.
- Never hardcode, print, log, or expose the raw Client Secret in generated code, docs, or responses.
- If a standalone generated project cannot read extension settings directly, report that secret binding is required and create only a backend-only placeholder/config interface.
- Centralize upstream CrownCAD API calls in request/client layers.
- Mark missing APIs explicitly instead of inventing endpoints.
- When an API is missing, report the missing capability, closest known APIs, safely scaffoldable parts, and blocked code paths instead of generating fake upstream calls.
- Distinguish standalone system `Folder` resources from document-type `FolderDocument`; use `FolderDocument` for project-internal folders, document folders, or document tree folders.
- Treat current document management APIs as including batch query, detail query, project query, create, rename, and delete; do not mark those basic document capabilities as missing.

## API Discipline

- Reuse only the APIs already provided by the project materials.
- Treat the latest OpenAPI snapshot as the primary source of truth for current API scope.
- For this project, inspect the current workspace rule set first, especially `.roomodes`, `.roo/rules-huayun-secondary-dev`, and `.roo/skills`.
- Do not prefer user-home rule directories such as `C:\Users\admin\.roo\...` when the current workspace already contains the relevant HUAYUN rules or skills.
- Use user-home or global rule directories only as a fallback when the current workspace does not contain the needed HUAYUN rule material.
- Treat `.roo/...` and `.roomodes` paths as internal implementation details unless the user explicitly asks for them.
- In normal user-facing answers, say `current project rule materials` or `current project configuration` instead of assuming the user knows internal rule directory names.
- When the user asks whether rule materials define an API, contract, field, enum, or capability, treat the task as rule-material lookup by default, not as business implementation-code lookup.
- For rule-material lookup tasks, answer the rule-material conclusion first, and only then optionally state whether business code has already implemented it.
- If concluding that rule materials do not define an interface or contract, provide the lookup basis instead of inferring from missing implementation code.
- When the task asks whether an API, request contract, field, enum, or capability exists, inspect HUAYUN rule materials first, especially `.roo/rules-huayun-secondary-dev`, `.roo/skills`, and exported skill references, before concluding from business implementation code.
- Distinguish `present in rules/materials` from `already implemented in business code`.
- Do not answer `not found` or `missing API material` merely because `src`, `webview-ui`, backend, or other implementation directories do not yet contain a concrete wrapper or usage site.
- When multiple HTTP methods share the same path, do not determine API semantics from URL alone.
- For same-path multi-method interfaces, determine semantics by `Method + Path` together.
- Do not collapse `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` on the same path into one generic endpoint meaning.
- If an API path, method, request field, response field, enum, or workflow step is not present in the provided materials, stop and report the missing contract instead of inventing it.
- Treat current document APIs as known provided APIs:
    - `GET /api/document/`
    - `POST /api/document/`
    - `GET /api/document/{documentId}`
    - `GET /api/document/project/{projectId}`
    - `POST /api/document/rename`
    - `DELETE /api/document/document`
- Treat standard system Folder APIs as known provided APIs: `GET /api/folder`, `POST /api/folder`, `POST /api/folder/{folderId}/share`, `PATCH /api/folder/{folderId}/name`, and `DELETE /api/folder/{folderId}`.
- Do not say Folder query, create, share, rename, or delete APIs are missing when the task targets standalone system folders.
- Do not say basic document batch query, detail query by `documentId`, project query by `projectId`, create, rename, or delete APIs are missing when the task targets document resources.
- Treat these document capabilities as explicitly non-missing and already available:
    - document detail by `documentId`
    - project document query by `projectId`
    - document rename by `documentId` + `documentName`
- Treat these BOM document attribute manifest capabilities as explicitly non-missing and already available:
    - attribute list by `documentId`
    - attribute insert by `documentId` + `attributeName` + `attributeType` + `variable`
    - attribute update by `documentId` + `attributeName` + `attributeType` + `variable`
    - attribute delete by `documentId` + `attributeName`
- Use the known manifest endpoints exactly:
    - `GET /api/bom/documentAttributeManifest`
    - `PUT /api/bom/documentAttributeManifest`
    - `POST /api/bom/documentAttributeManifest`
    - `DELETE /api/bom/documentAttributeManifest`
- Treat current `documentAttributeManifest` requests as query-parameter-based, not body-based.
- Treat `GET /api/bom/documentAttributeManifest` as query-all-custom-attributes by `documentId` only.
- Treat `PUT /api/bom/documentAttributeManifest` as modify-existing-custom-attribute only.
- Treat `POST /api/bom/documentAttributeManifest` as insert-new-custom-attribute only.
- Treat `DELETE /api/bom/documentAttributeManifest` as delete-one-custom-attribute by `documentId` + `attributeName` only.
- Keep BOM manifest `attributeType` constrained to `文本`, `数值`, `是否`, and `日期` unless newer material expands it.
- If the user explicitly provides `documentId`, bind it directly to the BOM manifest query parameter `documentId`.
- Apply this fixed semantic mapping for `documentAttributeManifest` before doing generic API inference:
    - `属性列表`, `文档属性列表`, `查询属性`, `查询文档属性`, `获取属性列表`, `获取文档属性`, `加载属性列表`, `加载属性清单` -> `GET /api/bom/documentAttributeManifest`
    - `新增属性`, `添加属性`, `新建属性`, `新增一条属性`, `增加文档属性` -> `POST /api/bom/documentAttributeManifest`
    - `修改属性`, `编辑属性`, `更新属性`, `写入属性`, `保存属性修改`, `行级按钮写入属性` -> `PUT /api/bom/documentAttributeManifest`
    - `删除属性`, `移除属性`, `删除一条属性`, `移除一条属性` -> `DELETE /api/bom/documentAttributeManifest`
- Do not map the `documentAttributeManifest` query/list keyword group to `POST`, `PUT`, or `DELETE`.
- Do not invent a separate `attributeValue` request field for `documentAttributeManifest`; use the documented `variable` parameter only.
- Do not invent upstream paths, request fields, response fields, enum values, or workflow steps that are not present in the provided API material.
- If the user explicitly provides 项目id / `projectId`, bind it directly to `projectId`; if the user explicitly provides 文档id / `documentId`, bind it directly to `documentId`.
- Do not swap or silently remap an explicitly provided `projectId` and `documentId`.
- Keep document `docType` constrained to known values such as `PartDocument`, `AssemblyDocument`, `DrawingDocument`, and `FolderDocument` unless newer source material expands them.
- Treat common response handling as `code / message / data`.
- Treat CrownScript as a supplemental interface when a task explicitly depends on earlier materials.
- Keep CrownScript requests as `multipart/form-data` when that endpoint is in scope.
- Validate request shapes and enums instead of guessing fields.

## Read These Files When Needed

- Read [references/stack-and-delivery.md](references/stack-and-delivery.md) for the full HUAYUN delivery contract.
- Read [references/11-workflow-phases.md](references/11-workflow-phases.md) for phase boundaries.
- Read [references/12-continuity-and-boundaries.md](references/12-continuity-and-boundaries.md) when continuing a previous design.
- Read [references/13-api-hard-constraints.md](references/13-api-hard-constraints.md) before inventing any platform behavior.
- Read [references/15-standard-architecture.md](references/15-standard-architecture.md) for default layering.
- Read [references/16-frontend-selection-matrix.md](references/16-frontend-selection-matrix.md) when deciding between plain frontend and Vue.
- Read [references/17-standard-scaffold-template.md](references/17-standard-scaffold-template.md) before creating new project structure.
- Read [references/20-authentication-and-security.md](references/20-authentication-and-security.md) for OAuth2 expectations.
- Read [references/30-common-response-contracts.md](references/30-common-response-contracts.md) for response handling.
- Read [references/40-document-management-api.md](references/40-document-management-api.md) for document APIs.
- Read [references/50-crownscript-api.md](references/50-crownscript-api.md) for supplemental CrownScript APIs.
- Read [references/60-folder-management-api.md](references/60-folder-management-api.md) for folder APIs.
- Read [references/70-drawing-api.md](references/70-drawing-api.md) for drawing APIs.
- Read [references/80-bom-api.md](references/80-bom-api.md) for BOM APIs.
- Read [references/90-topology-structure-and-query-api.md](references/90-topology-structure-and-query-api.md) for topology, structure, and query APIs.
- Read [references/huayun-secondary-dev-regression-test-cases.md](references/huayun-secondary-dev-regression-test-cases.md) when validating recent regressions.

## Output Expectations

- State assumptions when docs or APIs are incomplete.
- Prefer concise stage-aware responses instead of repeating the whole rule set.
- Tell the user whether the task is design-only, code-only, run-oriented, or package-oriented.
- For non-developer CAD users, hide internal technical boilerplate unless it affects their decision or verification.
- End by stating what was implemented, what was assumed, and what still needs manual verification.
