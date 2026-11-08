# Settled first-viewport Webflow–Astro baseline

The original frozen Webflow export contains inline opacity and scale states left over from reveal animations. Previously, screenshot capture depended on a fixed virtual-time budget and did not verify image/font readiness.

The dependency-free Chromium CDP runner in `scripts/capture-settled.mjs` now captures 58 pairs (116 PNGs). It waits for document and font completion, visible image loads and decodes, applies the same reduced-motion media preference to both pages, normalizes the original reference's inline `data-w-id` opacity/transforms (only in the screenshot browser), disables animations/transitions during capture, and checks exact viewport dimensions.

`capture-manifest.json` records font readiness, image readiness/failures, normalized reference elements and overflow. Broken visible Astro images fail the job; original CDN errors are reported without being hidden.

This is a reproducible **first-viewport** comparison, not proof of full-page or live animation parity. Motion behaviors must be tested separately, and CSS/asset fidelity still requires manual review. No legacy runtime was restored to Astro.
