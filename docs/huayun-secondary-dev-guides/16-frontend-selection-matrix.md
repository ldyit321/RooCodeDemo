# Frontend Selection Matrix

This file defines when `huayun-secondary-dev` should choose plain JavaScript plus HTML/CSS and when it should choose Vue.

## Default Principle

- Do not choose a frontend stack arbitrarily
- Choose the lightest frontend solution that still keeps the feature maintainable
- Prefer plain JavaScript plus HTML/CSS for simple, localized, low-state pages
- Prefer Vue for medium or large interactive modules, reusable component systems, or multi-view UI flows

## Decision Table

| Situation                                                                                       | Preferred Choice            | Reason                                          |
| ----------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------- |
| Single page, low interaction, a few buttons or form fields                                      | Plain JavaScript + HTML/CSS | Lowest complexity and fastest delivery          |
| Static or mostly static information display page                                                | Plain JavaScript + HTML/CSS | Vue would add unnecessary structure             |
| Small admin tool or simple detail page with limited state                                       | Plain JavaScript + HTML/CSS | Easier to keep lightweight and readable         |
| One-off integration page with only a few API calls                                              | Plain JavaScript + HTML/CSS | Shared request helpers are enough               |
| Page has multiple interactive regions sharing state                                             | Vue                         | Better state coordination and maintainability   |
| Requires reusable UI components across multiple pages                                           | Vue                         | Component reuse becomes important               |
| Multi-step workflow, wizard, or complex form flow                                               | Vue                         | Easier to manage reactive state and transitions |
| Search, filter, tabs, pagination, drawers, dialogs, and dynamic panels are all present together | Vue                         | Better structure for medium-complexity UI       |
| Feature is expected to grow into a module, not just a page                                      | Vue                         | Better long-term extensibility                  |
| Existing frontend area is already implemented with Vue                                          | Vue                         | Follow existing project conventions             |
| Existing frontend area is plain JS/HTML/CSS                                                     | Plain JavaScript + HTML/CSS | Avoid unnecessary rewrites                      |

## Mandatory Reuse Rules

- If the existing target module already uses Vue, continue with Vue unless the user explicitly asks for another approach
- If the existing target module already uses plain JavaScript plus HTML/CSS, continue with that approach unless there is a strong reason to escalate to Vue
- Do not introduce Vue into a plain lightweight feature without a maintainability reason
- Do not downgrade an existing Vue module into plain JS just because a single change is small

## Escalation Signals For Vue

Choose Vue when two or more of the following are true:

- Shared state exists across multiple UI regions
- The page needs reusable components
- The feature includes multiple interaction modes
- The feature likely expands to more pages or submodules
- Plain DOM code would become difficult to read or maintain

## Stay Plain Signals

Stay with plain JavaScript plus HTML/CSS when most of the following are true:

- One page only
- Limited state
- Minimal component reuse
- Straightforward request/response rendering
- No complex multi-step workflow

## Anti-Patterns

- Do not choose Vue only because it is "more modern"
- Do not choose plain JS for a clearly component-heavy module just to save setup time
- Do not mix a Vue page with ad hoc duplicated DOM-manipulation scripts for the same feature
- Do not spread business logic across templates, inline scripts, and scattered request calls

## Tie-Breaker Rule

- If the decision is unclear, first follow the existing module's frontend stack
- If there is no existing module to follow, default to plain JavaScript plus HTML/CSS for simple features and Vue for medium-complexity or reusable modules
