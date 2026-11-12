# Technical context
## Confirmed constraints
Minimalist, inexpensive, low-maintenance, Green IT-oriented, maximum visual freedom, easy content adjustments. Cooklang and tabular recipe presentation are high-interest requirements. Existing user-specified CSS paths: `src/css/abstracts/variables.css`, `base/fonts.css`, `assets/fonts/` — verify actual repository structure.

## Proposed stack — NOT YET APPROVED / INSTALLED
- Astro: mostly static HTML with selective interactive islands.
- Markdown/MDX: editorial content.
- Cooklang `.cook`: canonical recipe authoring format.
- Typed recipe metadata and separate nutritional data with source provenance.
- CSS variables + plain CSS: design system.
- GitHub: version control and review.
- Static hosting such as Cloudflare Pages: evaluate actual costs, carbon disclosures and caching.
- Optional Git-based visual CMS only if needed (evaluate Pages CMS / Decap CMS).

## Explicitly open
Repository audit; exact framework, package manager, deployment host, CMS/editor, cooklang parser compatibility, nutrition database/licensing, analytics/consent, localization, affiliate integrations, accessibility tests.

## Green IT approach
Pre-render where possible, avoid unused JS and third-party trackers, optimize and lazy-load imagery, subset self-hosted fonts where licenses permit, cache static assets, measure transferred bytes and runtime impact. Do not claim a hosting provider is carbon-neutral without evidence.
