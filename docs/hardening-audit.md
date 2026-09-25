# Hardening Audit — Von Falk export + Astro MVP scaffold

Audited with: `grill-me` (HITL questions, see bottom), `wayfinder` (map: `.scratch/hardening/map.md`), `cavecrew-investigator` + `cavecrew-reviewer` (evidence below). `show-me` is NOT installed (no local/global skill); substituted with reviewer evidence + file references.
Scope: 15 Webflow HTML files + `von-falk-mvp/` scaffold (Astro 7, React 19, 61 shadcn Base-UI components).
Method: PowerShell 5.1 `Select-String`, `Read`, `Test-Path`. No edits to export HTML; fixes belong in MVP build.

## Totals

| Area | 🔴 Critical | 🟡 Warning | 🔵 Info |
|---|---|---|---|
| Webflow export | 2 | 40 | 67 |
| MVP scaffold | 1 (fixed) | 3 | 1 |
| Secrets | 0 real | 0 | public-only |

## Webflow export findings

### 🔴 Critical (fix in MVP build)

1. `contact.html:12`, `index.html:12` — `form#wf-form-Get-in-touch-form method=get` leaks Name/Email/Phone/Subject into URL, history, logs, Referer. Fix: `method=post` over HTTPS + server-side validation + privacy notice. Client `required` + `maxlength=256/5000` present but does not mitigate GET leak.

### 🟡 Warnings

2. Mixed content `http://finsweet.com/` placeholder links (9x: 2 per `project/*.html`, 1 per `blog/*.html`). Fix: replace with real HTTPS content (R-38).
3. `target=_blank` without `rel=noopener noreferrer` on footer `https://webflow.com` link (15 files). Fix: add `rel` (reverse-tabnabbing).
4. `jquery-3.5.1` EOL (known XSS CVEs) + `webflow.71ab58168.js` without SRI (15 files). Fix in MVP: drop both (Astro has no jQuery); if ever kept, self-host 3.7.1+ with SRI + CSP.
5. `w-widget-map` on `contact.html:12` with empty `title`/`latlng`/`tooltip`. Fix: meaningful title or click-to-load facade (privacy + perf).

### 🔵 Info (accepted or MVP polish)

6. `mailto:info@vonfalk.nl.` + `tel:+31640125678` + `Kanaalstraat 116, 1054XM Amsterdam` in all 15 footers — intentional public contact. Note trailing-dot typo in `mailto:` display text; consider spam obfuscation only if needed.
7. 87/87 `alt=""` empty (index 15, services 9, rest distributed). Fix: real alts for content images, keep decorative empty with role.
8. Inline head script `!function(o,c){var n=c.documentElement...` (15 files, line 2). Fix: CSP hash/nonce or externalize; Astro build must account for it.

## MVP scaffold findings (`von-falk-mvp/`)

- ✅ Scripts clean (no postinstall backdoors), `tsconfig` strict via `astro/tsconfigs/strict`, no `.env` files (gitignored), 61 UI components all `@base-ui/react` (49 matches) / 0 `@radix-ui` in `src`, `node_modules` gitignored.
- 🔴 FIXED: nested `von-falk-mvp/.git` removed (was blocking parent tracking); `package.json` intact.
- 🟡 Transitive Radix via `cmdk@1.1.1` (`@radix-ui/react-dialog/primitive/compose-refs/id` in lockfile lines 2908-3209, 5535-5544). `src` has 0 radix imports. Fix: replace `cmdk` usage with Base-UI `combobox.tsx` (already present) or pin + `npm audit`.
- 🟡 No explicit `output:"static"` + no security headers (`Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`) in `astro.config.mjs` (13 lines, `tailwindcss()` + `react()` only). Fix at deploy config.
- 🟡 `useEffect` 5x vs no-`useEffect` MVP rule: `calendar.tsx:193`, `carousel.tsx:89,94`, `sidebar.tsx:97`, `hooks/use-mobile.ts:8`. Fix: refactor to Base-UI/CSS/`useSyncExternalStore`/Astro directives, or record waiver.
- 🔵 ESLint covers `**/*.{ts,tsx}` only; add `js/mjs/cjs/astro` + `no-restricted-imports` for `@radix-ui/*`, `jquery`, `useEffect`.

## Secrets sweep

REAL secrets: 0 (`BEGIN PRIVATE`, `gho_`, `AKIA`, `password`, `api_key` all 0). `.env` files: 0. `secret`/`token` hits are false positives (package names, design tokens, skill docs). PII + site ID `65afab2b` are intentional public content (17 files each).

## Grill-me (HITL decisions for owner)

1. Form transport: switch Get-in-touch to POST + Astro Action backend? (recommended yes)
2. `cmdk` (transitive Radix): replace with Base-UI Combobox, or accept + audit? (constraint says no Radix)
3. `useEffect` 5x in shadcn vendors: refactor now or waiver?
4. Map: live Google embed with facade, static image, or remove?
5. `mailto:` trailing dot + spam obfuscation: fix text now?

## Wayfinder map

See `.scratch/hardening/map.md` (+ decision tickets in `.scratch/hardening/issues/`).
Re-verify: `npx skills list -a opencode`; rescan tokens per section above.
