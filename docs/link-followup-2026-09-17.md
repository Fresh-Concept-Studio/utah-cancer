# Link fixes and remaining decisions — September 17, 2026

This supersedes the unresolved-link list in the September 16 audit. The earlier report is retained as the original audit record.

## Fixed

The source now contains no `href="#"` placeholders and no missing internal page or section targets.

- General appointment links call **801.262.9494**, matching the contact page and provider hero buttons. Each clinic’s appointment button calls its displayed clinic number.
- Contact Us, Send a Message, and Message Us go to the existing Contact page. That page explains that the form is for general inquiries and directs medical questions to the patient portal.
- Clinic and provider directions buttons open Google Maps directions for the displayed location.
- The current UCS Provo page confirms that **Provo Clinic** is at Utah Valley Hospital, Sorenson Legacy Tower, Building 4, 395 W. Cougar Blvd., Suite 104, Provo, UT 84604. The blank duplicate provider card was consolidated into the complete Provo Clinic record with the confirmed address, directions, and **385.375.2700** phone number. Provo also has its own detail page and card in the main Locations directory.
- Every Utah Cancer Foundation action now opens the shared coming-soon modal, including the Company menu, homepage Foundation section, and Patient Resources card.
- Careers opens a native Careers page from both the Company menu and footer. It carries over the nine distinct current openings from the official UCS jobs page and continues to use the existing UCS employment application.
- Patient Resources links to the official American Cancer Society, National Cancer Institute, and CancerCare websites.
- Pink Bag Event opens the confirmed Fashion Place event page. Its displayed time and venue were updated to 10:00 AM–1:30 PM at Fashion Place Mall.
- Making Strides Against Breast Cancer opens the official 2026 American Cancer Society Utah registration page.
- PinkSync opens the event’s official registration page. Its date was corrected to October 24, 2026 and its time to 9:00 AM–2:00 PM.
- No authoritative registration pages were found for the eight older event-detail pages. The unverified pages and their unused assets were removed.
- The current UCS website has no events newsletter subscription form or connected mailing-list destination. The nonfunctional Subscribe section was removed.
- Event social links open sharing composers with the published event URL.

## Still needs confirmation

### HealthPay24 eStatements

The footer and Patient Resources **Enroll in eStatements** destination continues to return HTTP 403 to automated checks and was blocked in browser testing. It remains unchanged because it may require a valid patient session. Confirm it manually or provide a replacement URL. The separate Quick Pay/POS payment link is functional.

## Verification

The resolved event destinations returned HTTP 200. The Provo address and phone number were confirmed on the current UCS Provo location page. Production build and site tests pass. No form, registration, email, social post, or payment was submitted during verification.
