# Changelog

Notable feature and design changes to the Idea Board, newest first. This is a running log of *what shipped and why*, not a design-spec archive — see `docs/design/specs/` for specs still under active discussion.

## 2026-06-11 — Maturity label

Scientists were reluctant to share early-stage ideas for fear of being held accountable if they turned out wrong. Added a maturity label so authors can flag how evidenced an idea is, framing uncertainty as a positive signal rather than a warning.

- Four fixed levels: **Speculative → Exploratory → Supported → Validated**, each with a tooltip explaining what the level means.
- New required `maturity` select field in the CMS (`static/admin/config.yml`); existing ideas without the field default to `speculative` via a Gatsby resolver.
- `MaturityBadge` component renders an ALLEN_BLUE opacity ramp (faint at Speculative, full-strength at Validated), with two variants:
  - `badge` (pill) — shown inline with the title in the idea list
  - `inline` (dotted-underline text) — shown in the idea detail metadata strip
- Out of scope (not done): bulk-updating maturity on existing ideas, filtering/sorting the index by maturity, automated maturity progression.
