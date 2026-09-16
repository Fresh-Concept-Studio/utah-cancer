# SiteAdjust editing and publishing

This repository includes `.github/workflows/siteadjust-publish.yml` for explicit
client-approved releases. The existing manual `pages.yml` workflow remains
available. Neither workflow deploys on an ordinary Git push.

## Edit and review

Open the private editing link supplied by the site owner: the public GitHub Pages
URL with `?sitewalk=YOUR_TOKEN`. Its loader opens an authenticated preview from
`https://siteadjust-utah-editor.vercel.app` over the public page. Ordinary visitors
see the published site. The editing service runs on Vercel; the owner's computer
does not need to stay on.

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

### Hosted service

The Vercel project `siteadjust-utah-editor` starts a persistent cloud workspace
on demand. That workspace holds a dedicated repository clone, generated previews,
drafts, and publication records. It saves a filesystem snapshot when stopped and
restores it on the next visit. A cold start can take a minute or two.

API and GitHub credentials are encrypted Vercel environment variables and are
passed to the worker process; they are not committed to this repository. Keep
the private editing link private: anyone with its shared token can edit and
approve publication. Individual client accounts are not implemented yet.

The initial trial allows approximately three hours of cumulative workspace
runtime, with 20-minute sessions extended when submitting edits. The owner must
explicitly extend the trial budget after it is exhausted. This is an application
guard, not an account-wide billing cap. Vercel compute, snapshots, and traffic use
the existing Pro allocation; Claude API usage is billed separately. Hosted image
uploads must be smaller than 3 MB.

### Local fallback

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
