# Architecture decision log
Use `CONFIRMED`, `PROPOSED`, `REJECTED`, `SUPERSEDED`. Record rationale, alternatives and consequences.

## D-001 — Design system
Date: 2026-11-12 | Status: CONFIRMED
Decision: Use supplied palette, type families, bee/hex motif, interactions, and centralized tokens in `src/css/abstracts/variables.css`.
Rationale: explicit user design specification.

## D-002 — Static-first architecture
Date: 2026-11-12 | Status: PROPOSED
Decision: Astro + Markdown/MDX + Cooklang + small JS islands, statically hosted.
Rationale: low maintenance, cost and transfer overhead; maximum design control.
Alternatives: Ghost, WordPress, headless CMS, full-stack React.

## D-003 — Nutritional data separation
Date: 2026-11-12 | Status: PROPOSED
Decision: Keep nutrition datasets/provenance separate from Cooklang authoring and affiliate links.
Rationale: traceability, correctness, portability.

## D-004 — Visual editor
Date: 2026-11-12 | Status: OPEN
Decision: determine whether Git-based file editing or a small visual CMS is preferred.
