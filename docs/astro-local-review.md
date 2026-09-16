# Astro migration: local review

Review date: September 15, 2026.

## Release state

- Published baseline: `e910dc774aa8a575a3d3bd55e7eeb96ef96936e9`.
- All 32 pre-existing portrait/tool changes were pushed before migration. GitHub Pages run `35019600442` succeeded; the 32 files were verified live byte-for-byte.
- Migration implementation branch: `codex/astro-migration`.
- Release uses the manual **Publish Astro to GitHub Pages** workflow on `main`.
- The user reviewed the local site and authorized publication on September 15, 2026.

## Local review links

Use the production preview, which serves the built output:

- [Home](http://127.0.0.1:4323/utah-cancer/)
- [Providers](http://127.0.0.1:4323/utah-cancer/providers/index.html)
- [Locations and map](http://127.0.0.1:4323/utah-cancer/locations/index.html)
- [Types of Cancer](http://127.0.0.1:4323/utah-cancer/specialties/index.html)
- [Leadership](http://127.0.0.1:4323/utah-cancer/leadership.html)
- [Clinical Trials](http://127.0.0.1:4323/utah-cancer/clinical-trials.html)
- [Events](http://127.0.0.1:4323/utah-cancer/events/index.html)

The live-edit development server runs at http://127.0.0.1:4322/utah-cancer/.

## Changes

- 151 hand-maintained HTML files are replaced by 50 Astro files, including 32 unique body views, shared layouts/components, and three route files.
- Four detail templates produce 115 provider, leader, cancer-type, and location pages from data.
- Shared navigation, footer, calls to action, tabs, sidebar content, and browser behavior are defined once.
- Provider, leadership, cancer-type, and location listings reference shared records. Clinic map markers are generated from location records. Repeated provider clinic cards reference 32 preserved address variants.
- Page source is about 0.78 MB, compared with 2.84 MB of original HTML. Images were moved into `public/images/` unchanged.
- Existing `.html` paths, directory indexes, metadata, page content, design, and clinic redirects are retained.
- Documentation and a manual deployment workflow are prepared for the eventual approved release.

## Verification completed

- `npm run verify`: passed. Astro type checks report zero errors, warnings, or hints; 151 pages build; all four ongoing integration checks pass.
- `npm run test:migration`: both baseline comparison checks pass for all 151 pages and all published images/global styles.
- HTTP checks: all 151 `.html` pages plus six directory entry points return 200 on both development and production preview servers (314 checks).
- Browser: home renders correctly; story carousel advances; provider filters show 3 supportive-care providers and 1 result for Gary; Gary remains first in that category.
- Browser: provider tabs scroll to the correct section; cancer-type search finds Breast Cancer; FAQ disclosure expands.
- Browser: Davis County filter shows 2 clinics; Bountiful search narrows it to 1. All 13 Google Maps markers render in the production preview. The Bountiful marker opens its information card with the correct local detail-page link.
- Browser: event Fundraisers filter shows 2 matching cards; Breast cancer trial filter shows 2 trials and updates its pressed state.
- Browser: mobile homepage, leadership, provider, and clinical-trials layouts render; mobile navigation and the Company menu work; navigation closes after selecting a destination. Inspected pages have no horizontal page overflow.
- Browser: Nidhi Sharma and Sandy Jones portraits load; clinical-trial contact phone/email links are preserved; the removed clinical-trials stats row stays removed.
- Browser: the retired Madison URL automatically redirects to the local locations index.
- No application console errors were observed during these interaction checks.

## Review boundaries

This preserves the existing site rather than introducing new forms or service integrations. Existing placeholder links, registration actions, newsletter behavior, and map placeholders remain as published. No message, registration, or payment was submitted during testing. Individual event and story bodies remain custom views; shared site layout is centralized.

The local review is complete and publication is authorized. Live verification must confirm the GitHub Pages deployment and test the public URLs; the deployment run records the released commit.
