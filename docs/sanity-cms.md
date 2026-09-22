# Sanity CMS

The Utah Cancer Specialists marketing site uses Sanity project `spba0u9p`, production dataset `production`, and the Studio at <https://utah-cancer-specialists.sanity.studio/>. The project belongs to the Fresh Concept organization.

Sanity stores public marketing content only. Never enter patient information, contact-form submissions, job applications, medical records, insurance details, or other private data. Contact and job forms remain outside the CMS.

## Editing and publishing

1. Sign in to the Studio.
2. Open the relevant provider, location, specialty, leader, article, resource, policy, shared sidebar, or page-settings record.
3. Make the change and click **Publish**.
4. Publishing calls the repository's `sanity-publish` webhook. GitHub Actions fetches published content, runs validation and regression tests, builds the static site, and deploys it to GitHub Pages.

Drafts do not affect the public website. A published edit usually appears after the GitHub Pages workflow completes. Use the GitHub Actions run as the deployment audit trail.

## Access model

Fresh Concept and the designated client editor should each use their own Sanity login and have Administrator access to this project. This avoids shared credentials and fits the Free plan's available roles. Remove access when an editor no longer needs it.

## Local development

- `npm run cms:studio` starts the Studio.
- `npm run cms:build` validates and builds the Studio.
- `npm run build` fetches published Sanity content. If Sanity is unavailable locally, it uses the checked-in migration source as a development fallback.
- `SANITY_REQUIRED=true npm run build` fails instead of falling back and matches CI behavior.
- `SANITY_USE_CMS=false npm run build` deliberately uses the checked-in source.
- `npm run cms:export` regenerates `.sanity/initial-content.ndjson` from the migration source.

The project ID and public dataset name are safe to commit. Do not commit Sanity write tokens or the GitHub webhook authorization token.
