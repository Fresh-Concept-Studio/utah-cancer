# Error pages

The production build includes a themed `404.html` at the deployment root. GitHub Pages serves this file automatically for missing routes.

Matching error documents are also available for upstream or Cloudflare error handling:

- `/errors/400/` — malformed request
- `/errors/403/` — forbidden or restricted request
- `/errors/408/` — request timeout
- `/errors/429/` — rate limited request
- `/errors/500/` — unexpected server error
- `/errors/502/` — bad gateway
- `/errors/503/` — temporary outage or maintenance
- `/errors/504/` — gateway timeout

GitHub Pages only assigns the 404 document automatically. Configure the relevant Cloudflare Custom Pages or error-response rules to use the matching built document for the other status codes. Keep the original HTTP status when serving the page; do not redirect errors to a `200 OK` route.
