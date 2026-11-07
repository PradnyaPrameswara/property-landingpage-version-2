# Visual acceptance gate for Webflow export removal

Status: **automated CI passed on prior implementation PRs; manual acceptance not yet recorded**. This checklist must be completed with browser evidence before this branch can be merged. Its existence does not constitute a pass.

## Original reference

The frozen HTML export is available in Git history at commit `1385bc25b16b8be15aa4c57297afea82969fdad9`. Relevant layout and content details are summarised in `docs/von-falk-replication-reference.md`. Compare with reference screenshots from the actual original implementation, not a generic template mockup.

## Required reviews

- [x] On the implementation PR stack, `npm ci`, source constraints, lint, Astro/TypeScript, and the 14-route static build passed GitHub Actions; cleanup branch must repeat these checks.
- [ ] Match desktop (1440 and 1920), tablet (768/1024), mobile (320/390) typography, layout, navigation, image framing, section spacing and footer.
- [ ] Human reviewer approves the before/after screenshots for all 14 routes: homepage, About, Services, Team, Projects, Blog, Contact, 3 project details, 3 blog details, and Licenses.
- [x] Automated Chromium smoke covers menu opening/Escape, contact validity and mailto fallback affordance, optional map loading, and responsive overflow on Home/About/Projects/Contact. Remaining interactions and keyboard-only states still require manual review.
- [ ] Confirm accessibility fundamentals: keyboard focus, headings, image alternatives, reduced motion and responsive overflow.
- [ ] Confirm the contact form is correctly configured for the intended host. Without an endpoint the only supported action is opening a prepared email draft.
- [ ] Confirm the final static output does not request jQuery, Radix or Webflow JS/CSS.
- [ ] Attach before/after screenshots, record any acceptable differences, and approve the deletion of the reference HTML.

Only after the checks pass should this cleanup PR be marked ready for review and merged.
