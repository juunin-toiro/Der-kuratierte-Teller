# System patterns (PROPOSED unless marked confirmed)
## Separation of concerns
- Content authoring: Markdown/MDX articles; Cooklang recipes.
- Recipe parsing: parse/validate `.cook` at build time where feasible.
- Domain model: ingredients, quantities, units, allergens, tags, nutrition references, affiliate links.
- Presentation: independent accessible components (tabular recipe, step view, cards, filters).
- Optional enhancements: portions, conversions, shopping list, search, calculator via minimal JS.

## Nutrition data rules
Never assume Cooklang itself supplies nutrient composition. Resolve each ingredient to a documented food-database ID; capture raw/cooked state, edible portion, units, and data source/version. Recalculate for servings and substitutions. Distinguish measured, database-derived and estimated values; handle missing values explicitly. Nutrient totals need validated transformations and cooking losses where relevant.

## Recipe semantics
Keep authoring representation separate from display. Support table/list/step modes without duplicating recipe facts. Tabular layout must work on narrow screens, print, keyboard, and screen readers. Provide a fallback for disabled JS.

## Affiliate architecture
Central product/link registry, outbound link disclosure, avoid hard-coded links in recipe content, never invent partner programs or live product availability.

## Architecture diagram
Cooklang + MDX + nutrition metadata -> build-time validation -> static pages + optional client islands -> CDN.
