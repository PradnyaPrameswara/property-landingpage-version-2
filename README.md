# Von Falk — Astro rewrite

The production application lives in [`von-falk-mvp/`](./von-falk-mvp). It is built with Astro, Tailwind CSS v4, React, TypeScript and shadcn Base UI. No Webflow, jQuery or Radix runtime is required.

```sh
cd von-falk-mvp
npm ci
npm run verify:source
npm run lint
npm run typecheck
npm run build
npm run dev
```

The former HTML export was removed from the active tree. For historical comparison, see commit `1385bc25b16b8be15aa4c57297afea82969fdad9` and [`docs/von-falk-replication-reference.md`](./docs/von-falk-replication-reference.md).

**Do not merge the export-removal PR until the visual rewrite has been reviewed route-by-route** using the acceptance checklist in [`docs/visual-parity-acceptance.md`](./docs/visual-parity-acceptance.md). Static code analysis and a green build do not prove a pixel-identical result.
