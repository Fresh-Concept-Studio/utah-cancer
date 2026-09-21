# Utah Cancer Specialists Analytics

Configured September 21, 2026 with `kyle@freshconcept.co`.

| Resource | Value |
| --- | --- |
| Analytics account | Fresh Concept — `285048390` |
| GA4 property | Utah Cancer Specialists — Website — `555315661` |
| Web stream | utahcancer.com — Production — `15820932884` |
| Measurement ID | `G-68V7TELGCD` |
| Production URL | `https://utahcancer.com` |
| Reporting time zone / currency | America/Denver / USD |
| Dashboard | https://analytics.google.com/analytics/web/#/a285048390p555315661/reports/intelligenthome |

## Agency and client access

Kyle is the current administrator. This is a dedicated client property within the requested Fresh Concept account; its data is separate from Fresh Concept's own website. It is agency-managed, not a client-owned Analytics account.

Give client reporting users **Viewer access to this property only**, or Analyst access if they need explorations. Do not grant access to the entire Fresh Concept account. Add a client administrator only after the client identifies its authorized Google account. No client invitations were sent during setup because no recipient was supplied.

For independent client ownership/offboarding, create a client-owned Analytics account and move this property rather than starting another property; review Google's move requirements first. A separate client-owned account with agency access is the stronger long-term ownership arrangement. Keep this property and stream dedicated to UCS; do not share its measurement ID with another client.

## Measurement

The site owner requested automatic measurement on the public marketing site without an opt-in banner. `src/components/Analytics.astro` installs the local loader only in an indexable production build for `https://utahcancer.com`. `src/data/analytics.ts` holds the public ID, host, and excluded route prefixes. Changes are version-controlled with the website rather than managed through a separate GTM container.

Included:

- One `page_view` per eligible page load, with the canonical path and static page title. GA4 also supplies its standard session and engagement measurements.
- Traffic sources via referring **origin only** and filtered `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, and `utm_content`. Arbitrary query strings, fragments, search terms, and full referrer paths are not sent. Invalid campaign values and `utm_term` are redacted.
- Enhanced measurement: scrolls and supported embedded YouTube video engagement. History-based page views, automatic outbound clicks, site search, form interactions, and automatic downloads are off. External YouTube links count as outbound clicks, not completed video plays.
- Filtered `click` events for outbound public destinations; destination domain only, without its path/query.
- `file_download` for public document/archive links, with extension and URL without query/fragment.
- `contact_click` for phone/email links, with only `contact_method` (`phone` or `email`), never the telephone number or email address. Registered as a key event **once per session**, with **no monetary value**. This is contact intent, not a completed call, lead submission, or appointment.
- Event-scoped custom dimension **Contact method** (`contact_method`).

Excluded:

- Contact and job-application pages and their child paths; reserved portal, login, billing, appointment, scheduling, and error routes. Redirect stubs and standalone email signatures do not include the tag.
- Any page containing a form (a runtime safeguard for future forms), editor sessions, editor URL parameters, iframes, local development, and preview hosts.
- Portal/payment/form-service destinations (`navigatingcare.com`, `poscorp.com`, `formsubmit.co`) and matching sensitive route names.
- Browsers that opt out on **Privacy Policy → Website analytics and your choices**, send Global Privacy Control, or enable Do Not Track.

## Property settings

- Health industry; 101–500 employees, based on the UCS website's published 382 employees.
- Traffic and engagement reporting objectives.
- Event and user retention: 14 months; reset on new user activity off. Aggregated standard reports are not governed by these retention controls.
- Google signals, advertising personalization (all regions), user-provided data, and user-ID collection off/not implemented. No advertising account or cross-domain portal linking.
- Granular location/device reporting enabled for normal marketing reports.
- Email redaction enabled, plus 28 query keys: `email`, `email_address`, `name`, `first_name`, `last_name`, `firstname`, `lastname`, `phone`, `telephone`, `address`, `dob`, `date_of_birth`, `patient`, `patient_id`, `mrn`, `diagnosis`, `condition`, `message`, `comments`, `search`, `q`, `s`, `query`, `token`, `code`, `siteadjust`, `sitewalk`, `submitted`.
- First-party, host-only cookies expire after 395 days without rolling renewal. Advertising storage, advertising user data, and ad personalization signals remain denied. The site explicitly enables analytics storage without presenting a consent banner, per the owner's instruction.

## Operations and validation

Run `npm run verify:production` with Node >=22.12.0. Tests cover production-only inclusion, form/error exclusions, duplicate prevention, URL/referrer sanitization, campaign attribution, portal/payment exclusion, and persistent opt-out behavior.

Deploy through **Publish Astro to GitHub Pages** (`pages.yml`). Confirm the exact source revision succeeds. Check the live tag, a public page, the contact/job-application pages, the privacy controls, and GA4 Realtime. Standard reports/custom dimensions can take 24–48 hours to populate. Do not fabricate contact submissions or phone calls to test Analytics.

Use the browser privacy-policy opt-out when reviewing the production site to avoid counting staff visits. IP-based internal traffic filters remain unconfigured because no stable agency/client public IP ranges were supplied. Keep new filters in Testing before activating them.

Before adding new forms, authentication, portals, new analytics events, advertising integrations, or dynamic URLs, review the exclusions and payloads again. The current public-marketing scope is an implementation choice made by the site owner; it is not a legal compliance certification. A cookie banner is not itself authorization to disclose PHI, and the absence of a banner does not establish consent compliance in every visitor jurisdiction.

References:

- [Google Analytics account structure](https://support.google.com/analytics/answer/9679158?hl=en)
- [Move a GA4 property](https://support.google.com/analytics/answer/9305872?hl=en)
- [Google Analytics healthcare guidance](https://support.google.com/analytics/answer/13297105?hl=en)
- [HHS tracking guidance, including the court-vacated public-page interpretation](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html)
- [GA4 configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
