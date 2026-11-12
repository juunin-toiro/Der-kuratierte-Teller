# Architecture decision log
Use `CONFIRMED`, `PROPOSED`, `REJECTED`, `SUPERSEDED`. Record rationale, alternatives and consequences.

## D-001 — Design system
Date: 2026-11-12 | Status: CONFIRMED
Decision: Use supplied palette, type families, bee/hex motif, interactions, and centralized tokens in `src/css/abstracts/variables.css`.
Rationale: explicit user design specification.

## D-002 — Static-first architecture
Date: 2026-11-12 | Status: CONFIRMED for Astro, plain CSS, npm (MDX, CMS, host still OPEN)
Decision: Astro + Markdown/MDX + Cooklang + small JS islands, statically hosted.
Rationale: low maintenance, cost and transfer overhead; maximum design control.
Alternatives: Ghost, WordPress, headless CMS, full-stack React.

## D-003 — Nutritional data separation
Date: 2026-11-12 | Status: PROPOSED
Decision: Keep nutrition datasets/provenance separate from Cooklang authoring and affiliate links.
Rationale: traceability, correctness, portability.

## D-004 — Visual editor
Date: 2026-11-12 | Status: CONFIRMED — Pages CMS (Git-based, no backend). Keystatic GitHub mode needs Node API routes, so it was rejected for now.
Alternatives: Decap CMS, Keystatic (local only without backend).

## D-005 — Content model
Date: 2026-11-12 | Status: CONFIRMED
Types: Rezept, Blogpost, Lebensmittel (Smart-Fuel), Kategorie (= Serie, optional per recipe), About me, Quelle. One file per entry. Recipe = frontmatter + Cooklang body; Cooklang parsed at build time with `@tmlmt/cooklang-parser`.
Recipe fields: title, geschmack (suess/herzhaft), eigenschaften, kategorien (optional), gesamtzeit (required), aktivzeit (optional), portionen, optional image with required alt text.

## D-006 — Filters
Date: 2026-11-12 | Status: CONFIRMED
Row 1 Alle/süss/herzhaft (single), row 2 Eigenschaften (multi, AND): laktosefrei, proteinreich, low-carb, schnell, glutenfrei, vegetarisch; row 3 Kategorie dropdown (multi, OR). `schnell` is derived: gesamtzeit <= 15. Dropped tags: keto, brainfood (keep as blog topic), blutzuckerfreundlich, weniger-spitzen, Frühstück, Snacks, news, rezepte, kalkulator.

## D-007 — Colour of tag groups (supersedes the earlier mapping in designSystem.md)
Date: 2026-11-12 | Status: CONFIRMED
Ernährung (proteinreich, low-carb, vegetarisch) = green; Verträglichkeit (laktosefrei, glutenfrei) = orange; Zeit (schnell) = accent. Filter and tag text stays ink/bg (no text in category colours).

## D-008 — Nutrition and GL are computed (planned, not built)
Date: 2026-11-12 | Status: CONFIRMED, NOT IMPLEMENTED
Nutrients and GL per recipe are computed from ingredients linked to Lebensmittel entries (by name variants). Units g, ml, EL, TL, Sachet, Stück via density and per-food grams. No gaps allowed: missing food, unit conversion or required nutrient stops the build with all errors listed. Net carbs = brutto - Ballaststoffe (fibre required). Nutrient catalogue defines name, unit, group and required/optional; start set: kcal, Eiweiß, Fett, gesättigte Fettsäuren, KH brutto, Zucker, Ballaststoffe, Salz. GL per portion = sum(GI x net carbs g / 100), shown as an approximation. Calculator: GL bands <=10 / <20 / >=20, advice protein 0.5 x carbs and fat 0.3 x carbs worded "kann helfen" with "Orientierungswert" note.

## D-009 — Hosting
Date: 2026-11-12 | Status: PROPOSED/started — GitHub Pages via GitHub Actions; custom domain, cost and limits not verified.

## D-010 — TypeScript
Date: 2026-11-12 | Status: CONFIRMED by user ("ja, TypeScript").
All project scripts are TypeScript (`src/lib/*.ts`, `src/scripts/filters.ts`, inline script in `index.astro`); `astro.config.mjs` stays `.mjs`. Dev dependencies `typescript` and `@astrojs/check`; `tsconfig.json` extends `astro/tsconfigs/strict`. Run `npm run check` before commits. New code (nutrition, GL) is written typed from the start.
