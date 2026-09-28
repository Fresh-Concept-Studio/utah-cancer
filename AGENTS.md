# Working on Utah Cancer Specialists

## Preserve Sanity content

- Sanity project `spba0u9p`, dataset `production`, is authoritative for CMS-managed content. Read `docs/sanity-cms.md` before changing content or publishing.
- Git owns templates, styles, scripts, Studio schemas, and repository image files. See `src/lib/content.ts` for which content comes from Sanity and which remains in code.
- The CMS content files under `src/data/` are migration/development fallbacks, not an up-to-date copy of Sanity. Git and Sanity do not synchronize content automatically.
- Code and design changes should continue reading CMS values. Do not replace CMS bindings with hardcoded text or force `SANITY_USE_CMS=false` in production to make a repository content edit appear.
- Do not run `npm run cms:import`, dataset imports with `--replace`, or `createOrReplace` from repository snapshots for routine edits. These can overwrite newer Sanity changes. Bulk replacement requires an explicit migration/restore request, a fresh dataset backup, and a reviewed diff.

## Changing CMS content from a coding agent

1. Fetch the current Sanity document and check for an existing draft before preparing an edit. Use an authenticated client with `useCdn: false` and the raw perspective when inspecting both published and draft documents. Search for an existing record before creating one.
2. Base the edit on that fresh content. Patch only the fields requested; preserve unrelated fields, document IDs, array item `_key` values, and asset references. For arrays, target the relevant `_key` where possible.
3. Guard programmatic patches with the fetched `_rev` using the JavaScript client's `ifRevisionId(rev)`. If the revision changed, fetch again and review the differences before retrying. Do not retry by removing the revision guard.
4. Preserve editorial drafts. Do not replace, delete, or publish someone else's entire draft to deliver an unrelated change. If the same field has conflicting draft/published edits and the request does not resolve them, ask which value is intended. Publishing authorization does not automatically cover unrelated draft edits.
5. Re-read after the mutation to confirm the intended fields changed. If a local fallback needs updating, copy the relevant confirmed CMS values into it; do not send a stale local record back to Sanity.
6. If CMS access is unavailable, prepare the change and report that it is not applied to Sanity. A Git-only edit to fallback content does not complete a live CMS content request.

## Page editing

- Main-page text lives in the Sanity page document’s `editorContent` array, addressed by stable `_key`/`key` values. Uploaded page images live in `editorImages`. `src/data/page-content.json` and inline template defaults are development fallbacks. Preserve existing keys when editing templates.
- Job openings live in the Careers page’s `jobs` array. Leadership groups and media appearances live in `siteSettings`.
- `scripts/prepare-cms-page-editing.mjs` is an additive migration with a dry run by default. It backs up current records, guards revisions, adds missing fields/items, and preserves existing editorial values. Review its dry-run output before applying.

## Images and schemas

- Check the current CMS image reference before replacing an image. The site supports repository paths and Sanity assets; preserve the intended source and update alt text where needed.
- Use `src/lib/images.ts` for image variants. Repository files have named variants; Sanity uploads use CDN transformation parameters. Preserve Studio crop and focal-point settings.
- Schema changes must preserve existing content. Do not rename/remove fields or rewrite records as an incidental part of a visual change; plan a migration when needed.

## Verification and publishing

- Use Node.js >=22.12.0. Run checks appropriate to the change; `SANITY_REQUIRED=true npm run verify:production` validates against published CMS content before a production release. Documentation-only changes do not need a site build.
- Git pushes do not deploy this site. The manual GitHub Actions workflow is `.github/workflows/pages.yml`; publishing in Sanity is configured to trigger it via a webhook.
- Publish/deploy within the user's authorized scope. After a requested release, confirm the workflow succeeded and verify the relevant page and assets on `https://utahcancer.com`.
- Keep credentials and dataset backups out of Git and tool output. Preserve unrelated working-tree changes.
