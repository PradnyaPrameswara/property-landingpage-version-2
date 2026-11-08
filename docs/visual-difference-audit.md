# Webflow → Astro visual parity audit (#28)

Baseline: the **116 Webflow/Astro screenshots** from commit `868feb1778aa8a0fc23d8f9d7308baf1e4d40b65` (58 pairs). The screenshot generator restores original HTML from historical commit `1385bc25b16b8be15aa4c57297afea82969fdad9` without adding Webflow runtime to Astro.

The existing screenshot pairs include 14 routes at 390/1440px, Home/About/Projects/Contact at 320/768/1024/1920px, the Project and Blog detail templates at 767/768/991/992px, and six editorial/list pages at 700px.

## Highest pixel-difference observations from baseline

| Pair | Pixels with at least one channel differing by >32 | Assessment |
|---|---:|---|
| Team 700px | 67.03% | Reference portrait visibly faded due to reveal state; assess actual image geometry separately |
| Projects 700px | 63.57% | Card crop/framing differs; reference also shows transitional opacity |
| Project Niewuwndijk 767px | 62.10% | Text density and below-fold photo placement significantly differ |
| Projects 390px | 59.03% | Card media and first-fold spacing require closer inspection |
| Team 390px | 56.78% | Compare photo crop, spacing and reference reveal opacity |
| Projects 320px | 53.46% | Narrow-phone card positioning and crop differ |

These are **screen-pixel difference rates, not accuracy percentages**. The frozen Webflow export has inline `transform:scale(.9);opacity:.6` on reveal sections. A comparison captured mid-animation exaggerates differences even where correct images or layout exist; external asset timing and fonts also matter.

## Focus for the next PRs

1. Layout: avoid inventing new page spacing to match transitional screenshots. Compare image boundaries, typography, and line wrapping on Projects, Team, and project-detail pages at 320/390/700/767/768/1440px.
2. Motion: define the expected visible final state, preserve reduced-motion behavior and keyboard interactions, and avoid Webflow runtime.
3. QA: verify 14 routes, link destinations, gallery/dialog behavior, menu focus handling and horizontal overflow. Capture results and explicitly note unverified manual screen-reader work.

CI now publishes `von-falk-visual-audit` with `metrics.json` and `report.md`. This is an **informational** diagnostic; no arbitrary pixel-score gate is introduced until animation and font states can be normalized.
