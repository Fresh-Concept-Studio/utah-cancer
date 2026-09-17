# Production launch and SEO handoff

This site is prepared to move from the GitHub Pages project URL to `https://utahcancer.com` without changing source code at launch time.

## Completed in the site

- Every indexable page has a unique title and meta description.
- The five existing policy and patient-rights pages are preserved at their current public paths with their current wording.
- Canonical, Open Graph, Twitter, and JSON-LD metadata use the configured deployment URL.
- `sitemap.xml` includes all indexable pages and excludes redirect stubs.
- `robots.txt` and page-level robots metadata keep the GitHub preview out of search results.
- Production builds remove `noindex`, allow crawling, and advertise the production sitemap.
- Automated checks cover metadata uniqueness, canonical URLs, crawl controls, social metadata, structured data, and redirect destinations.
- Public pages use clean trailing-slash URLs, and internal links, canonical metadata, the sitemap, and redirect destinations all use that same format.
- `cloudflare-redirects.csv` contains 170 clear one-to-one legacy mappings in Cloudflare Bulk Redirect CSV format. Each mapping includes both trailing-slash variants, for 340 import rows, and applies to the apex domain and `www`.
- `legacy-url-inventory.csv` records all 213 URLs from the old WordPress sitemaps. All older patient-resource URLs now have a launch disposition; eleven useful pages were recreated at their original paths.
- `retired-legacy-urls.md` lists 22 WordPress archive, test, obsolete COVID, and former-location URLs that should return `410 Gone` after Cloudflare is enabled.

## Before changing DNS

1. In GitHub Pages settings, set the custom domain to `utahcancer.com`. Keep **Enforce HTTPS** on once GitHub has issued the certificate.
2. In the repository's Actions variables, set:
   - `SITE_URL` = `https://utahcancer.com`
   - `BASE_PATH` = `/`
   - `SITE_INDEXABLE` = `true`
3. Run the Pages workflow and verify the deployment succeeds before directing public traffic to it.
4. In Cloudflare, import `cloudflare-redirects.csv` into a Bulk Redirect List and enable that list with a Bulk Redirect Rule.
5. Add a hostname redirect from `www.utahcancer.com/*` to `https://utahcancer.com/$1` with a permanent `301`, preserving the query string. This makes the apex domain the single canonical host.

The Bulk Redirect CSV intentionally has no header row because Cloudflare's importer requires that format. It preserves query strings and performs exact-path permanent redirects. Both slash variants are present because Bulk Redirects use static source matches.

## DNS cutover order

1. Lower DNS TTL in advance if the existing provider permits it.
2. Confirm the production build at the GitHub Pages origin and spot-check `robots.txt`, `sitemap.xml`, the homepage, one provider, one location, and one specialty.
3. Point the apex and `www` records through Cloudflare to the GitHub Pages origin, using Cloudflare's proxied status so the redirect rules execute.
4. Use **Full (strict)** SSL/TLS after the GitHub certificate is active.
5. Test the apex and `www` hosts over HTTPS, including an old provider URL, old specialty URL, and old clinical-trial URL.
6. Submit `https://utahcancer.com/sitemap.xml` in Google Search Console and monitor indexing, Page indexing, and 404 reports.

## Immediately after cutover

- Confirm production pages do not contain `noindex`.
- Confirm canonical and `og:url` values start with `https://utahcancer.com/`.
- Confirm `/robots.txt` allows crawling and names the production sitemap.
- Confirm every imported legacy URL returns one `301` hop to a `200` production page.
- Keep the redirects active for at least one year; keeping them indefinitely is preferable for backlinks and bookmarks.
- Spot-check the eleven recreated patient-resource URLs and the contextual links from Patient Resources, Programs & Services, Radiation Oncology, and the Amy Jensen story.

## Rollback

If the production build is unavailable during cutover, restore the previous DNS records. Do not change the three repository variables back while production traffic is still pointed at the new deployment; they control canonical URLs and crawlability as well as asset paths.
