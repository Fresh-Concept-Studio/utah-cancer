# Link fixes and remaining decisions — September 17, 2026

This supersedes the unresolved-link list in the September 16 audit. The earlier report is retained as the original audit record.

## Fixed

641 existing link destinations were repaired across the 154-page static site. The audit now finds 25 `#` placeholders and no missing internal page or section targets.

- General appointment links call **801.262.9494**, matching the contact page and provider hero buttons. Each clinic’s appointment button calls its displayed clinic number.
- Contact Us, Send a Message, and Message Us go to the existing Contact page, following the newer provider pages’ convention. That page explains that the form is for general inquiries and directs medical questions to the patient portal.
- 26 clinic directions buttons and 69 provider location directions buttons open Google Maps directions for the selected location’s displayed address. Addressless Bountiful, Jordan Valley, Timpanogos, and Layton cards use their matching clinic record. Four Provo cards remain unresolved below.
- Our Foundation in the header goes to the existing homepage Foundation section, whose Learn More button opens the approved coming-soon modal.
- Careers now opens a native Careers page in the new site from both the Company menu and footer. The page carries over the nine distinct current openings from the official UCS jobs page; the duplicate Patient Advocate listing was consolidated. Applications continue through the existing UCS employment application.
- Patient Advocacy goes to that service on Programs & Services.
- Patient Resources now links to the official [American Cancer Society](https://www.cancer.org/), [National Cancer Institute](https://www.cancer.gov/), and [CancerCare](https://www.cancercare.org/) websites.
- Related Ovarian Cancer, Uterine Cancer, and Clinical Trials cards on Breast Cancer open the matching existing site pages.
- The Types of Cancer “Call 801.269.0231” button calls exactly the displayed number.
- Event Facebook, X, LinkedIn, and Email links open sharing composers with the published event URL. No posts or emails were sent during verification.
- How Zoom works links to [Zoom’s meeting-joining guide](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0060732).

Maps destinations use [Google’s documented directions URL format](https://developers.google.com/maps/documentation/urls/get-started). Google Maps was checked in the browser and resolved Bountiful’s displayed street address correctly. Social sharing still requires the visitor’s social account or email application.

## Still needs a decision

### 1. Foundation resource destination

The **Utah Cancer Foundation** external-resource card on [Patient Resources](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html) still points to `#`. No confirmed separate foundation website was found. Choose the approved external URL, the existing coming-soon experience, or removal of this resource card.

### 2. Registration and calendar links on eight older event pages

Each has **Register**, **Register Now**, and **Add to calendar** placeholders (24 links total). No registration destinations are supplied. These pages describe May–August 2026 events, and the Walk for Hope page calls June 15, 2026 a Saturday although it was a Monday. Confirm whether these events should stay published, and supply approved dates and registration/calendar destinations before connecting them.

- [Caregiver Workshop](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
- [Back-to-School Family Drive](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
- [Nutrition During Treatment](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
- [Annual Patient Appreciation Dinner](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
- [Cancer Survivorship Support Group](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
- [Understanding Your Treatment Options](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
- [Walk for Hope 5K](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
- [Young Adult Patient Meetup](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 3. Provo Clinic directions

Four **Provo Clinic** cards have no address and still lead to the Locations directory. Each provider also has a separate Utah Valley Hospital card, so assuming both cards mean the same place could produce an incorrect destination. Confirm the Provo Clinic address or whether its duplicate card should be removed:

- [Nathan Rich](https://fresh-concept-studio.github.io/utah-cancer/providers/nathan-rich.html)
- [Staci Gunter](https://fresh-concept-studio.github.io/utah-cancer/providers/staci-gunter.html)
- [Stephanie Ellis](https://fresh-concept-studio.github.io/utah-cancer/providers/stephanie-ellis.html)
- [William Stephenson](https://fresh-concept-studio.github.io/utah-cancer/providers/william-stephenson.html)

### 4. Three upcoming-event cards

The [Events directory](https://fresh-concept-studio.github.io/utah-cancer/events/index.html) cards for **Pink Bag Event**, **Making Strides Against Breast Cancer Walk**, and **PinkSync** link to their own card IDs. Their anchors exist, but clicking the cards does not open any additional details. Supply event/registration URLs or choose non-clickable cards until details are ready.

### 5. Newsletter signup

The Events page **Subscribe** form has no connected mailing-list service. Choose the service/list and account before enabling subscriptions.

### 6. HealthPay24 eStatements — unverified

The footer and Patient Resources **Enroll in eStatements** link returned HTTP 403 in the original audit and was blocked in the browser. It remains unchanged. Confirm it manually or provide the replacement URL. The separate Quick Pay/POS payment link is functional.

## Verification

All 59 newly introduced external destinations were checked: 57 returned HTTP 200, and Careers plus the American Cancer Society loaded correctly in the browser despite blocking automated requests. The production build and all 11 tests pass, including new checks for internal section anchors, clinic appointment phone numbers, and canonical event sharing URLs. Calls, form submissions, calendar additions, and social posts were not performed.
