# Clinic directory review — September 29, 2026

Compared all 15 public clinic directory entries with the corresponding Google Maps business listings. This is a point-in-time comparison, not clinic approval of Google's information. All 15 directory phone numbers matched Google; eight hours schedules differed. Provider contact boxes and provider location cards are separate content and can still contain shared numbers.

## Comparison

Hours below exclude weekends, which Google lists as closed for these clinics. “Other days closed” includes remaining weekdays. Unless stated otherwise, the website displayed Monday–Friday, 9 am–5 pm.

| Clinic / Google record | Directory phone (matches Google) | Google weekday hours | Finding |
| --- | --- | --- | --- |
| [Bountiful](https://www.google.com/maps/search/Utah+Cancer+Specialists+Bountiful+520+Medical/) | 801.296.6665 | Tue–Thu 9 am–5 pm; other days closed | Hours differ |
| [Cancer Center](https://www.google.com/maps/search/Utah+Cancer+Specialists+3838+S+700+E/) | 801.269.0231 | Mon–Fri 9 am–5 pm | Hours match |
| [UCS at Granger / West Valley](https://www.google.com/maps/search/Utah+Cancer+Specialists+2965+W+3500+S/) | 801.590.9900 | Mon–Fri 9 am–5 pm | Hours match; distinct from START in the same building |
| [Murray / IMC](https://www.google.com/maps/search/Utah+Cancer+Specialists+5131+Cottonwood/) | 801.263.3416 | Mon–Fri 9 am–5 pm | Hours match; Google says Suite 200, website says Building 3, Level 2 |
| [Jordan Valley / UCS West Jordan](https://www.google.com/maps/place/Utah+Cancer+Specialists+-+West+Jordan/@40.5904667,-111.9762886,17z/data=!3m1!4b1!4m6!3m5!1s0x87528f3d5f788e0d:0xcb6494b51301964c!8m2!3d40.5904667!4d-111.9762886!16s%2Fg%2F1tr9nx92) | 801.562.8732 | Mon–Fri 9 am–5 pm | Hours match; do not substitute the separate CommonSpirit listing's hours/phone |
| [Layton](https://www.google.com/maps/search/Utah+Cancer+Specialists+Layton+1492+Antelope/) | 801.525.3022 | Mon, Tue, Thu, Fri 9 am–5 pm; Wed closed | Hours differ |
| [Ogden](https://www.google.com/maps/place/Utah+Cancer+Specialists+-+Ogden/@41.1653878,-111.9707119,17z/data=!3m1!4b1!4m6!3m5!1s0x87530550dd2d3599:0x3e82007db3c6c65d!8m2!3d41.1653878!4d-111.9707119!16s%2Fg%2F11mbmq68dm) | 385.423.2855 | Mon–Tue 8 am–5 pm; Wed 8 pm–midnight; Thu midnight–5 pm; Fri closed | Hours differ; apparent overnight entry needs clinic verification |
| [Pleasant Grove](https://www.google.com/maps/search/Utah+Cancer+Specialists+Pleasant+Grove+1076+County/) | 801.492.9934 | Mon–Fri 9 am–5 pm | Hours match |
| [Provo](https://www.google.com/maps/search/Utah+Cancer+Specialists+Provo+395+Cougar/) | 385.375.2700 | Mon–Fri 9 am–4:30 pm | Hours differ; Google says 395 W. 1230 N. St. #104, website says 395 W. Cougar Blvd., Suite 104 / Sorenson Legacy Tower Building 4; confirm patient-facing wording |
| [Salt Lake](https://www.google.com/maps/search/Utah+Cancer+Specialists+389+S+900+E/) | 385.347.5500 | Mon–Fri 9 am–5 pm | Hours match |
| [Sandy Physical Therapy / Cancer Rehabilitation Centers](https://www.google.com/maps/place/Cancer+Rehabilitation+Centers/@40.6171404,-111.8568722,17z/data=!3m1!4b1!4m6!3m5!1s0x87528781fb90539d:0x71f493dcafe2a118!8m2!3d40.6171404!4d-111.8568722!16s%2Fg%2F12628cswx) | 801.456.9898 | Mon/Wed 9:30 am–2 pm; Tue/Thu 9:30 am–7:30 pm; Fri closed | Matches website's specific schedule |
| [St. Mark's / Salt Lake Radiation](https://www.google.com/maps/search/Utah+Cancer+Specialists+St+Marks+1250+3900/) | 801.456.8401 | Mon–Thu 8:30 am–4:30 pm; Fri 8:30 am–4 pm | Hours differ |
| [START Mountain Region](https://www.google.com/maps/search/START+Mountain+Region+2965+3500/) | 801.907.4750 | Mon–Fri 8 am–5 pm | Hours differ |
| [Orem / Timpanogos](https://www.google.com/maps/search/Utah+Cancer+Specialists+Orem+700+800/) | 385.241.2293 | Tue–Wed 9 am–5 pm; other days closed | Hours differ; Google says Suite 340, directory says Suite 140; provider card also says Suite 340. Confirm correct clinic/service before changing. |
| [Tooele](https://www.google.com/maps/place/Utah+Cancer+Specialists+-+Tooele/@40.5712265,-112.2932618,17z/data=!3m1!4b1!4m6!3m5!1s0x8752bc37fd7f578b:0x5cd13928f86aa712!8m2!3d40.5712265!4d-112.2932618!16s%2Fg%2F1v46_v9g) | 435.882.2365 | Mon/Wed 9 am–5 pm; other days closed | Conflicts with client correction of Mon/Tue. Website now uses Mon/Tue and asks patients to call for hours. |

## Provenance

- Commit `e03065b2b6b0f7a97d8f3f2f8de9c0ed5668c267` describes rebuilding locations with addresses and phone numbers scraped from the previous site. It does not establish clinic-by-clinic verification of hours.
- The old site's indexed `/locations-and-physicians/` content states a general Monday–Friday, 9 am–5 pm office schedule. That is not evidence that every clinic operates those hours.
- Shared provider phone/fax details were present before the provider scrape (including commit `c6a30cd`); their correctness for every provider is unconfirmed.
- Google entries were inspected individually, including expanded weekly schedules. Address and practice identity were used to distinguish UCS from other practices in shared buildings. Links above reopen the corresponding record or focused location search; Google may change its results later.

## Published corrections

- Added **EDEN (Death Entry)** under the footer's **Resources**, linking to <https://umap.dhhs.utah.gov/>. The former state portal, <https://umap.health.utah.gov/>, announces this move. Verified the new link from the live UCS footer opens “UMAP — Utah Mortality Application Portal,” with the Utah ID login button.
- Dr. Arango: retained one complete Bountiful entry, added Ogden, removed the duplicate Lakeview assignment; corrected the shared Bountiful and Ogden clinic-card telephone links.
- Dr. Call: removed duplicate address lines from the UCS at Granger Fairbourne Station card.
- Jordan Valley: removed “Main Office” badge.
- Tooele: replaced the previous first/third Thursday schedule with the client's Monday/Tuesday correction; no unconfirmed opening/closing times added.

CMS changes used fresh authenticated raw reads, draft checks, revision-guarded field patches, an external backup, and post-mutation reads. Repository fallbacks were refreshed only for the confirmed fields.

`SANITY_REQUIRED=true npm run verify:production` passed before and after the content update. [Production workflow 36661690965](https://github.com/Fresh-Concept-Studio/utah-cancer/actions/runs/36661690965) succeeded at code commit `0373cc88d225f37b5f519ac67c344df0a1adbce9`. The relevant homepage, location, Tooele, Arango, and Call content was checked on `https://utahcancer.com` after deployment.

## Pending client confirmation

- Approved hours for every clinic, including office versus infusion schedules; investigate Ogden and reconcile Tooele with Google.
- Orem suite number; preferred Murray and Provo address wording.
- Dr. Chipman's clinic assignments.
- Multi-location provider appointment routing, general appointment CTA destination, and provider contact phone/fax details.
- UCS versus START routing for Dr. Call at West Valley.
- Device/browser and exact button for any reproducible appointment-link failure. Arango's current top and appointment-section phone links both use `tel:8012629494`; the “Schedule a Visit” text is a section heading.

Recommend clinic-approved Sanity content as the website's source of truth, with the same approved information maintained in Google Business Profiles. Do not automatically import conflicting Google hours. No automated sync or recurring monitoring was installed.

The EDEN completion reply was sent to the participants in that thread. A separate website-review follow-up was saved as an **unsent Gmail draft** for the user to review and send.
