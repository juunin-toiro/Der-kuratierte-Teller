# Design system — CONFIRMED user specification
**Mood:** ruhig, hell, warm, präzise. **Motif:** bee and hexagon; recipe cards as honeycomb.
**Single source of truth:** `src/css/abstracts/variables.css`. Inspect actual values before editing. No extra palette colors without approval.

## Palette
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#44414F` | Text, headings, cards, active buttons |
| `--bg-color` | `#FAF7F1` | Page background; text on ink |
| `--accent-color` | `#EFBC3A` | Bee, surfaces, underlines; ink text |
| `--yellow-white` | `#F4E7BC` | Hover surface; ink text |
| `--green` | `#70B386` | Surfaces, borders, graphics |
| `--orange` | `#E3878D` | Surfaces, borders, graphics |
| `--stardust` | `#9F9F9C` | Decoration only, never text |

User-provided contrast figures on `#FAF7F1`: ink 9.3:1, accent 1.65:1, yellow-white 1.2:1, green 2.3:1, orange 2.4:1, stardust 2.5:1. User-provided ink-on-color figures: yellow-white 8.0:1, accent 5.6:1; green/orange/stardust 3.7–4.0:1. **These are supplied figures, not independently verified.** Run automated contrast checks before claiming WCAG conformance.

### Text policy
Text only ink on light surfaces or bg on ink. No colored text in accent/green/orange/stardust. Ink on green/orange/stardust is not for normal-size text; user allows large bold text and bordered UI only, subject to verification.

## Typography
- Body: Leggibilmente, `--f-family`; 400 regular, 400 italic, 500 medium, 700 bold. Requested 600 falls back to 700.
- Headings/navigation/buttons: Aleo variable and italic, `--f-heading`.
- Self-host fonts in `assets/fonts/`; `@font-face` in `base/fonts.css`; no Google Fonts.
- H1 2.5rem; H2 2rem; H3 1.75rem; H4 1.5rem; H5 1.25rem; H6 1rem.
- `--gap`: 1.5rem default, 2rem from 576px, 3rem from 992px.

## Components
- Hex recipe card: no photo; ink surface, centered bg title/tags. Chip border colours (UPDATED 2026-11-12, D-007): green for Ernährung (proteinreich, low-carb, vegetarisch); orange for Verträglichkeit (laktosefrei, glutenfrei); accent for Zeit (schnell). Group name is also given as screen-reader text; never rely on border colour alone.
- Navigation: ink, active/hover bold with 3px accent underline.
- Bee: 64px centered; hover rotation 180 degrees over 0.8s; scroll to calculator. Also support keyboard activation and reduced motion.
- Filters: inactive bg + 1.5px ink border; hover yellow-white; active ink/bg. Expose active state semantically.
- Primary button ink/bg; secondary bg/ink with ink border; accent accent/ink with 2px ink border; hover yellow-white/ink with ink border.
- Hover must never be color-only. Focus ring 3px ink, 2px offset; on ink surfaces accent. Hex cards: use drop-shadow halo because clip-path clips outlines; verify focus remains clearly visible.

## Known issue
`Smart-Fuel Rechner` heading currently injected inline in green; change to ink. Logo contrast remains unmeasured. `#4C516D` is only for the profile-photo brief, not a new site token.

## Implementation note
Prefer CSS custom properties, reusable components and semantic markup. Never add arbitrary hard-coded hex values.
