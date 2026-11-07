# Migration acceptance — Webflow HTML retirement

## Outcome

The native Astro application in `von-falk-mvp/` replaces the 16 frozen Webflow HTML pages in the repository root. The original export is recoverable from Git commit `1385bc25b16b8be15aa4c57297afea82969fdad9`.

**Visual result:** design composition, navigation, source photos, responsive structure and branding were compared with screenshot references from the original on all 14 routes at 390px and 1440px, plus Home, About, Projects and Contact at 320px, 768px, 1024px and 1920px. Reviewed captures show close structural fidelity, **not measured pixel-perfect identity**. Rewritten article copy and some typography/spacing differ from the frozen template.

**Cleanup decision:** Remove original HTML from the active tree after successful CI and source checks. This removes obsolete HTML, not the Git history or the usable original screenshot artifacts. Explicit user authorization was given to merge the PR stack and retire Webflow after implementing and checking the rewrite.

## Verification record

- [x] GitHub Actions passed source guard, locked install, lint, Astro/TypeScript, 14-route static build and automated Chromium interaction smoke in PR #18 and PR #19.
- [x] Original/Astro comparative screenshots generated for all 14 routes at 390 and 1440px; four core routes also captured at 320, 768, 1024 and 1920px (88 images, PR #19 artifacts).
- [x] Headline, hero crop, gallery media, responsive layouts and License original composites manually compared in screenshot montages and key side-by-side crops. Known differences in prose length and small spacing remain.
- [x] Chromium smoke covers navigation open and Escape, required contact fields and email-draft affordance, explicit map loading, and no horizontal overflow on four core routes at 320/390/768/1440px.
- [x] PR #17 restored two exact original License composites and 17 credit links as local assets.
- [x] Cleanup branch CI passed after replacing reference screenshots with Astro-only capture; no frozen HTML is required for static preview.
- [x] Source guard rejects Webflow runtime JS, jQuery, Radix and React `useEffect` in Astro source; this does not prove that every possible network request has been inspected.

## Known limits and post-merge work

- [ ] Complete any remaining pixel-level visual polish that matters to the owner. Existing screenshot evidence supports close design parity, **not exact equality**.
- [ ] Conduct manual screen-reader and comprehensive keyboard testing beyond the covered interactions.
- [ ] If automatic contact delivery is required, configure and verify `PUBLIC_CONTACT_ENDPOINT`. Without it, submission prepares an email in the visitor's email client; no email is sent automatically.
- [ ] Configure the production host to install and build from `von-falk-mvp/`, verify all 14 routes on the deployed domain, and audit actual network requests and linked media.

Deleting frozen HTML does not close those tasks. Use the historical commit and saved paired screenshot artifacts for future visual comparisons.
