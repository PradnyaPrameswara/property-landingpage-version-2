# PRD: Von Falk Webflow → Astro Deployment (duplication migration)

Combines `docs/von-falk-replication-reference.md` (layout/assets/UI/CMS audit) + `docs/hardening-audit.md` (2🔴/43🟡/68🔵 + secrets clean) into the build-and-deploy contract for `von-falk-mvp/`. Grill-me resolutions applied: form→POST+validate, `cmdk`→Base-UI combobox, `useEffect`→refactor now, map→facade embed.

## Objective

Ship a pixel-faithful, hardened Astro replica of the Von Falk interior-studio template (14 routes: `/`, `/about-us`, `/projects`, `/services`, `/team`, `/blog`, `/contact`, 3x `/project/[slug]`, 3x `/blog/[slug]`, `/template-8igy9jfp/licenses`), dropping the Webflow runtime (`webflow.js`, `jquery-3.5.1`) and closing all 🔴 hardening findings. Success = all routes render from local content + local assets, zero `useEffect`, zero Radix imports, POST form, security headers, green verify gate.

## Tech Stack

Astro 7 (static output) + TypeScript strict (`astro/tsconfigs/strict`) + React 19 islands (`client:visible` only) + Shadcn Base-UI Nova (61 components in `src/components/ui`, `@base-ui/react`, 0 `@radix-ui` in `src`) + Tailwind v4 (`@theme`, `src/styles/global.css`) + lucide icons. Constraints: no `useEffect`, no legacy patterns, no Radix (transitive `cmdk`→Radix to be replaced by Base-UI `combobox.tsx`), semantic tokens only.

## Commands

All in `von-falk-mvp/` (npm):
Build: `npm run build` · Dev: `npm run dev` (`astro dev`) · Preview: `npm run preview` · Lint: `npm run lint` (`eslint .`) · Typecheck: `npm run typecheck` (`astro check`) · Format: `npm run format` · Rescan audit tokens: `Get-Content -Raw | Select-String -Pattern '<token>' -AllMatches` from repo root.

## Project Structure

```
von-falk-mvp/                 → Astro MVP (deployable unit)
  src/pages/                  → index, about-us, projects, services, team, blog, contact,
                                 project/[slug].astro (getStaticPaths, 3), blog/[slug].astro (3),
                                 template-8igy9jfp/licenses.astro
  src/layouts/                → BaseLayout.astro (page-wrapper), Navbar.astro, Footer.astro
  src/components/astro/       → Hero, FeaturedProjects, ServiceOverview, GetInTouch, ProjectVisuals, BlogPost (static)
  src/components/react/       → MobileMenu, ContactForm, ProjectAccordion (client:visible, useState only)
  src/components/ui/          → 61 shadcn Base-UI primitives (do not hand-edit; update via CLI)
  src/content|data/           → projects(3), blog(3), services(7), team collections (replaces w-dyn)
  src/assets/                 → vendored CDN media (14 index basenames, .webp/.svg/.png, deduped p-* variants)
  src/styles/global.css       → Tailwind v4 theme + brand tokens (from --base-color-brand--main)
./*.html, ./blog/, ./project/ → frozen Webflow reference export (never edit; fixes land in MVP)
docs/                         → replication reference, hardening audit, this PRD
.scratch/hardening/           → wayfinder map + decision tickets (gitignored, local)
```

## Code Style

Shadcn rules enforced: `FieldGroup`+`Field` forms with `data-invalid`/`aria-invalid`; `gap-*` never `space-x/y-*`; `size-*` for square; `truncate` shorthand; `cn()` conditionals; full Card/Dialog composition with titles; `AvatarFallback`; icons via `data-icon` without sizing classes; semantic colors only. Layout: `.padding-global` (px-5 md:px-10) > `.container-large` (max-w 1440 mx-auto); grids via Tailwind, never `w-row/w-col`. Motion: CSS scroll-driven (`animation-timeline:view()`) + ViewTransitions; `prefers-reduced-motion` respected; every technique purpose-written.

## Testing Strategy

`tdd` for logic (ContactForm validation, `getStaticPaths` counts), `browser-testing-with-devtools` for rendered routes (DOM, console clean, network: no CDN JS, perf), `verification-before-completion` before every commit/PR claim. Antislop delivery gate on UI slices (no em dashes, no fake stats/testimonials, real CTAs, 320–1440px clean, keyboard Tab/Enter/Escape, 4.5:1 contrast, click-through evidence per control).

## Boundaries

- Always: rescan audit tokens after each phase; keep `src` at 0 `@radix-ui` + 0 `useEffect`; run lint + typecheck before committing.
- Ask first: adding dependencies (esp. anything pulling Radix/jQuery), changing `src/components/ui` by hand, altering Wayback export HTML, deferring a 🔴/🟡 fix.
- Never: commit secrets/`.env`, `node_modules/`, `.agents/`, dist output; `Co-authored-by` trailers; `--force` to `main`; `method=get` forms; `target=_blank` without `rel=noopener noreferrer`.

## Migration workflow (duplication → hardening → deploy)

One concern per branch (`feature|fix|docs|chore|refactor|audit/<slug>`); one PR per phase slice. Skill chain per phase: spec/plan slice → `incremental-implementation` + `tdd` → `code-review` → `verification-before-completion` → commit → PR.

- Phase 0 — Freeze + tokens: freeze export as reference; extract brand tokens/type scale into `global.css`; vendor 14 index basenames (+ project/blog covers) to `src/assets`. Verify: no remote `cdn.prod` refs in MVP, `src/assets` inventory matches §3 of replication reference.
- Phase 1 — Shell: `BaseLayout` + `Navbar` (3-col center-logo, `client:visible` menu, `useState` only) + `Footer` (contact block, fixed `mailto:` dot, `rel` on Webflow link). Verify: all 14 routes render shell, keyboard nav passes.
- Phase 2 — Pages + CMS: 7 static pages + `project/[slug]` + `blog/[slug]` + licenses from typed collections; real copy replaces Finsweet placeholders (R-38); real alts for 87 images. Verify: `getStaticPaths` counts (3/3/7/team), no `http://finsweet`, no empty content alts.
- Phase 3 — Islands + motion: ContactForm (POST Astro Action, empty/loading/error/success states), ProjectAccordion (`<details>`/Base-UI), facade-embed map, CSS scroll reveals replacing `scale3d(0.9)/opacity .6`. Verify: no `useEffect` in `src`, POST-only submission, facade click loads map.
- Phase 4 — Hardening closure: drop `cmdk` for Base-UI combobox; explicit `output:"static"` + CSP (hash inline script)/`X-Frame-Options`/`Referrer-Policy` at deploy target; ESLint widened (`js/mjs/cjs/astro` + bans). Verify: `npm audit` clean-ish, headers present in preview deploy, rescan 0🔴.
- Phase 5 — Deploy: `npm run build`, full click-through evidence per control, antislop gate, PR with Screenshots. Verify: `verification-before-completion` green, `.scratch/hardening` map all resolved.

## Success Criteria

- 14/14 routes build static with zero console errors; 0 CDN JS (`webflow.js`/jquery gone).
- `src`: 0 `useEffect`, 0 `@radix-ui` imports (direct + via `cmdk` removal).
- Form POST-only with validation + states; map facade-only; headers + CSP live.
- 320/768/1024/1440px clean, keyboard + contrast AA, click-through log attached.
- Wayfinder map: 5/5 hardening tickets resolved.

## Open Questions

- Deploy target owning headers (ticket 05-headers, open).
- `npm audit` baseline after `cmdk` removal.
- Final CSP hash once Astro output is fixed.
