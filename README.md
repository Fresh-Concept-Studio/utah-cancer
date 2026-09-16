# Utah Cancer Specialists

Static Astro site. The build retains the existing 151 `.html` URLs, including directory indexes and four retired-clinic redirects. It runs without a production application server.

## Local development

Use Node 24 (see `.nvmrc`). If you use nvm:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open **http://127.0.0.1:4322/utah-cancer/**. Astro reloads edited content automatically. Port 4322 avoids another local project using 4321. If the port is busy, use the URL Astro prints.

```sh
npm run verify       # Type checking, production build, route/assets/data tests
npm run preview      # Built site at http://127.0.0.1:4323/utah-cancer/
npm run test:migration # Compare this migration with the published baseline
```

Astro 7 manages local servers in the background. Use `npx astro dev stop` and `npx astro preview stop` to stop them; `npx astro dev logs` and `npx astro preview logs` show logs. Rebuild before refreshing the production preview after an edit.

## Where to edit

| Change | Source |
| --- | --- |
| Navigation and category labels | `src/data/navigation.ts` |
| Header, footer, marquee, shared contact layout | `src/components/` |
| Shared page head, fonts, assets, body layout | `src/layouts/SiteLayout.astro` |
| Provider biography, portrait, directory category/order | `src/data/providers.json` |
| Provider clinic cards, including published address variants | `src/data/provider-locations.json` |
| Leadership biographies and portraits | `src/data/leaders.json` |
| Leadership groups and memberships | `src/data/leadership-groups.json` |
| Cancer-type detail content and directory cards | `src/data/specialties.json` |
| Clinic detail pages, directory cards, and map coordinates | `src/data/locations.json` |
| Repeated sidebars and media cards | `src/data/shared-content.json` |
| Default assets and calls to action for page families | `src/data/page-defaults.json` |
| Unique pages, event details, stories, resource pages | `src/views/*.astro` |
| Unique-page titles, descriptions, assets, redirects | `src/data/pages.json` |
| Global and page-specific styles | `public/*.css`, `public/page-styles/` |
| Browser interactions | `public/scripts/` |
| Images and portraits | `public/images/` |

`src/lib/pages.ts` generates detail routes from records. Adding a provider, leader, specialty, or location does not require a second page file or route entry. Use a unique `slug` and follow an existing record's shape. Optional `page` overrides preserve special metadata or calls to action.

Provider, specialty, and location listings use their detail records. Leadership groups reference provider/leader slugs, with listing-only overrides where the published wording differs. Directory images and hero portraits can deliberately differ. `directory.order` preserves the published listing order; providers also retain browser sorting and Gary Garner's priority in Supportive & Rehabilitative Care. Directory counts are calculated from records. South Jordan retains a detail URL but is not listed as a current clinic.

To add a unique page, create its body in `src/views/`, then register its path and component name in `src/data/pages.json`. The site layout adds its header/footer and registered assets. Event and story body layouts remain individual views because their content differs; their shared site chrome is still defined once.

Rich-text fields contain trusted, checked-in HTML. Use root-relative content paths such as `/locations/index.html`. In Astro markup, pass internal links and images through `url()` from `src/lib/urls.ts`; render rich text through `richHtml()` so the `/utah-cancer` deployment base is applied. Do not use these helpers for untrusted remote HTML.

`public/` files are copied into `dist/`. Do not edit or commit `dist/`, `.astro/`, or `node_modules/`. Production builds include public assets, not repository tooling or private environment files.

## Validation

`npm run verify` checks types, builds the site, checks content references, checks local links and CSS/image/script assets, verifies shared layout/script inclusion, parses browser scripts, and verifies retired-clinic redirects. It is suitable for ongoing content changes.

`npm run test:migration` is a separate, temporary migration guard. Its compact fingerprints record the published state at commit `e910dc7`, including all page text, metadata, element structure, link/image destinations, image bytes, and global CSS bytes. It intentionally ignores formatting whitespace and shared chrome, and allows the newsletter handler to move from inline HTML into its page script. This check will fail after intentional content or design changes; keep the baseline immutable while reviewing the migration, and retire the migration check after acceptance rather than updating it to hide differences. Browser review covers interactions and appearance that static checks cannot prove.

## Publishing

The Astro migration was reviewed locally and publication was authorized on September 15, 2026. The pre-migration static baseline is `e910dc7`.

The prepared workflow, `.github/workflows/pages.yml`, uses the [official Astro GitHub Pages approach](https://docs.astro.build/en/guides/deploy/github/), with an explicit manual trigger and a main-branch guard.

For releases:

1. Run `npm run verify` and the migration comparison; review the production preview together.
2. Use **Settings → Pages → Source → GitHub Actions**. Publishing the source tree with the old branch/Jekyll setup would not build Astro.
3. Commit and push the approved migration to `main`.
4. Run **Publish Astro to GitHub Pages** manually from Actions, selecting `main`. It verifies and uploads `dist/`, then deploys that artifact.
5. Confirm the successful deployment's commit and check the live home page, nested detail URLs, directory links, filters, portraits, and clinic redirects.

No automatic push deployment is configured. Run the workflow explicitly when an approved change is ready to publish.
