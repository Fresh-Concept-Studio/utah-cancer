# SiteAdjust editing and publishing

This repository includes `.github/workflows/siteadjust-publish.yml` for explicit
client-approved releases. The existing manual `pages.yml` workflow remains
available. Neither workflow deploys on an ordinary Git push.

## Edit and review

Open the editing URL supplied by the SiteAdjust service. The public GitHub Pages
URL is the published site; it does not serve drafts or the editing backend.

1. Use **Comment** to select text or an image, **Ask AI** for a change request,
   or **New page** to describe a new page.
2. Open the punch list and submit the requested changes. SiteAdjust edits Astro
   source in an isolated workspace, then runs `npm run verify`.
3. Click **Preview changes**, navigate through the affected pages, and review
   the result. You can submit further edits before publishing.
4. Click **Approve & publish** when the result is ready for the real website.
   This pushes the reviewed source commit to this repository's `main` branch
   and starts its GitHub Actions build and Pages deployment.
5. Wait for **Your changes are live**. SiteAdjust verifies a public receipt for
   the exact approved revision before displaying that result.

The public destination is https://fresh-concept-studio.github.io/utah-cancer/.
Failed builds retain the current preview; failed deployments provide a retry.
If the live branch changes outside SiteAdjust, reconcile the editing checkout
and rebuild/review before continuing. Changes are never force-pushed.

## Run the editing service

Use Node 24, the SiteAdjust tool checkout, and a **dedicated clone** of this
repository with its real GitHub `origin`. Keep the clone clean. Install its
dependencies with `npm ci` and build its initial preview with `npm run verify`.
Do not reuse a developer's active working directory for the editing server.

The service needs authenticated `gh`, Git push access, and a private Anthropic
API key file outside the repository. Start it using actual local paths:

```sh
node /path/to/siteadjust/bin/sitewalk.js serve /path/to/dedicated-utah-checkout \
  --port 4747 --base-path /utah-cancer \
  --token "$SITEWALK_TOKEN" \
  --driver anthropic-api --api-model claude-sonnet-5 \
  --api-key-file /private/path/to/anthropic-key \
  --publish-repo Fresh-Concept-Studio/utah-cancer
```

For local trials, open `http://127.0.0.1:4747/utah-cancer/?sitewalk=YOUR_TOKEN`
on the computer running the service. Keep the service running while editing
and publishing. For remote clients, host the service behind HTTPS with access
control; a localhost URL only works on the host computer. Current access uses
a shared editing token, not individual client accounts.

The server adds the toolbar to its preview responses. No editing token, Claude
key, or localhost loader should be committed or embedded into the public site.
Drafts and publication records are stored in the ignored `.sitewalk/` directory.
After publication, other development checkouts should pull the new `main`
before making further changes.
