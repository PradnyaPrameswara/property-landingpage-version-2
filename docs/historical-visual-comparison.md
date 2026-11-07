# Paired visual comparisons after the Webflow cleanup

GitHub Actions restores the original Webflow export from the historical commit `1385bc25b16b8be15aa4c57297afea82969fdad9` into a **temporary CI-only directory**. It is not added back to the working tree or deployed website.

The verification workflow captures:
- 14 Astro routes and their original Webflow equivalents at 390px and 1440px.
- Home, About, Projects and Contact at 320px, 768px, 1024px and 1920px.
- 88 screenshot files in the `von-falk-browser-snapshots` artifact.

Compare all 14 route pairs before asserting visual equivalence. The original export contains scroll-reveal initial opacity/scale styles, so screenshots may represent a transitional animation state rather than the final settled appearance. Content placeholders are part of the original template.

The workflow separately runs lint, Astro typecheck, static build, source restrictions, and Chromium interaction/overflow smoke checks. Capturing files does not prove pixel-perfect fidelity.
