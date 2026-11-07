# Von Falk Astro Website

A static, responsive recreation of the Von Falk interior design site. The application lives in this directory; all pages use Astro with Tailwind CSS v4, TypeScript and React islands. UI components come from the shadcn Base UI setup. No Radix, React useEffect, jQuery or Webflow runtime is used in the application source.

## Local development

Node.js 22.12+ and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run verify:source
npm run build
npm run preview
```

The static build creates the 14 routes from local assets and typed project, blog, team and service data.

## Contact form

The site is static and cannot send messages on its own. Without a configured endpoint, its contact form opens the visitor's email client with a prepared enquiry and explicitly asks them to send it. It **does not** report a successful submission.

To enable server-side delivery, set `PUBLIC_CONTACT_ENDPOINT` to a deployed, same-origin POST endpoint that accepts `multipart/form-data` with fields `name`, `email`, `phone`, `subject`, `about` and returns a successful HTTP response after actual acceptance. Configure server-side validation, spam protection, rate limiting and delivery before enabling it. Never place API keys in a `PUBLIC_` variable. A configured endpoint is required for automatic delivery.

## Review checklist

Before merging the visual migration, compare the frozen Webflow HTML reference with all 14 Astro routes at 320, 390, 768, 1024 and 1440 pixels. Check navigation by keyboard, all gallery images and the contact flow. The repository's `public/_headers` must be supported by the target host or translated into that host's equivalent headers configuration.

Run the project's commands before claiming production readiness. Source checks alone do not establish visual parity.
