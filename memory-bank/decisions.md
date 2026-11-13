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
Row 1 Alle/süss/herzhaft (single), row 2 Eigenschaften (multi, AND): proteinreich, low-carb, schnell, glutenfrei, vegetarisch; row 3 Kategorie dropdown (multi, OR). `schnell` is derived: gesamtzeit <= 15. Dropped tags: keto, brainfood (keep as blog topic), blutzuckerfreundlich, weniger-spitzen, Frühstück, Snacks, news, rezepte, kalkulator.

## D-007 — Colour of tag groups (supersedes the earlier mapping in designSystem.md)
Date: 2026-11-12 | Status: CONFIRMED
Ernährung (proteinreich, low-carb, vegetarisch) = green; Verträglichkeit (glutenfrei) = orange; Zeit (schnell) = accent. Filter and tag text stays ink/bg (no text in category colours).

## D-008 — Nutrition and GL are computed
Date: 2026-11-12, updated 2026-11-14 | Status: IMPLEMENTED (recipes + calculator)
Source: `Lebensmittel_GI_GL_Website_Datenbasis_FINAL.xlsx` (sheet "Lebensmittel", 1331 foods, Swiss nutrient database + GI evidence). Import: `node scripts/import-lebensmittel.mjs <xlsx>` writes `src/data/lebensmittel.json` (id, name, synonyms, GI, GL/100 g, available carbs, kcal, fat, protein, sugar, fibre, evidence; "Sp." = 0). Micronutrient sheet NOT imported (same IDs, later).
Linking: every Cooklang ingredient name must be in `src/data/zutaten.json` (name -> food ID; `{id, stueck}` = grams per piece for amounts without g/ml/EL/TL; `0` = deliberately no value, e.g. spice/water/sweetener; `null` = missing in the database, listed on the recipe page as "ohne ...". Ingredients without a quantity are ignored. Unmapped name, unknown ID, missing kcal/fat/protein/kh/gl or an amount that cannot be converted to grams stops the build with all errors listed. Grams: "(≈ N g)" note in the recipe text first, then g/kg/ml (1 ml = 1 g), then `stueck`; ranges use the mean.
Per portion: kcal, protein, fat, available carbs, GL = sum(GL/100 g x g / 100) / portions (Excel README rule; carbs are already "verfügbar", no fibre subtraction). GL bands <=10 / <20 / >=20 (`src/lib/gl.ts`). Shown on the recipe page with the note "Orientierungswerte ... keine individuelle Blutzuckervorhersage".
Calculator: search field with datalist (names + synonyms), GL of the portion; unless GL is low, hint "Etwa 0,5 x carbs protein and 0,3 x carbs fat ... können helfen (Orientierungswert)".
Assumptions to confirm: Skyr = Quark mager, Mehrkornmehl = Mehl (Durchschnitt), Nussbutter = Erdnussbutter, Trockenhefe/Nährhefe = Bierhefe getrocknet, Orangenschale = Zitronenschale; missing: Proteinpulver, Proteinpulver Sahne, Chai Latte.

## D-009 — Hosting
Date: 2026-11-12 | Status: PROPOSED/started — GitHub Pages via GitHub Actions; custom domain, cost and limits not verified.

## D-010 — TypeScript
Date: 2026-11-12 | Status: CONFIRMED by user ("ja, TypeScript").
All project scripts are TypeScript (`src/lib/*.ts`, `src/scripts/filters.ts`, inline script in `index.astro`); `astro.config.mjs` stays `.mjs`. Dev dependencies `typescript` and `@astrojs/check`; `tsconfig.json` extends `astro/tsconfigs/strict`. Run `npm run check` before commits. New code (nutrition, GL) is written typed from the start.
