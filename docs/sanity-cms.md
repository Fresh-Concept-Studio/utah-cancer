# Sanity CMS

The Utah Cancer Specialists marketing site uses Sanity project `spba0u9p`, production dataset `production`, and the Studio at <https://utah-cancer-specialists.sanity.studio/>. The project belongs to the Fresh Concept organization.

Sanity stores public marketing content only. Never enter patient information, contact-form submissions, job applications, medical records, insurance details, or other private data. Contact and job forms remain outside the CMS.

## Git, Sanity, and coding agents

Sanity is authoritative for CMS-managed content. Git holds the website code, Studio schemas, repository image files, and older content files used for migration and local fallback. `src/lib/content.ts` defines which values the production build reads from Sanity.

There is no automatic content synchronization in either direction. Publishing in Sanity triggers a website build; it does not commit updated content to Git. Editing a fallback content file in Git does not update Sanity.

Codex instructions live in [AGENTS.md](../AGENTS.md). [CLAUDE.md](../CLAUDE.md) imports that same file for Claude Code, so the rules are maintained in one place. For existing sessions, ask the agent to read the new instructions before continuing.

For content edits from either agent, read the current CMS record, check for drafts, and patch only the requested fields. Use the current document revision as a condition on API patches so a concurrent editor's changes cause a conflict instead of being overwritten. Preserve unrelated draft work. If a local fallback is refreshed, derive it from the confirmed CMS content.

**Do not use `npm run cms:import` for routine updates.** It generates records from repository content and imports them with `--replace`, which can overwrite newer CMS edits. It is a migration/restore command. `npm run cms:export` also exports from repository files, not from the live Sanity dataset, so its output is not a current CMS backup.

These agent instructions guide behavior; they are not an access-control mechanism. Revision conditions protect individual API patches when used, while project permissions control who can write to Sanity.

## Editing and publishing

1. Sign in to the Studio.
2. Open **Website pages**, search by page name or address, and click the page. **Main pages**, **Providers**, and **Locations** provide shorter lists for common edits.
3. Make the change and click **Publish**.
4. Publishing calls a Sanity webhook that dispatches the repository's Pages workflow. GitHub Actions fetches published content, runs validation and regression tests, builds the static site, and deploys it to GitHub Pages.

Drafts do not affect the public website. A published edit usually appears after the GitHub Pages workflow completes. Use the GitHub Actions run as the deployment audit trail.

## Access model

Fresh Concept and each designated client editor should use their own Sanity login. Review the roles available on the project’s current plan and grant the access needed for editing and publishing. Keep account administration separate when the plan supports that. Remove access when an editor no longer needs it.

## Local development

- `npm run cms:studio` starts the Studio.
- `npm run cms:build` validates and builds the Studio.
- `npm run build` fetches published Sanity content. If Sanity is unavailable locally, it uses the checked-in migration source as a development fallback.
- `SANITY_REQUIRED=true npm run build` fails instead of falling back and matches CI behavior.
- `SANITY_USE_CMS=false npm run build` deliberately uses the checked-in source.
- `npm run cms:export` regenerates `.sanity/initial-content.ndjson` from the migration source.

The project ID and public dataset name are safe to commit. Do not commit Sanity write tokens or the GitHub webhook authorization token.

## Client editing experience

- **Website pages** lists all public content pages, including profiles, with name/address search and type filters. Redirects and error pages are excluded.
- **Page content** groups main-page text and links in website order. **Images** contains upload controls and image descriptions. **Search appearance** changes browser/search metadata.
- **Related content** links to the shared records used on a page. Providers, clinics, leadership, and media are maintained once where applicable. Some existing provider clinic cards have distinct suite/address details; those were preserved instead of being merged.
- **Published website** shows the live page, not a draft preview. Drafts stay out of builds. Publishing triggers the existing verified GitHub Pages workflow.
- Bios and existing formatted content use plain text controls that preserve the HTML layout. New paragraphs can be appended to content fields. Changes to the page’s layout, new section types, navigation, and form structure remain development work.
- **Job Listings** in the sidebar opens a focused native editor for the existing Careers page’s `jobs` array. Add, edit, reorder, or remove listings, then Publish. It shares the Careers document and draft; it is a navigation shortcut, not a separate permission boundary. Publishing includes any pending Careers changes. The complete page remains available under Main pages. About page statistics are editable under its numbers section. Leadership groups and media appearances are under **Shared content & contact cards → Leadership directory & media**.
- **Clinical Trials** below the navigation divider lists individual study records. Create a record, fill in the study details and contact information, and Publish to add it to the website. Use Unpublish or Delete from a record's menu to remove it. Each record supports an NCT ID, title, cancer category, description, study link, enrollment label, contact name, phone, email, and optional PDF upload or link. The website automatically groups published studies and calculates the count and filters. General page copy remains under Main Pages → Late-Phase Clinical Trials.
- The group named **Leadership** is always sorted by last name when the website builds, including new CMS additions. Executive Leadership and Physician Executive Committee retain their CMS order. A leader's **Profile photo** and **Directory photo** can be different images.
- Native Sanity uploads now render correctly in cards and detail pages, including Studio crop and focal point settings.

See [the client walkthrough](cms-client-walkthrough.md) for a short Loom outline.

## Content model and migration

Main-page fields are `editorContent` (stable keyed text/link/number entries) and `editorImages` (keyed image objects). Templates use `pageEditor` to read the published values. Existing inline defaults and `src/data/page-content.json` support local fallback builds. New keys must be added to both the template and the relevant CMS record; changing a fallback does not update an existing published value.

The additive migration is `node scripts/prepare-cms-page-editing.mjs` (dry run); `--apply` writes only missing fields/items using document revision guards and creates a local backup under `~/.codex/backups/utah-cancer`. It does not replace existing content values. This is separate from the old bulk `cms:import` command.

Before releasing schema changes, run the Studio TypeScript check, `npm run cms:build`, and Sanity document validation. Before releasing website changes, run `SANITY_REQUIRED=true npm run verify:production`. Studio code is deployed separately using `npm run cms:deploy`; the static website uses the GitHub Pages workflow.

## Clinical trial records

`clinicalTrial` documents own study listings. Production uses only published records; an empty collection produces an empty list, never the old hardcoded studies. `src/data/clinical-trials.json` is a development fallback captured from the live migration.

The one-time `node scripts/migrate-clinical-trials.mjs` command reviews a mapping from the old page fields to individual records. `--apply` creates missing records from fresh Sanity values with a source revision guard and a dataset backup. After deploying the record-driven website, `--cleanup` removes the migrated fields from the old page with revision guards. Conflicting drafts or existing records stop the migration. Do not rerun this migration to restore a trial an editor has removed.
