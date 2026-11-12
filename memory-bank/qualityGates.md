# Quality gates
## Every change
- Check diff and affected files; do not silently add dependencies.
- Run available formatting, lint, type and build checks; report absent checks as absent.
- Check semantic markup, keyboard access, visible focus, mobile responsiveness and `prefers-reduced-motion`.
- Verify no unauthorized palette additions; reference `variables.css`.
- Verify no unnecessary client JS, external fonts, trackers or heavy media.

## Recipe-specific
- Validate Cooklang parse failures and unusual units/serving scales.
- Ensure tabular view is understandable on mobile and with assistive technology.
- Test portion changes, unit rounding and ingredient substitutions.
- Do not present nutrition calculations without source and test coverage.
- Test allergen wording and cross-contact cautions.

## Release
- Confirm affiliate disclosures and privacy requirements for actual markets.
- Measure page weight, performance, accessibility and resource requests; record baselines rather than invent thresholds.
- Verify article sources and evidence language.
