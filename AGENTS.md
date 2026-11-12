# Agent instructions — Der kuratierte Teller

Read `memory-bank/projectbrief.md`, `activeContext.md`, `designSystem.md`, `systemPatterns.md`, and `techContext.md` before changing code. Read other files relevant to the task.

## Operating contract
- Treat **CONFIRMED** as user decisions, **PROPOSED** as recommendations, and **OPEN** as unresolved. Never silently promote a proposal to a decision.
- Inspect the actual repository before assuming a file, dependency, feature or deployment exists.
- Plan first for multi-file, architectural, data-model, or accessibility changes; obtain approval before irreversible changes.
- Keep changes small, reversible, and testable. Never overwrite existing work without checking diffs.
- Source of truth for design tokens: `src/css/abstracts/variables.css`. Never invent additional colors or duplicate token values.
- Prefer semantic HTML, progressive enhancement, keyboard access, and minimal client-side JS.
- Do not invent nutrition values, health outcomes, food allergy safety, or affiliate program availability.
- After changes: run available checks, report results honestly, and update `activeContext.md` and `progress.md`; record consequential decisions in `decisions.md`.
- Do not store secrets, API keys, personal medical data, or user profiles in the memory bank.
