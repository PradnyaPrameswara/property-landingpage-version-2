# Von Falk — Replication Reference (Webflow → Astro MVP)

Source: `website-b83c9e4c-3a2d-49c3-a4ba-b33919548e03/` (16 HTML, HTML-only, CSS/JS/images via CDN).
Audited with: `wayfinder` (map), `cavecrew-investigator` x4 (layout / animations / assets / UI-UX+CMS), `investigate-first` (evidence only), `caveman` (compressed output).
Verify: `npx skills list -a opencode`, `Get-Content -Raw | Select-String -Pattern '<token>' -AllMatches`.

## Wayfinder map

## Destination

Pixel-faithful Astro + TS + React + Shadcn (Base UI, no Radix) + Tailwind replica of Von Falk interior-studio template, with no `useEffect`, no legacy, no Radix. Reference for MVP build.

## Notes

Skills to consult per slice: `frontend-ui-engineering`, `shadcn` (Base UI), `antislop-ui/layoutmobile/human/copywriting`, `api-and-interface-design` (content contracts), `test-driven-development`, `browser-testing-with-devtools`. Motion: CSS scroll-driven + `client:visible` islands + ViewTransitions only.

## Decisions so far

- [Layout system](#1-layout-system) — `padding-global`/`container-large` 41/41, `w-row` 9, `w-col` 135, navbar 3-col center-logo, footer contact+sublogo.
- [Animations](#2-animations--interactions) — `data-w-id` 31, nav `300ms ease-in-out`, scroll `scale3d(0.9)/opacity .6`, dropdown, form states, map. Replace with CSS, no `useEffect`.
- [Assets](#3-assets--media) — CSS 1 + JS 2 CDN, images `.webp` dominant / `.svg` logo / `.png` icons / 0 `.jpg`, `srcset`+`lazy` yes. Vendor to `src/assets`.
- [UI/UX + CMS + routes](#4-uiux) — 7 nav links, footer contact block, 01-07 services, 3 projects + 3 blogs CMS, 14 routes + 2 stubs.

## Not yet specified

- Exact Tailwind tokens for `--base-color-brand--main`, type scale for `heading-style-h2`/`hero-header`.
- Form backend for `wf-form-Get-in-touch-form` (Astro Actions target).
- Map provider replacement for `w-widget-map` (iframe vs static).

## Out of scope

- `+31640125678.html`, `info@vonfalk.nl..html` stubs (tel:/mailto: crawl artifacts, keep as links only).
- `webflow.71ab58168.js` + `jquery-3.5.1` runtime (drop in MVP).
- Finsweet placeholder copy (`http://finsweet.com/`, Agency A/Company B) — replace with real content.

---

## 1. Layout system

Totals (9 files): `padding-global` 41, `container-large` 41, `w-row` 9, `w-col` 135, `grid` 109, `w-layout-grid` 18, `page-wrapper` 9, `footer-wrapper` 9. Stack triplet `w-col-stack`/`w-col-small-small-stack`/`w-col-tiny-tiny-stack` 27/27/27.

- Chrome identical all pages: `navbar w-nav` 10x/file (90 total), `w-nav-link` 7x/file (112 total).
- Navbar: `navbar-wrapper > navbar-columns w-row > navbar-column is-1 (empty, w-col-4) + is-2 (center, a.navbar-logo-wrapper > main-logo.svg) + is-3 (right, nav.navbar-menu-wrapper w-nav-menu > 7x navbar-navlink-wrapper)`. `w-col-4` x3 only, `w-col-8` 0.
- Footer: `footer.footer > padding-global > container-large > footer-wrapper > footer-contact-wrapper + footer-logo-wrapper (sublogo.svg) + footer-webflow-wrapper (License | Powered by Webflow)`.
- Sections per page: index `section-hero + section-featured-projects + section-service-overview + section-get-in-touch`; about `section-generic` x4; services `section-generic` x7; projects `section-projects`; team `section-team`; blog `section-blog`; contact `section-contact-form + section-map`; project detail `section-project-description + section-project-visuals`; blog detail `section-blog-post`; licenses `section-license`.
- Astro mapping: `BaseLayout.astro (page-wrapper) > .padding-global (px-5 md:px-10) > .container-large (max-w-[1440px] mx-auto)`. Navbar → `Navbar.astro` (3-col grid, center logo, `client:visible` MobileMenu island with `useState` only). Footer → `Footer.astro`. Grids → Tailwind `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`, never `w-row/w-col`.

## 2. Animations / interactions

- `data-w-id` 31 (index 19, amethiststraat 6, contact 6). Single values site-wide: `data-animation="default"`, `data-collapse="all"`, `data-duration="300"`, `data-easing="ease-in-out"` + `data-easing2`, `data-doc-height="1"`.
- Navbar: `<div class="navbar w-nav" data-animation="default" data-collapse="all" data-doc-height="1" data-duration="300" data-easing="ease-in-out" data-easing2="ease-in-out" id="navbar-element" role="banner">` + `nav.navbar-menu-wrapper w-nav-menu` + `div.navbar-burger-button w-nav-button[data-w-id]`. JS collapse via `webflow.71ab58168.js`.
- Scroll reveal: `<section class="section-project-visuals|section-featured-projects" data-w-id="..." style="...translate3d(0,0,0) scale3d(0.9,0.9,1) rotateX(0)...;opacity:0.6">`. Sweep: `translate3d` 28, `scale3d` 28, `rotateX` 28 (3 files). IX2 animates to scale 1 / opacity 1 on view.
- Dropdown (project detail only): `div.dropdown w-dropdown[data-delay="0" data-hover="false"] > div.dropdown-toggle w-dropdown-toggle (More details + svg) + nav.dropdown-list w-dropdown-list > project-description-cell`. Counts: `w-dropdown` 3, `w-dropdown-list` 1.
- Forms: `w-form-done`/`w-form-fail` 2/2 (index + contact). Map: `w-widget-map` 1 (contact only). Slider: 0. `w-mod-js/touch`: 0 literal, injected by head inline script.
- Libs (drop in MVP): `webflow.71ab58168.js` (assets-global), `jquery-3.5.1.min.dc5e7f18c8.js` (cloudfront).
- Astro replacement (no `useEffect`): nav → CSS `:has()`/checkbox or `client:visible useState` toggle; scroll scale/opacity → CSS `animation-timeline:view()` + `@keyframes` + `prefers-reduced-motion`; dropdown → native `<details>` or Base UI; form states → `onSubmit`/`useState`; map → lazy `iframe client:visible`. Keep `ViewTransitions` for route feel.

## 3. Assets / media

- CSS (1): `https://assets-global.website-files.com/65afab2b82c75aa35f79f8f2/css/von-falk.webflow.e19f53618.min.css`.
- JS (2): `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=...`, `https://assets-global.website-files.com/.../js/webflow.71ab58168.js`.
- Icons/OG: `65e216f69648d4dbccf8e3a5_vonfalk-favicon.png` (shortcut icon), `65e216fb9648d4dbccf8e4d2_vonfalk-webclip.png` (apple-touch), `65e2155454822657e3d8af3f_open-graph.webp` (og+twitter, root pages).
- `cdn.prod.website-files` counts: index 57, amethiststraat 42, services 41, concrete 36, dry-floral 30, niewuwndijk 30, keizergracht 28, about 26, blog 25, team 21, projects 19, theresa 18, contact 7, stubs 0/0. `assets-global` 17 on index (15 img + CSS + JS).
- Extensions (index): `.webp` 67, `.svg` 2 (main-logo, sublogo), `.png` 2 (favicon, webclip), `.jpg` 0. Global top-7: `186/14/14/0`.
- Responsive: `srcset`/`sizes` 13/13 + `loading="lazy"` 13 on index (services 8, about/team 5, blog/projects/contact 2). `p-500/800/1080/1600/2000` variants.
- Index basenames (14 base): `hero-image.webp`, `project-cover-1/2/3.webp`, `services-image-1/2-v2/3/4/5/6/7.webp` (35 refs), `service-overview-mobile-image.webp`, `get-in-touch-image.webp` (6 refs).
- Missing local: `css/`, `js/`, `images/` all `False`. Rule: download CDN files to `src/assets` (preserve hash basename, dedupe `p-*`), keep `.webp/.svg/.png`. No Google Fonts.

## 4. UI/UX

- Nav (7 + logo): `Home.(/)[w--current+aria-current on index]`, `About Us.(/about-us)`, `Projects(/projects)`, `Services.(/services)`, `Team.(/team)`, `Blog.(/blog)`, `Contact.(/contact)[id=nav-link]`. Logo `/` with `main-logo.svg alt=""`.
- Footer: `Contact.(h2)`, `Kanaalstraat 116.`, `1054XM Amsterdam.`, `mailto:info@vonfalk.nl.`, `tel:+31640125678`, `sublogo.svg`, `License(/template-8igy9jfp/licenses) | Powered by Webflow`. Totals: `footer` 16, `mailto` 16, `tel` 16.
- Type/cards/buttons: `heading-style-h2` 22, `h1` 14, `h2` 38. Index H1 `Serenity in essentials.` + H2 `Projects./Services./Get in touch.` + `See All` (index only). Services H1 + 7 rows (Design concept and layout / 3D visualisation / Furniture and appliances styling / Art consultancy / Lighting design / Project Management / Procurement and Installation = 01-07). Project cards → `/project/niewuwndijk|amethiststraat|keizergracht`. Blog cards → 3 posts x2. Submit `value=Submit data-wait=Please wait...`, `*button*` index 5 / contact 4.
- Forms (index + contact only): `w-form` 6, `w-form-done`/`fail` 2/2. `form#wf-form-Get-in-touch-form[data-name=Get in touch form method=get]`: 01 Name(text,256) / 02 Email(email,256) / 03 Phone(tel,256) / 04 Subject(text,256) / 05 About(textarea,5000), all required. Must implement empty/loading/error/success (R-27), real `mailto:`/`tel:` actions, keyboard closable dialogs (R-26/R-32).
- SEO: title `Von Falk - Webflow HTML website template` (licenses `License`, stubs `Not Found`); description/og/twitter mirror title; `og:type=website`, `twitter:card=summary_large_image`; per-collection `og:image` (root OG, project covers, blog covers); licenses `noindex` only; `w-webflow-badge` 16 (hidden by CSS).
- A11y gaps to fix in MVP: `img` 91 all `alt=""` (logo/cards need real alt), `aria-current` 9 only, `role=list/listitem` 39/44, `role=dialog` 0, `w-nav-button` 16, `w-dropdown` 9, `w-widget-map` 1 (`role=region title="" zoom=12`). Require 4.5:1 contrast, visible focus, Tab/Enter/Escape (R-25/R-32).

## 5. CMS / routes

- `w-dyn-list` 14, `w-dyn-item` 64, `w-richtext` 26. Per page items/list/richtext: index 12/2/0, projects 4/1/0, team 4/1/0, blog 4/1/0, project detail 8-14/2/4, blog detail 2-4/1/3, licenses 0/0/5.
- Detail `w-richtext`: `In collaboration with: Agency A, Company B`, year `2022`, `Heading 2/3/4 + Sample text... <a href="http://finsweet.com/">` (placeholder, `finsweet` 9 refs, index 0). Replace with real content (R-38).
- Routes (14): `/→index(29796)`, `/about-us(17651)`, `/projects(13352)`, `/services(23922)`, `/team(13227)`, `/blog(18316)`, `/contact(15008)`, `/project/niewuwndijk(21076)|amethiststraat(23914)|keizergracht(20910)`, `/blog/concrete...(18043)|dry-floral...(17018)|meet-theresa...(14941)`, `/template-8igy9jfp/licenses(12671)`. Stubs: `+31640125678.html`, `info@vonfalk.nl..html` (10605, `Not Found`, `%%PUBLISH_URL_REPLACEMENT%%`).
- Astro mapping: `pages/{index,about-us,projects,services,team,blog,contact}.astro`, `pages/project/[slug].astro`, `pages/blog/[slug].astro`, `pages/template-8igy9jfp/licenses.astro`; content collections `projects(3)`, `blog(3)`, `services(7)`, `team`; `getStaticPaths` from CMS counts above.

## 6. MVP replication rules

- Shadcn Base UI only (`@base-ui-components/react`), never `@radix-ui/*`; `button/card/badge/separator/skeleton/accordion/dialog/sonner`, `FieldGroup+Field`, `cn()`, `gap-*`, semantic tokens, `size-*`.
- No `useEffect`: static Astro + `client:visible` islands (`useState`, `Suspense`/`use`), CSS motion, Astro Actions for forms.
- Antislop gate: real downloaded assets, no fake stats/testimonials, specific CTAs (not Get Started), purpose-written motion, mobile 320-1440px clean, full click-through with evidence.
