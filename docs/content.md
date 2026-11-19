# Site content

Since the Phase 0 migration (November 2026), the website's content lives in this
repository under `content/` as JSON files. The site editor (SiteAdjust v2,
`edit.utahcancer.com`) commits to these files, and a coding agent can edit them
directly. Every change is a Git commit, so history and rollback come from Git.

Sanity (project `spba0u9p`, dataset `production`) is kept **read-only** as a
fallback copy of the content as it was at migration. Nothing was deleted from Sanity.
Edits made in Sanity after the migration do **not** reach the website unless the
build is switched back to Sanity (see below).

## Layout

| Folder | One file per | Notes |
| --- | --- | --- |
| `content/jobs/` | job opening | Shown on the Careers page, in `order` |
| `content/events/` | event | Shown on the Events page |
| `content/providers/` | provider | Detail page + directory card |
| `content/locations/` | clinic | Detail page + directory card + map |
| `content/specialties/` | cancer type | Detail page + directory card |
| `content/leaders/` | leader | Detail page |
| `content/clinical-trials/` | trial | Late-phase trials page |
| `content/podcast-episodes/` | episode | Homepage podcast list (newest first by date) |
| `content/news/` | article | News pages |
| `content/resources/` | resource page | |
| `content/policies/` | policy page | |
| `content/pages/` | site page | Page text (`editorContent`, by key), page images (`editorImages`), title, description, page settings |
| `content/shared-content/` | shared HTML block | |
| `content/provider-locations/` | provider clinic card | |
| `content/settings.json` | — | Main phone, leadership groups, media highlights |

File names are readable slugs (`jobs/patient-advocate-cancer-center.json`). The name
stays the same when a record's title changes. `order` sets list order; records without
it come after ordered records, by file name. The loader removes `order` before
templates see the record.

Uploaded images still point at the Sanity CDN (`cdn.sanity.io`), with crop and focal
point already applied in the URL. Those URLs keep working because the Sanity project is
kept. New uploads from the site editor will be stored elsewhere.

## Editing

- Change only the fields you mean to change and keep the JSON formatting (2-space indent, trailing newline).
- Page text is addressed by its key in `editorContent` (for example `text-cb5b69a9d7`); the same keys appear in `src/views/*.astro` as `edit.text("key", "default")`.
- To add a job or event, copy an existing file, give it a new file name and `order`.
- Run `npm run verify` before releasing.

Templates render each record's file as a `data-sa` attribute (for example
`data-sa="jobs/patient-advocate-cancer-center"`) so the site editor can map a clicked
element to the file it comes from. The value is added by the loader (`contentId`); it
is not stored in the files.

## Content source switch

`CONTENT_SOURCE` chooses where the build reads content:

| Value | Source |
| --- | --- |
| `repo` (default) | `content/` |
| `sanity` | Published Sanity documents (read-only fallback) |
| `local` | The old development snapshot in `src/data/` (also `SANITY_USE_CMS=false`) |

Both `repo` and `sanity` go through the same processing in `src/lib/content.ts`, so a
switch changes only where the data comes from. In GitHub Actions, set the repository
variable `CONTENT_SOURCE=sanity` to publish from Sanity without a code change. Remove
the variable to return to `content/`.

At migration, building from `content/` and from Sanity produced identical HTML for all
180 output files (ignoring the per-build stylesheet version and the new `data-sa`
attributes).

## Publishing

Publishing still uses the manual Pages workflow (`.github/workflows/pages.yml`).
The site editor dispatches it with `content_only=true` after committing content.
If nothing outside `content/` changed since the commit that is live, the workflow
skips the type check. Regression tests run in a separate job that never delays the
release.

GitHub Pages sends `cache-control: max-age=600`, which would let browsers show a page
up to 10 minutes old after a release. A Cloudflare Response Header Transform Rule
(zone `utahcancer.com`, rule "HTML: browsers revalidate on every visit", added
November 2026) replaces that header on HTML:

- Match: `(http.host in {"utahcancer.com" "www.utahcancer.com"} and http.response.content_type.media_type eq "text/html")`
- Action: set static `Cache-Control: no-cache`

Browsers keep the page but check with the server on each visit, so an unchanged page
costs a `304 Not Modified` and a published change shows on the next load. Cloudflare
does not edge-cache HTML here (`cf-cache-status: DYNAMIC`), which is why a Cache Rule's
Browser TTL setting would not apply to it. Images, CSS and other files keep their
1-day browser cache. Stylesheets carry a per-build `?v=` stamp, and a replaced image
should get a new file name so visitors don't see the old one.

## Migration record

`scripts/export-sanity-to-repo.ts` produced `content/` from the published Sanity
dataset. It reads Sanity only and refuses to run when `content/` exists, because
re-running it would replace newer edits with Sanity's older copy. To compare against
Sanity later, export to another folder:

```sh
npx tsx scripts/export-sanity-to-repo.ts --out /tmp/sanity-content
```
