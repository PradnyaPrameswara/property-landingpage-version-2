# Von Falk — Astro rewrite

The maintained website application lives in [`von-falk-mvp/`](./von-falk-mvp), built with Astro, Tailwind CSS v4, React, TypeScript and shadcn Base UI. The active website does not need Webflow JavaScript, jQuery, Radix or React `useEffect`.

```sh
cd von-falk-mvp
npm ci
npm run verify:source
npm run lint
npm run typecheck
npm run build
npm run dev
```

The frozen Webflow HTML export was retired from the default tree after the Astro PR stack passed CI and responsive/interaction checks. Original HTML is still available at Git commit `1385bc25b16b8be15aa4c57297afea82969fdad9`; visual screenshots are retained in the PR #19 workflow artifacts. See [the verification record](./docs/visual-parity-acceptance.md) for documented differences and remaining production checks.

**Deploy from `von-falk-mvp/`**, with Node >=22.12 and the static `dist/` output. The contact form falls back to a user-sent email draft unless a working `PUBLIC_CONTACT_ENDPOINT` is configured.
