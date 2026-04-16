# HUAYUN Continuity And Execution Boundaries

This file defines continuity requirements for `huayun-secondary-dev`.

## Architecture Continuity

- When a new task clearly continues a previously designed or implemented HUAYUN secondary development feature, inherit the previously established architecture unless the user explicitly asks to redesign it
- Later tasks may refine, expand, or concretize the previous architecture, but should not silently replace it with a conflicting structure
- It is acceptable to:
    - add missing files
    - split broad modules into clearer modules
    - rename files to fit repository conventions
    - fill in placeholders from earlier design work
- It is not acceptable to silently change:
    - frontend stack choice
    - backend stack choice
    - OAuth2 module placement
    - route/service/client boundaries
    - whether the frontend talks directly to CrownCAD or through a Python proxy

## Required Continuity Behavior

- If a previous design exists, say that the current implementation is continuing that design
- If the current task needs to differ from the previous design, explain why and call out the change instead of silently drifting
- If the repository structure forces a small adjustment, keep the architecture intent unchanged and explain the adjustment briefly

## Execution Boundaries

- Do not mix code-generation scenes with long-running server startup scenes unless the user explicitly combines them
- Do not let feature implementation get blocked on starting a development server if the current request is primarily about architecture or code output
- When runtime validation is deferred, state the exact commands or button path that should be used later
