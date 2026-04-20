# Frontend Selection Matrix

This file defines the frontend selection rule for `huayun-secondary-dev`.

## Default Principle

- Do not choose a frontend stack arbitrarily
- In HUAYUN secondary development, frontend implementation must use Vue
- Do not choose plain JavaScript plus HTML/CSS as the primary frontend delivery path
- Even small or page-local frontend features should stay inside the Vue structure so the scaffold, auth flow, and later expansion remain consistent

## Decision Table

| Situation                               | Required Choice | Reason                                                       |
| --------------------------------------- | --------------- | ------------------------------------------------------------ |
| New frontend page or module             | Vue             | Matches the built-in HUAYUN stack policy                     |
| Existing HUAYUN frontend feature update | Vue             | Keeps architecture and scaffolds consistent                  |
| Small one-page utility                  | Vue             | Avoids splitting the delivery model into two frontend stacks |
| Multi-step or shared-state module       | Vue             | Vue is already the required and appropriate choice           |

## Mandatory Reuse Rules

- If the existing target module already uses Vue, continue with Vue
- If you encounter older plain JS or HTML/CSS frontend code in a target project, prefer integrating the new HUAYUN feature through the Vue scaffold instead of extending plain-page patterns by default
- Do not introduce a second plain-page frontend track for new HUAYUN delivery work

## Anti-Patterns

- Do not justify plain frontend delivery by calling the page "small" or "simple"
- Do not create new `plain-frontend` style feature folders for HUAYUN tasks
- Do not mix a Vue page with ad hoc duplicated DOM-manipulation scripts for the same feature
- Do not spread business logic across templates, inline scripts, and scattered request calls

## Tie-Breaker Rule

- If the decision is unclear, choose Vue
