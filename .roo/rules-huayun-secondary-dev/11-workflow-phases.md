# HUAYUN Workflow Phases

This file defines the default validation and delivery phase behavior for `huayun-secondary-dev`.

## Goal

- Keep design, implementation, runtime validation, and packaging work separated
- Prevent the mode from starting long-running services too early
- Make scenario-based verification consistent across repeated tasks
- Keep prompt-time rule lookup, API understanding, and execution responsibilities separated
- Avoid oversized single-turn reasoning chains that increase latency or stream failure risk
- Prefer narrow, staged delivery over one-shot expansion into every adjacent task

## Default Phase Rules

### Phase 0: Prompt And Rule Resolution

- Before design or implementation, resolve the task through the HUAYUN prompt route first:
    - mode and runtime settings
    - current workspace HUAYUN rules
    - relevant module rule file
    - thin skill and `AGENTS.md` as supplements
- If the user is asking whether an API, field, enum, or capability exists, answer from rule materials first before falling back to business implementation code.
- Do not treat missing implementation wrappers as proof that the upstream contract is missing.
- Resolve only the minimum rule layers needed to answer the current question.
- If an earlier authoritative HUAYUN rule layer already answers the question, stop there instead of continuing broad exploration.
- Keep prompt-time analysis concise and conclusion-first; do not expand into long narrative analysis unless the user explicitly asks for deep explanation.

### Phase A: Authentication And Architecture Design

- When the task is explicitly about planning, architecture, or OAuth2 setup validation, prioritize design output over full business implementation
- In this phase, prefer:
    - OAuth2 flow selection
    - callback and token strategy
    - auth module boundaries
    - request/client layout
    - manual validation plan
- In this phase, do not automatically expand into full feature implementation unless the user explicitly asks for code
- In this phase, prefer short design decisions, clear assumptions, and the next concrete step instead of exhaustive design prose.

### Phase B: Code And Structure Delivery

- When the task is about implementing a feature, focus on code structure, module boundaries, API wiring, and validation logic
- For backend code generation, prefer following the package structure and import style that the current project already establishes instead of introducing a parallel style in the same service.
- If the current backend already presents a clear package root such as `app/`, treat that structure as the default reference point for new modules and imports unless the local project layout indicates a better fit.
- Prefer consistency and actual runnability over forcing one universal Python import style across every project.
- For frontend-backend integration work, verify the request path, HTTP method, parameter location, and base URL source together instead of treating API wiring as path-only matching.
- When frontend code depends on a proxy target, backend base URL, or runtime redirect/base configuration, prefer current project configuration and runtime-verifiable values over guessed localhost ports or guessed route prefixes.
- Do not hardcode a frontend proxy target or backend route prefix unless the current project configuration, runtime settings, or authoritative rule material confirms it.
- During code-delivery phases, do not automatically start long-running frontend or backend services unless the user explicitly asks to run them now
- If runtime commands are useful, explain them or prepare them, but do not proactively launch long-running servers during ordinary code-delivery scenes
- Default to the smallest viable code change that satisfies the current request.
- Do not automatically bundle adjacent optimizations, refactors, documentation rewrites, or extra cleanup into the same turn unless they are necessary to make the requested change work.
- If the requested feature is large, ambiguous, or spans multiple subsystems, prefer staged delivery:
    - first implement the smallest verifiable slice
    - then extend in follow-up steps only when needed
- Keep implementation summaries concise; do not spend large response budgets narrating code that has already been written.

### Phase C: Runtime Verification

- Use runtime execution only when the user explicitly asks to run, preview, validate, or when the dedicated run flow is being used
- Prefer the dedicated `Run secondary dev workspace` action for runtime verification instead of starting servers during unrelated implementation scenes
- During runtime validation, verify only the services and checkpoints needed for the current task.
- Do not automatically add broad extra validation passes when a narrower readiness check is sufficient.
- For frontend-backend linked tasks, do not treat `page opened successfully` as sufficient validation when the task depends on API calls, proxy forwarding, or backend route wiring.
- When the current task depends on frontend requests reaching backend services, prefer a narrow verification that the frontend request target can accurately reach the intended backend route.
- If runtime validation reveals that the frontend can open but the backend route target is still inaccurate or unreachable, report that as an integration failure instead of reporting the feature as successfully runnable.

### Phase D: Packaging

- Use packaging steps only when the user explicitly asks for packaging, deployment preparation, artifact generation, or when the dedicated package flow is being used
- Prefer the dedicated `Package secondary dev workspace` action for packaging validation instead of triggering build and packaging steps during ordinary implementation scenes
- Keep packaging flows focused on producing the requested artifact; avoid coupling packaging with unrelated redesign or cleanup work.

## Scenario-Oriented Defaults

- If the task is equivalent to "scene 1" style validation, treat it as design-first and architecture-first unless the user explicitly requests code
- If the task is equivalent to "scene 2-5" style implementation validation, generate code and structure but do not automatically launch long-running runtime processes
- If the task is equivalent to "scene 6" style validation, runtime execution is allowed and expected
- If the task is equivalent to "scene 7" style validation, packaging is allowed and expected

## Execution Efficiency Defaults

- Prefer one focused objective per turn instead of combining implementation, runtime, packaging, reporting, and documentation unless the user explicitly asks for the full bundle.
- If the task naturally decomposes into stages, finish the current stage cleanly before expanding to the next.
- Prefer short, high-signal explanations over long chain-of-thought style narration.
- Treat stability and bounded latency as delivery requirements in HUAYUN secondary development, especially for long-running or tool-heavy tasks.
