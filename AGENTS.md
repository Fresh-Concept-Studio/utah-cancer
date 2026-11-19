# Working on Utah Cancer Specialists

## Content lives in `content/`

- Since the Phase 0 migration (November 2026), site content is stored in this repository under `content/` as JSON files, one per record. Read `docs/content.md` before changing content.
- Edit content by changing the relevant file in `content/`. Change only the requested fields; keep file names, `order` values, page text keys, and unrelated fields. Use `npm run verify` before a release.
- Git owns templates, styles, scripts, Studio schemas, repository image files, and now content. The site editor (SiteAdjust) commits to `content/`; commit messages name the person who made each change.
- Sanity project `spba0u9p`, dataset `production`, is kept read-only as a fallback copy from the migration. Do not write to, import into, publish, or delete from Sanity. Sanity edits do not reach the site unless the build is switched with `CONTENT_SOURCE=sanity`.
- Do not run `npm run cms:import`, dataset imports, or `scripts/export-sanity-to-repo.ts` into `content/`. Re-exporting would replace newer content with Sanity's older copy.
- `src/data/` is an older development snapshot (`CONTENT_SOURCE=local`), not current content.
- Templates read content through `src/lib/content.ts`. Do not hardcode content into templates, and keep the `data-sa` attributes on records so the site editor can map page elements to content files.

## Page editing

- Main-page text lives in each page file's `editorContent` array (`content/pages/*.json`), addressed by stable `key` values that match `edit.text("key", …)` in `src/views/`. Page images live in `editorImages`. Inline template defaults are fallbacks. Preserve existing keys when editing templates.
- Job openings live in `content/jobs/` and events in `content/events/`. Leadership groups and media highlights live in `content/settings.json`.

## Images and schemas

- Check the current image reference in the content file before replacing an image. The site supports repository paths and Sanity CDN URLs (kept working because the Sanity project is kept); preserve the intended source and update alt text where needed.
- Use `src/lib/images.ts` for image variants. Repository files have named variants; Sanity uploads use CDN transformation parameters. Preserve Studio crop and focal-point settings.
- Schema changes must preserve existing content. Do not rename/remove fields or rewrite records as an incidental part of a visual change; plan a migration when needed.

## Verification and publishing

- Use Node.js >=22.12.0. Run checks appropriate to the change; `npm run verify:production` validates the production build from `content/` before a release. Documentation-only changes do not need a site build.
- Git pushes do not deploy this site. The manual GitHub Actions workflow is `.github/workflows/pages.yml`; the site editor dispatches it after content commits (`content_only=true`).
- Publish/deploy within the user's authorized scope. After a requested release, confirm the workflow succeeded and verify the relevant page and assets on `https://utahcancer.com`.
- Keep credentials and dataset backups out of Git and tool output. Preserve unrelated working-tree changes.
