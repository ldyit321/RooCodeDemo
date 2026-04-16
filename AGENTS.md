# AGENTS.md

This file provides guidance to agents when working with code in this repository.

- Settings View Pattern: When working on `SettingsView`, inputs must bind to the local `cachedState`, NOT the live `useExtensionState()`. The `cachedState` acts as a buffer for user edits, isolating them from the `ContextProxy` source-of-truth until the user explicitly clicks "Save". Wiring inputs directly to the live state causes race conditions.
- HUAYUN Rules Source: For `huayun-secondary-dev`, treat `.roo/rules-huayun-secondary-dev/` as the primary local source of truth. Do not reintroduce duplicated HUAYUN API definitions under `.roo/skills` or `exports/skills` unless the task explicitly requires a separate skill layer.
