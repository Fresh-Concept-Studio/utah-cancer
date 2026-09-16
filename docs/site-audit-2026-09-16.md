# Site spelling and link audit — September 16, 2026

## Coverage and results

- Reviewed the rendered text, titles, descriptions, and image alternative text across all 154 generated HTML pages, including published older event pages and redirects.
- Checked all 6,905 anchor destinations, local file existence, and internal fragment targets.
- Requested all 154 live pages: every page returned HTTP 200 and matched the local production build at the start of the audit.
- Checked 51 unique external destinations: 49 returned HTTP 200; ABC4 returned 403 to the automated checker but the article loaded correctly in the browser. HealthPay24 returned 403 and was also blocked in the browser, so it remains unverified, not confirmed broken.
- Found 451 placeholder `#` links and 146 instances of one missing section anchor, for 597 affected link occurrences. Repeated shared navigation accounts for many occurrences.
- Compared all 6,905 anchor destinations after the spelling edits: none changed.
- Phone/email links were inspected without placing calls, sending emails, registering for events, or submitting forms. An HTTP success does not verify email delivery, authenticated service workflows, or availability of every social media post to every visitor.
- Production build, Astro checks, and all nine existing tests passed.

## Corrections made

- Patrick **Sheilds → Shields** in the About and Leadership pages and image text. Confirmed by the [ACS CAN event listing](https://www.fightcancer.org/events/2022-acs-can-utah-virtual-cancer-summit-health-equity-through-cancer-lens) and [XiFin speaker listing](https://www.xifin.com/news-and-events/event/webinar-how-maximize-oncology-practice-value-featuring-utah-cancer-specialists/).
- Shannon **Mcrae → McRae** on About, matching the supplied leadership bio and directory.
- Granger **Faibourne → Fairbourne** in Jose Pacheco’s location card, consistent with the [official clinic listing](https://utahcancer.com/fairbourne/).
- **John Hopkins → Johns Hopkins** in Julie Luckart’s education, matching the [university’s name](https://www.jhu.edu/about/history/).
- Corrected punctuation/spacing in education details for Brittany Weed, Greg Litton, Gregory Chipman, Kimberly McFee, Leland Rogers, and Sunita Sigdel.
- Added the possessive apostrophe in **Master’s** for Nancy Mortensen and Shauna Olsen.
- Removed the duplicated medical-school sentence for Gary Garner and repeated street-address lines in 20 shared provider location records.
- Added the missing **an** in Tym Gilson’s “provide an exceptional experience.”

Clinical terms, quoted testimonials, and uncertain factual details were not rewritten as spelling corrections.

## Links requiring a decision — unchanged

Each section below lists the current destination, occurrence count, and affected pages. A `#` link has no implemented destination/action; the Foundation link points to a missing ID. The Donate Now and homepage foundation Learn More buttons correctly open the existing coming-soon modal and are excluded.

### 1. Our Foundation

- Destination: `/utah-cancer/about.html#foundation`
- Finding: missing-anchor; 146 occurrence(s) across 146 page(s).
- Shared header on all 146 normal content pages. Example: [About](https://fresh-concept-studio.github.io/utah-cancer/about.html).

### 2. Careers

- Destination: `#`
- Finding: placeholder; 146 occurrence(s) across 146 page(s).
- Shared footer on all 146 normal content pages. Example: [About](https://fresh-concept-studio.github.io/utah-cancer/about.html).

### 3. Request Appointment

- Destination: `#`
- Finding: placeholder; 43 occurrence(s) across 43 page(s).
- Affected pages:
  - [newly-diagnosed.html](https://fresh-concept-studio.github.io/utah-cancer/newly-diagnosed.html)
  - [radiation-oncology.html](https://fresh-concept-studio.github.io/utah-cancer/radiation-oncology.html)
  - [locations/bountiful.html](https://fresh-concept-studio.github.io/utah-cancer/locations/bountiful.html)
  - [locations/cancer-center.html](https://fresh-concept-studio.github.io/utah-cancer/locations/cancer-center.html)
  - [locations/granger.html](https://fresh-concept-studio.github.io/utah-cancer/locations/granger.html)
  - [locations/imc.html](https://fresh-concept-studio.github.io/utah-cancer/locations/imc.html)
  - [locations/jordan-valley.html](https://fresh-concept-studio.github.io/utah-cancer/locations/jordan-valley.html)
  - [locations/layton.html](https://fresh-concept-studio.github.io/utah-cancer/locations/layton.html)
  - [locations/ogden.html](https://fresh-concept-studio.github.io/utah-cancer/locations/ogden.html)
  - [locations/pleasant-grove.html](https://fresh-concept-studio.github.io/utah-cancer/locations/pleasant-grove.html)
  - [locations/salt-lake.html](https://fresh-concept-studio.github.io/utah-cancer/locations/salt-lake.html)
  - [locations/south-jordan.html](https://fresh-concept-studio.github.io/utah-cancer/locations/south-jordan.html)
  - [locations/st-marks.html](https://fresh-concept-studio.github.io/utah-cancer/locations/st-marks.html)
  - [locations/start.html](https://fresh-concept-studio.github.io/utah-cancer/locations/start.html)
  - [locations/timpanogos.html](https://fresh-concept-studio.github.io/utah-cancer/locations/timpanogos.html)
  - [specialties/benign-hematology.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/benign-hematology.html)
  - [specialties/bladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bladder-cancer.html)
  - [specialties/blood-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/blood-cancers.html)
  - [specialties/bone-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-cancers.html)
  - [specialties/bone-marrow-failure.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-marrow-failure.html)
  - [specialties/brain-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/brain-cancers.html)
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)
  - [specialties/chronic-leukemias.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/chronic-leukemias.html)
  - [specialties/clinical-trials.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/clinical-trials.html)
  - [specialties/colon-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/colon-cancer.html)
  - [specialties/endocrine-tumors.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/endocrine-tumors.html)
  - [specialties/esophageal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/esophageal-cancer.html)
  - [specialties/head-neck-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/head-neck-cancers.html)
  - [specialties/kidney-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/kidney-cancer.html)
  - [specialties/liver-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/liver-cancer.html)
  - [specialties/lung-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lung-cancer.html)
  - [specialties/lymphomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lymphomas.html)
  - [specialties/multiple-myeloma.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/multiple-myeloma.html)
  - [specialties/myeloproliferative-disorders.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/myeloproliferative-disorders.html)
  - [specialties/ovarian-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/ovarian-cancer.html)
  - [specialties/pancreatic-gallbladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/pancreatic-gallbladder-cancer.html)
  - [specialties/prostate-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/prostate-cancer.html)
  - [specialties/rectal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/rectal-cancer.html)
  - [specialties/small-bowel-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/small-bowel-cancers.html)
  - [specialties/soft-tissue-sarcomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/soft-tissue-sarcomas.html)
  - [specialties/stomach-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/stomach-cancer.html)
  - [specialties/thyroid-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/thyroid-cancer.html)
  - [specialties/uterine-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/uterine-cancer.html)

### 4. Patient Advocacy — Your personal liaison — insurance, authorizations, and support throughout treatment.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [patient-resources.html](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html)

### 5. American Cancer Society — Information, support, and resources for cancer patients and families.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [patient-resources.html](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html)

### 6. National Cancer Institute — Comprehensive cancer information from the U.S. government.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [patient-resources.html](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html)

### 7. CancerCare — Free professional support including counseling, support groups, and financial assistance.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [patient-resources.html](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html)

### 8. Utah Cancer Foundation — Local support programs and financial assistance for Utah cancer patients.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [patient-resources.html](https://fresh-concept-studio.github.io/utah-cancer/patient-resources.html)

### 9. Register

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 10. Register Now

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 11. Add to calendar

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 12. Facebook

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 13. X

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 14. LinkedIn

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 15. Email

- Destination: `#`
- Finding: placeholder; 8 occurrence(s) across 8 page(s).
- Affected pages:
  - [events/caregiver-workshop.html](https://fresh-concept-studio.github.io/utah-cancer/events/caregiver-workshop.html)
  - [events/holiday-gift-drive.html](https://fresh-concept-studio.github.io/utah-cancer/events/holiday-gift-drive.html)
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/patient-appreciation-dinner.html](https://fresh-concept-studio.github.io/utah-cancer/events/patient-appreciation-dinner.html)
  - [events/survivorship-support-group.html](https://fresh-concept-studio.github.io/utah-cancer/events/survivorship-support-group.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)
  - [events/walk-for-hope.html](https://fresh-concept-studio.github.io/utah-cancer/events/walk-for-hope.html)
  - [events/young-adult-meetup.html](https://fresh-concept-studio.github.io/utah-cancer/events/young-adult-meetup.html)

### 16. How Zoom works

- Destination: `#`
- Finding: placeholder; 2 occurrence(s) across 2 page(s).
- Affected pages:
  - [events/nutrition-during-treatment.html](https://fresh-concept-studio.github.io/utah-cancer/events/nutrition-during-treatment.html)
  - [events/understanding-treatment-options.html](https://fresh-concept-studio.github.io/utah-cancer/events/understanding-treatment-options.html)

### 17. Get Directions

- Destination: `#`
- Finding: placeholder; 26 occurrence(s) across 13 page(s).
- Affected pages:
  - [locations/bountiful.html](https://fresh-concept-studio.github.io/utah-cancer/locations/bountiful.html)
  - [locations/cancer-center.html](https://fresh-concept-studio.github.io/utah-cancer/locations/cancer-center.html)
  - [locations/granger.html](https://fresh-concept-studio.github.io/utah-cancer/locations/granger.html)
  - [locations/imc.html](https://fresh-concept-studio.github.io/utah-cancer/locations/imc.html)
  - [locations/jordan-valley.html](https://fresh-concept-studio.github.io/utah-cancer/locations/jordan-valley.html)
  - [locations/layton.html](https://fresh-concept-studio.github.io/utah-cancer/locations/layton.html)
  - [locations/ogden.html](https://fresh-concept-studio.github.io/utah-cancer/locations/ogden.html)
  - [locations/pleasant-grove.html](https://fresh-concept-studio.github.io/utah-cancer/locations/pleasant-grove.html)
  - [locations/salt-lake.html](https://fresh-concept-studio.github.io/utah-cancer/locations/salt-lake.html)
  - [locations/south-jordan.html](https://fresh-concept-studio.github.io/utah-cancer/locations/south-jordan.html)
  - [locations/st-marks.html](https://fresh-concept-studio.github.io/utah-cancer/locations/st-marks.html)
  - [locations/start.html](https://fresh-concept-studio.github.io/utah-cancer/locations/start.html)
  - [locations/timpanogos.html](https://fresh-concept-studio.github.io/utah-cancer/locations/timpanogos.html)

### 18. Send a Message

- Destination: `#`
- Finding: placeholder; 56 occurrence(s) across 56 page(s).
- Affected pages:
  - [providers/andrew-aloia.html](https://fresh-concept-studio.github.io/utah-cancer/providers/andrew-aloia.html)
  - [providers/anita-mcdonald.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anita-mcdonald.html)
  - [providers/anne-marceau.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anne-marceau.html)
  - [providers/belisario-arango.html](https://fresh-concept-studio.github.io/utah-cancer/providers/belisario-arango.html)
  - [providers/benjamin-solomon.html](https://fresh-concept-studio.github.io/utah-cancer/providers/benjamin-solomon.html)
  - [providers/bonnie-wallace.html](https://fresh-concept-studio.github.io/utah-cancer/providers/bonnie-wallace.html)
  - [providers/brighton-loveday.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brighton-loveday.html)
  - [providers/brittany-weed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brittany-weed.html)
  - [providers/daniel-miller.html](https://fresh-concept-studio.github.io/utah-cancer/providers/daniel-miller.html)
  - [providers/david-warner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/david-warner.html)
  - [providers/deborah-hatch.html](https://fresh-concept-studio.github.io/utah-cancer/providers/deborah-hatch.html)
  - [providers/disean-kendall.html](https://fresh-concept-studio.github.io/utah-cancer/providers/disean-kendall.html)
  - [providers/douglas-holt.html](https://fresh-concept-studio.github.io/utah-cancer/providers/douglas-holt.html)
  - [providers/gary-garner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gary-garner.html)
  - [providers/greg-litton.html](https://fresh-concept-studio.github.io/utah-cancer/providers/greg-litton.html)
  - [providers/gregory-chipman.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gregory-chipman.html)
  - [providers/heather-mcgivern.html](https://fresh-concept-studio.github.io/utah-cancer/providers/heather-mcgivern.html)
  - [providers/hyatt-reed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/hyatt-reed.html)
  - [providers/hyrum-prestwich.html](https://fresh-concept-studio.github.io/utah-cancer/providers/hyrum-prestwich.html)
  - [providers/james-clarke.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-clarke.html)
  - [providers/james-shortridge.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-shortridge.html)
  - [providers/jared-scott.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jared-scott.html)
  - [providers/jason-stinnett.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jason-stinnett.html)
  - [providers/john-hayes.html](https://fresh-concept-studio.github.io/utah-cancer/providers/john-hayes.html)
  - [providers/jonathan-whisenant.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jonathan-whisenant.html)
  - [providers/jose-pacheco.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jose-pacheco.html)
  - [providers/julie-balk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-balk.html)
  - [providers/julie-luckart.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-luckart.html)
  - [providers/justin-call.html](https://fresh-concept-studio.github.io/utah-cancer/providers/justin-call.html)
  - [providers/kimberly-mcfee.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kimberly-mcfee.html)
  - [providers/kylee-maliwauki.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kylee-maliwauki.html)
  - [providers/leland-rogers.html](https://fresh-concept-studio.github.io/utah-cancer/providers/leland-rogers.html)
  - [providers/lindsay-hunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/lindsay-hunter.html)
  - [providers/louise-tobey.html](https://fresh-concept-studio.github.io/utah-cancer/providers/louise-tobey.html)
  - [providers/maja-lusk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/maja-lusk.html)
  - [providers/makaylie-crowther.html](https://fresh-concept-studio.github.io/utah-cancer/providers/makaylie-crowther.html)
  - [providers/nancy-mortensen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nancy-mortensen.html)
  - [providers/nathan-rich.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nathan-rich.html)
  - [providers/nitin-chandramouli.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nitin-chandramouli.html)
  - [providers/rik-hanson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/rik-hanson.html)
  - [providers/robert-harris.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-harris.html)
  - [providers/robert-havard.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-havard.html)
  - [providers/robert-isaak.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-isaak.html)
  - [providers/samantha-gaffney.html](https://fresh-concept-studio.github.io/utah-cancer/providers/samantha-gaffney.html)
  - [providers/scott-samuelson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/scott-samuelson.html)
  - [providers/shauna-olsen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/shauna-olsen.html)
  - [providers/staci-gunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/staci-gunter.html)
  - [providers/stephanie-ellis.html](https://fresh-concept-studio.github.io/utah-cancer/providers/stephanie-ellis.html)
  - [providers/sunita-sigdel.html](https://fresh-concept-studio.github.io/utah-cancer/providers/sunita-sigdel.html)
  - [providers/thomas-skidmore.html](https://fresh-concept-studio.github.io/utah-cancer/providers/thomas-skidmore.html)
  - [providers/tylan-magnusson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/tylan-magnusson.html)
  - [providers/wayne-ormsby.html](https://fresh-concept-studio.github.io/utah-cancer/providers/wayne-ormsby.html)
  - [providers/william-mckean.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-mckean.html)
  - [providers/william-nibley.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-nibley.html)
  - [providers/william-stephenson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-stephenson.html)
  - [providers/xylina-gregg.html](https://fresh-concept-studio.github.io/utah-cancer/providers/xylina-gregg.html)

### 19. Contact Us

- Destination: `#`
- Finding: placeholder; 57 occurrence(s) across 57 page(s).
- Affected pages:
  - [providers/andrew-aloia.html](https://fresh-concept-studio.github.io/utah-cancer/providers/andrew-aloia.html)
  - [providers/anita-mcdonald.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anita-mcdonald.html)
  - [providers/anne-marceau.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anne-marceau.html)
  - [providers/belisario-arango.html](https://fresh-concept-studio.github.io/utah-cancer/providers/belisario-arango.html)
  - [providers/benjamin-solomon.html](https://fresh-concept-studio.github.io/utah-cancer/providers/benjamin-solomon.html)
  - [providers/bonnie-wallace.html](https://fresh-concept-studio.github.io/utah-cancer/providers/bonnie-wallace.html)
  - [providers/brighton-loveday.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brighton-loveday.html)
  - [providers/brittany-weed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brittany-weed.html)
  - [providers/daniel-miller.html](https://fresh-concept-studio.github.io/utah-cancer/providers/daniel-miller.html)
  - [providers/david-warner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/david-warner.html)
  - [providers/deborah-hatch.html](https://fresh-concept-studio.github.io/utah-cancer/providers/deborah-hatch.html)
  - [providers/disean-kendall.html](https://fresh-concept-studio.github.io/utah-cancer/providers/disean-kendall.html)
  - [providers/douglas-holt.html](https://fresh-concept-studio.github.io/utah-cancer/providers/douglas-holt.html)
  - [providers/gary-garner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gary-garner.html)
  - [providers/greg-litton.html](https://fresh-concept-studio.github.io/utah-cancer/providers/greg-litton.html)
  - [providers/gregory-chipman.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gregory-chipman.html)
  - [providers/heather-mcgivern.html](https://fresh-concept-studio.github.io/utah-cancer/providers/heather-mcgivern.html)
  - [providers/hyatt-reed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/hyatt-reed.html)
  - [providers/hyrum-prestwich.html](https://fresh-concept-studio.github.io/utah-cancer/providers/hyrum-prestwich.html)
  - [providers/james-clarke.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-clarke.html)
  - [providers/james-shortridge.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-shortridge.html)
  - [providers/jared-scott.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jared-scott.html)
  - [providers/jason-stinnett.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jason-stinnett.html)
  - [providers/john-hayes.html](https://fresh-concept-studio.github.io/utah-cancer/providers/john-hayes.html)
  - [providers/jonathan-whisenant.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jonathan-whisenant.html)
  - [providers/jose-pacheco.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jose-pacheco.html)
  - [providers/julie-balk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-balk.html)
  - [providers/julie-luckart.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-luckart.html)
  - [providers/justin-call.html](https://fresh-concept-studio.github.io/utah-cancer/providers/justin-call.html)
  - [providers/kimberly-mcfee.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kimberly-mcfee.html)
  - [providers/kylee-maliwauki.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kylee-maliwauki.html)
  - [providers/leland-rogers.html](https://fresh-concept-studio.github.io/utah-cancer/providers/leland-rogers.html)
  - [providers/lindsay-hunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/lindsay-hunter.html)
  - [providers/louise-tobey.html](https://fresh-concept-studio.github.io/utah-cancer/providers/louise-tobey.html)
  - [providers/maja-lusk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/maja-lusk.html)
  - [providers/makaylie-crowther.html](https://fresh-concept-studio.github.io/utah-cancer/providers/makaylie-crowther.html)
  - [providers/nancy-mortensen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nancy-mortensen.html)
  - [providers/nathan-rich.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nathan-rich.html)
  - [providers/nitin-chandramouli.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nitin-chandramouli.html)
  - [providers/rik-hanson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/rik-hanson.html)
  - [providers/robert-harris.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-harris.html)
  - [providers/robert-havard.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-havard.html)
  - [providers/robert-isaak.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-isaak.html)
  - [providers/samantha-gaffney.html](https://fresh-concept-studio.github.io/utah-cancer/providers/samantha-gaffney.html)
  - [providers/scott-samuelson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/scott-samuelson.html)
  - [providers/shauna-olsen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/shauna-olsen.html)
  - [providers/staci-gunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/staci-gunter.html)
  - [providers/stephanie-ellis.html](https://fresh-concept-studio.github.io/utah-cancer/providers/stephanie-ellis.html)
  - [providers/sunita-sigdel.html](https://fresh-concept-studio.github.io/utah-cancer/providers/sunita-sigdel.html)
  - [providers/thomas-skidmore.html](https://fresh-concept-studio.github.io/utah-cancer/providers/thomas-skidmore.html)
  - [providers/tylan-magnusson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/tylan-magnusson.html)
  - [providers/wayne-ormsby.html](https://fresh-concept-studio.github.io/utah-cancer/providers/wayne-ormsby.html)
  - [providers/william-mckean.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-mckean.html)
  - [providers/william-nibley.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-nibley.html)
  - [providers/william-stephenson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-stephenson.html)
  - [providers/xylina-gregg.html](https://fresh-concept-studio.github.io/utah-cancer/providers/xylina-gregg.html)
  - [specialties/index.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/index.html)

### 20. Request an Appointment

- Destination: `#`
- Finding: placeholder; 28 occurrence(s) across 28 page(s).
- Affected pages:
  - [specialties/benign-hematology.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/benign-hematology.html)
  - [specialties/bladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bladder-cancer.html)
  - [specialties/blood-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/blood-cancers.html)
  - [specialties/bone-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-cancers.html)
  - [specialties/bone-marrow-failure.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-marrow-failure.html)
  - [specialties/brain-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/brain-cancers.html)
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)
  - [specialties/chronic-leukemias.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/chronic-leukemias.html)
  - [specialties/clinical-trials.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/clinical-trials.html)
  - [specialties/colon-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/colon-cancer.html)
  - [specialties/endocrine-tumors.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/endocrine-tumors.html)
  - [specialties/esophageal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/esophageal-cancer.html)
  - [specialties/head-neck-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/head-neck-cancers.html)
  - [specialties/kidney-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/kidney-cancer.html)
  - [specialties/liver-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/liver-cancer.html)
  - [specialties/lung-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lung-cancer.html)
  - [specialties/lymphomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lymphomas.html)
  - [specialties/multiple-myeloma.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/multiple-myeloma.html)
  - [specialties/myeloproliferative-disorders.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/myeloproliferative-disorders.html)
  - [specialties/ovarian-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/ovarian-cancer.html)
  - [specialties/pancreatic-gallbladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/pancreatic-gallbladder-cancer.html)
  - [specialties/prostate-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/prostate-cancer.html)
  - [specialties/rectal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/rectal-cancer.html)
  - [specialties/small-bowel-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/small-bowel-cancers.html)
  - [specialties/soft-tissue-sarcomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/soft-tissue-sarcomas.html)
  - [specialties/stomach-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/stomach-cancer.html)
  - [specialties/thyroid-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/thyroid-cancer.html)
  - [specialties/uterine-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/uterine-cancer.html)

### 21. Message Us

- Destination: `#`
- Finding: placeholder; 28 occurrence(s) across 28 page(s).
- Affected pages:
  - [specialties/benign-hematology.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/benign-hematology.html)
  - [specialties/bladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bladder-cancer.html)
  - [specialties/blood-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/blood-cancers.html)
  - [specialties/bone-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-cancers.html)
  - [specialties/bone-marrow-failure.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/bone-marrow-failure.html)
  - [specialties/brain-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/brain-cancers.html)
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)
  - [specialties/chronic-leukemias.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/chronic-leukemias.html)
  - [specialties/clinical-trials.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/clinical-trials.html)
  - [specialties/colon-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/colon-cancer.html)
  - [specialties/endocrine-tumors.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/endocrine-tumors.html)
  - [specialties/esophageal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/esophageal-cancer.html)
  - [specialties/head-neck-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/head-neck-cancers.html)
  - [specialties/kidney-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/kidney-cancer.html)
  - [specialties/liver-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/liver-cancer.html)
  - [specialties/lung-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lung-cancer.html)
  - [specialties/lymphomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/lymphomas.html)
  - [specialties/multiple-myeloma.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/multiple-myeloma.html)
  - [specialties/myeloproliferative-disorders.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/myeloproliferative-disorders.html)
  - [specialties/ovarian-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/ovarian-cancer.html)
  - [specialties/pancreatic-gallbladder-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/pancreatic-gallbladder-cancer.html)
  - [specialties/prostate-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/prostate-cancer.html)
  - [specialties/rectal-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/rectal-cancer.html)
  - [specialties/small-bowel-cancers.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/small-bowel-cancers.html)
  - [specialties/soft-tissue-sarcomas.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/soft-tissue-sarcomas.html)
  - [specialties/stomach-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/stomach-cancer.html)
  - [specialties/thyroid-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/thyroid-cancer.html)
  - [specialties/uterine-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/uterine-cancer.html)

### 22. Ovarian Cancer — Advanced treatment including surgery, chemotherapy, and targeted approaches.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)

### 23. Uterine Cancer — Specialized treatment with minimally invasive surgical options and targeted therapies.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)

### 24. Clinical Trials (START Program) — Access to cutting-edge clinical trials and investigational treatments.

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [specialties/breast-cancer.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/breast-cancer.html)

### 25. Call 801.269.0231

- Destination: `#`
- Finding: placeholder; 1 occurrence(s) across 1 page(s).
- Affected pages:
  - [specialties/index.html](https://fresh-concept-studio.github.io/utah-cancer/specialties/index.html)

## Related navigation/function issues — unchanged

### Provider directions lead to the directory

71 “Get Directions” links across 48 provider pages navigate to the general Locations directory rather than directions for the selected clinic. These are valid pages, not HTTP failures, but the label and destination do not match well.

Affected pages:
- [providers/andrew-aloia.html](https://fresh-concept-studio.github.io/utah-cancer/providers/andrew-aloia.html)
- [providers/anita-mcdonald.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anita-mcdonald.html)
- [providers/anne-marceau.html](https://fresh-concept-studio.github.io/utah-cancer/providers/anne-marceau.html)
- [providers/belisario-arango.html](https://fresh-concept-studio.github.io/utah-cancer/providers/belisario-arango.html)
- [providers/benjamin-solomon.html](https://fresh-concept-studio.github.io/utah-cancer/providers/benjamin-solomon.html)
- [providers/bonnie-wallace.html](https://fresh-concept-studio.github.io/utah-cancer/providers/bonnie-wallace.html)
- [providers/brighton-loveday.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brighton-loveday.html)
- [providers/brittany-weed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/brittany-weed.html)
- [providers/david-warner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/david-warner.html)
- [providers/deborah-hatch.html](https://fresh-concept-studio.github.io/utah-cancer/providers/deborah-hatch.html)
- [providers/disean-kendall.html](https://fresh-concept-studio.github.io/utah-cancer/providers/disean-kendall.html)
- [providers/douglas-holt.html](https://fresh-concept-studio.github.io/utah-cancer/providers/douglas-holt.html)
- [providers/gary-garner.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gary-garner.html)
- [providers/greg-litton.html](https://fresh-concept-studio.github.io/utah-cancer/providers/greg-litton.html)
- [providers/gregory-chipman.html](https://fresh-concept-studio.github.io/utah-cancer/providers/gregory-chipman.html)
- [providers/hyatt-reed.html](https://fresh-concept-studio.github.io/utah-cancer/providers/hyatt-reed.html)
- [providers/james-clarke.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-clarke.html)
- [providers/james-shortridge.html](https://fresh-concept-studio.github.io/utah-cancer/providers/james-shortridge.html)
- [providers/jared-scott.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jared-scott.html)
- [providers/jason-stinnett.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jason-stinnett.html)
- [providers/john-hayes.html](https://fresh-concept-studio.github.io/utah-cancer/providers/john-hayes.html)
- [providers/jonathan-whisenant.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jonathan-whisenant.html)
- [providers/jose-pacheco.html](https://fresh-concept-studio.github.io/utah-cancer/providers/jose-pacheco.html)
- [providers/julie-balk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-balk.html)
- [providers/julie-luckart.html](https://fresh-concept-studio.github.io/utah-cancer/providers/julie-luckart.html)
- [providers/justin-call.html](https://fresh-concept-studio.github.io/utah-cancer/providers/justin-call.html)
- [providers/kimberly-mcfee.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kimberly-mcfee.html)
- [providers/kylee-maliwauki.html](https://fresh-concept-studio.github.io/utah-cancer/providers/kylee-maliwauki.html)
- [providers/leland-rogers.html](https://fresh-concept-studio.github.io/utah-cancer/providers/leland-rogers.html)
- [providers/lindsay-hunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/lindsay-hunter.html)
- [providers/louise-tobey.html](https://fresh-concept-studio.github.io/utah-cancer/providers/louise-tobey.html)
- [providers/maja-lusk.html](https://fresh-concept-studio.github.io/utah-cancer/providers/maja-lusk.html)
- [providers/nancy-mortensen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nancy-mortensen.html)
- [providers/nathan-rich.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nathan-rich.html)
- [providers/nitin-chandramouli.html](https://fresh-concept-studio.github.io/utah-cancer/providers/nitin-chandramouli.html)
- [providers/rik-hanson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/rik-hanson.html)
- [providers/robert-harris.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-harris.html)
- [providers/robert-havard.html](https://fresh-concept-studio.github.io/utah-cancer/providers/robert-havard.html)
- [providers/samantha-gaffney.html](https://fresh-concept-studio.github.io/utah-cancer/providers/samantha-gaffney.html)
- [providers/scott-samuelson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/scott-samuelson.html)
- [providers/shauna-olsen.html](https://fresh-concept-studio.github.io/utah-cancer/providers/shauna-olsen.html)
- [providers/staci-gunter.html](https://fresh-concept-studio.github.io/utah-cancer/providers/staci-gunter.html)
- [providers/stephanie-ellis.html](https://fresh-concept-studio.github.io/utah-cancer/providers/stephanie-ellis.html)
- [providers/thomas-skidmore.html](https://fresh-concept-studio.github.io/utah-cancer/providers/thomas-skidmore.html)
- [providers/wayne-ormsby.html](https://fresh-concept-studio.github.io/utah-cancer/providers/wayne-ormsby.html)
- [providers/william-mckean.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-mckean.html)
- [providers/william-stephenson.html](https://fresh-concept-studio.github.io/utah-cancer/providers/william-stephenson.html)
- [providers/xylina-gregg.html](https://fresh-concept-studio.github.io/utah-cancer/providers/xylina-gregg.html)

### Events newsletter signup

The [Events page](https://fresh-concept-studio.github.io/utah-cancer/events/index.html) “Subscribe” form is a visual placeholder. Its submit handler only prevents submission; it does not send or subscribe anything. No changes made.

### HealthPay24 eStatements destination — unverified

The footer “Go paperless · Enroll in eStatements” link and the Patient Resources “enroll in eStatements” link use [HealthPay24](https://utahcanceronline.ci.healthpay24.cloud/account/login). The checker received HTTP 403 and the browser blocked this destination. It needs a manual check outside this environment; this audit does not establish that it is broken. The separate Pay Bill link to POS Patient Payment Portal returned HTTP 200.
