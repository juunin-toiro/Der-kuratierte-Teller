# Progress
## 2026-11-12 — Documentation baseline
- [x] Captured project goals and audiences from supplied brief.
- [x] Captured user-provided design tokens and interaction requirements.
- [x] Drafted proposed lightweight architecture and AI working rules.
- [ ] Audit actual source repository.
- [ ] Approve technology decisions.
- [ ] Implement and test recipe parsing, cards and tabular recipe view.
- [ ] Validate contrast and keyboard accessibility.
- [ ] Establish verified nutrition data provenance.

## 2026-11-12 — MVP v0 (slim)
- [x] Repo audited (only docs existed); Astro 7 + plain CSS + npm approved.
- [x] Static build works (`npm run build`, 4 pages).
- [x] Tokens, self-hosted fonts (Leggibilmente 400/400i/500/700, Aleo VF + italic VF in `public/assets/fonts/`).
- [x] Mini Cooklang parser (`src/lib/cooklang.js`), 3 sample recipes, hex cards, JS-only tag filter, recipe table page, bee button.
- [ ] Not verified: contrast, focus on hex cards, keyboard, print, screen reader (no browser check yet).
- [ ] Fonts are OTF/TTF, not subset/woff2. Bee scrolls to recipes (no calculator in MVP). No nutrition values by design.

## 2026-11-12 — Start page, calculator, favicon
- [x] Hero (plate image), bee button (scrolls to calculator and focuses it), favicon set + manifest from user files. Nav: Home, Rezepte, Kalkulatoren (Wissenswertes/About pages do not exist yet).
- [x] Leggibilmente is now one `Leggibilmente.woff2` (weight axis verified in browser: 400/500/700 differ; no real italic, browser synthesizes it).
- [x] Smart-Fuel Rechner (glycemic load per portion), heading in ink. Bands <=10 / 11-19 / >=20 are the standard GL bands.
- [x] `foods.json` placeholder replaced by `lebensmittel.json` (Excel import, 1331 foods), see D-008.
- [ ] Contrast and keyboard checks still pending.

## 2026-11-12 — Step 1 and 2 of plan (recipe model, filters, CMS config)
- [x] Recipes are `src/recipes/*.md` (YAML frontmatter + Cooklang body), categories `src/categories/*.md`, validated by Zod in `src/content.config.ts`; tags in `src/data/tags.json`.
- [x] Parser: `@tmlmt/cooklang-parser` (official WASM `@cooklang/cooklang` fails in Astro/Node build: unknown `.wasm` extension). The old mini parser and `.cook` files are removed.
- [x] Filters: Geschmack (single), Eigenschaften (AND, `schnell` automatic at <=15 min total), Kategorie dropdown (OR). Checked in the browser with JS clicks; honeycomb rows offset by `src/scripts/filters.js`.
- [x] Invalid frontmatter stops the build with a German-readable list per file (verified with a bad test file).
- [x] `.pages.yml` (Pages CMS) and `.github/workflows/deploy.yml` (GitHub Pages) written; base path via `SITE`/`BASE` env, links via `src/lib/url.js`.
- [ ] NOT verified: Pages CMS config has never been loaded in the CMS (keys `required`, select `multiple`, reference `value`/`label`, image `output` relative path are from docs only). Deploy workflow not run (needs push + Settings > Pages > Source: GitHub Actions).
- [ ] Not done yet: steps 3 and 4 of the plan (blog, about, sources, start page list; food table, calculator data, computed nutrition and GL). Calculator still uses the single placeholder entry in `src/data/foods.json`.
- [ ] Contrast, keyboard and screen reader checks still pending. Max 3 honeycomb columns (2 below 480 px).

**Note:** Documentation completion does not mean application code exists or has been tested.

## 2026-11-12 — Step 3 (blog, About, Quellen, start page)
- [x] Nav fixed to Home, Rezepte, Wissenswertes, About (no Kalkulatoren). Colour cue on filters is a dot, not a border.
- [x] Collections `posts` (title, teaser, optional kategorie, hidden sort `datum`, `quellen`), `quellen` (title, autor, jahr, link), `seiten` (About). Recipes got optional `quellen`. Sources are referenced by title; a missing title stops the build with a German message. Numbering = order of the list.
- [x] Pages: /wissenswertes/ (list), /wissenswertes/<slug>/, /about/ (user's own text), /quellen/ (central list, footer link). Start page: hero, intro placeholder, calculator, recipes, newest 3 posts (no date) with link "Alle Beiträge".
- [x] `.pages.yml` extended (posts, quellen, seiten) — still untested in the CMS. Build: 8 pages OK.
- [ ] Placeholders to replace: intro text on start page, first post (`src/posts/platzhalter-erster-beitrag.md`), source (`src/quellen/platzhalter-quelle.md`). Series/Kategorie landing pages for posts not built. Inline footnote markers are not automatic.
- [ ] Not checked: visual result in the browser, contrast, keyboard.

## 2026-11-12 — TypeScript migration, deploy
- [x] GitHub Pages deploy ran green; live at https://juunin-toiro.github.io/Der-kuratierte-Teller/ (links, images, font checked).
- [x] JS -> TS (D-010). `npm run check`: 0 errors; build 8 pages; filters and calculator re-tested in the browser. Bee image no longer distorted (object-fit: contain).
- [ ] Not yet: `check` in the deploy workflow; Pages CMS test.
