# Active context — 2026-11-12
## Current focus
Steps 1-3 of the agreed plan are built (recipes, filters, CMS config, blog, About, Quellen, start page). Step 4 waits for the new Excel.

## Plan (agreed with the user)
1. DONE: recipe model with Cooklang, filters, honeycomb.
2. DONE in files, UNTESTED in the services: `.pages.yml` and `.github/workflows/deploy.yml`.
3. DONE (placeholders remain): blog, About (user text), Quellen, start page order. Missing: intro text, first real post, real sources.
4. TODO after the user sends the new Excel: Lebensmittel collection, nutrient catalogue, calculator on the new data (combobox search), computed nutrition and GL per recipe. See D-008.

## Waiting on the user
- New Excel replacing `data-review/lebensmittel-pruefung.xlsx` (columns: name, name variants, GI, Zustand, KH brutto, Ballaststoffe, nutrients, density, per-unit grams, source). Check its columns against the nutrient catalogue first.
- Intro text for the start page, sources. (About text received.)
- GitHub: push, then Settings > Pages > Source "GitHub Actions"; decide custom domain vs `github.io/<repo>`.

## Open / unverified
Pages CMS config never loaded in the CMS; hosting cost/limits; contrast and keyboard checks; image upload path (`../assets/recipes`) in the CMS; the single placeholder entry in `src/data/foods.json` (source unknown); `brainfood` kept as a future blog topic.
