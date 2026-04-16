# HUAYUN Workflow Phases

This file defines the default validation and delivery phase behavior for `huayun-secondary-dev`.

## Goal

- Keep design, implementation, runtime validation, and packaging work separated
- Prevent the mode from starting long-running services too early
- Make scenario-based verification consistent across repeated tasks
- Keep prompt-time rule lookup, API understanding, and execution responsibilities separated

## Default Phase Rules

### Phase 0: Prompt And Rule Resolution

- Before design or implementation, resolve the task through the HUAYUN prompt route first:
    - mode and runtime settings
    - current workspace HUAYUN rules
    - relevant module rule file
    - thin skill and `AGENTS.md` as supplements
- If the user is asking whether an API, field, enum, or capability exists, answer from rule materials first before falling back to business implementation code.
- Do not treat missing implementation wrappers as proof that the upstream contract is missing.

### Phase A: Authentication And Architecture Design

- When the task is explicitly about planning, architecture, or OAuth2 setup validation, prioritize design output over full business implementation
- In this phase, prefer:
    - OAuth2 flow selection
    - callback and token strategy
    - auth module boundaries
    - request/client layout
    - manual validation plan
- In this phase, do not automatically expand into full feature implementation unless the user explicitly asks for code

### Phase B: Code And Structure Delivery

- When the task is about implementing a feature, focus on code structure, module boundaries, API wiring, and validation logic
- During code-delivery phases, do not automatically start long-running frontend or backend services unless the user explicitly asks to run them now
- If runtime commands are useful, explain them or prepare them, but do not proactively launch long-running servers during ordinary code-delivery scenes

### Phase C: Runtime Verification

- Use runtime execution only when the user explicitly asks to run, preview, validate, or when the dedicated run flow is being used
- Prefer the dedicated `Run secondary dev workspace` action for runtime verification instead of starting servers during unrelated implementation scenes

### Phase D: Packaging

- Use packaging steps only when the user explicitly asks for packaging, deployment preparation, artifact generation, or when the dedicated package flow is being used
- Prefer the dedicated `Package secondary dev workspace` action for packaging validation instead of triggering build and packaging steps during ordinary implementation scenes

## Scenario-Oriented Defaults

- If the task is equivalent to "scene 1" style validation, treat it as design-first and architecture-first unless the user explicitly requests code
- If the task is equivalent to "scene 2-5" style implementation validation, generate code and structure but do not automatically launch long-running runtime processes
- If the task is equivalent to "scene 6" style validation, runtime execution is allowed and expected
- If the task is equivalent to "scene 7" style validation, packaging is allowed and expected
