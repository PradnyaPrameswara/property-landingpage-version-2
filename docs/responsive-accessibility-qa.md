# Responsive and accessibility QA — PR #31

## Automated checks

The build must produce exactly **14 static routes** and all their internal links and locally hosted images must resolve. The `scripts/site-qa.mjs` check also validates that each route renders one primary heading and every image has an `alt` attribute; empty alt remains valid for intentionally decorative images.

Chromium smoke verifies:
- navigation (mobile and desktop fullscreen overlay, Escape, focus return, scroll lock), contact-field validation, opt-in map and native gallery keyboard behavior;
- first-fold geometry on the Webflow 390/700/767/768/1440px breakpoint set and responsive overflow checks on Home/About/Projects/Contact at 320/390/700/767/768/1024/1440px;
- **all 14 routes** at 390px and 1440px for one h1, main landmark, image-alt attribute presence and no horizontal overflow;
- simulated `prefers-reduced-motion: reduce` yields no reveal animation or forced smooth scroll.

CI also builds and captures 116 paired first-viewport screenshots and calculates non-gating pixel difference metrics, with old Webflow files restored only into a temporary runner directory.

## Required manual acceptance (not automatically verified)

- Complete keyboard-only and real screen-reader exploration of nav, contact form, gallery lightbox and every content page.
- Compare **full-page scrolled, settled-animation states**, not only first viewport or faded original Webflow snapshots, across representative real browsers/devices.
- Confirm contrast and focus-indicator visibility on actual devices, and that remote iframe resources behave consistently.
- Verify deployed production routes, caching, robots/meta and contact-endpoint delivery if enabled. Without `PUBLIC_CONTACT_ENDPOINT` the contact flow prepares a user-sent email draft.

**No pixel-perfect or manual assistive-technology claim follows from green CI alone.**
