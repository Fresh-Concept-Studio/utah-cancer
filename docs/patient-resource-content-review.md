# Older patient-resource content review

Twenty old URLs remain after resolving the policy, news, location, test, and WordPress archive decisions. They fall into four practical groups.

## Recommended decisions

| Old URL | What it contains | Recommendation |
| --- | --- | --- |
| `/covid-19-vaccine-update/` | Third-dose advice for immunocompromised patients based on an older CDC recommendation | **Retire with 410.** Medical guidance and vaccine schedules have changed. Current clinical advice should come from the care team and current CDC material. |
| `/covid-19/` | June 2021 masking, screening, visitor, and vaccine restrictions | **Retire with 410.** It is time-sensitive operational guidance and is now obsolete. |
| `/covid-19-vaccine/` | Early vaccine availability, state tier, masking, and quarantine information | **Retire with 410.** It is obsolete and could mislead patients. |
| `/education-videos/` | An almost-empty WordPress navigation page with no meaningful video content | **301 redirect to `/patient-education.html`.** |
| `/visitorandguestinfo/` | A visitor policy dated January 8, 2024, including visitor limits and illness rules | **Verify with clinic operations, then publish a maintained visitor-policy section.** Do not migrate the dated policy without confirmation. |
| `/housing/` | Links for housing, utilities, rental aid, and county resources | **Consolidate into a Supportive Resources page** with a Housing section; verify every outside link before launch and redirect this URL to that section. |
| `/nutrition/` | Nutrition during treatment, food-support programs, and downloadable guides | **Consolidate into Supportive Resources** with a Nutrition section; retain the useful treatment guidance and recheck PDFs and assistance links. |
| `/personalsafety/` | Domestic-violence, crisis-support, and non-emergency police contacts | **Consolidate into Supportive Resources** with prominent, verified crisis contacts. This content needs an owner and scheduled review because phone numbers can change. |
| `/cleaning/` | Cleaning for a Reason eligibility, service areas, and application links | **Consolidate into Supportive Resources** after confirming the partnership and current coverage. Redirect the old URL to the Cleaning Assistance section. |
| `/transportation/` | UTA, American Cancer Society, rideshare, gas-card, and delivery assistance | **Consolidate into Supportive Resources** after confirming which programs UCS currently sponsors. Redirect the old URL to the Transportation section. |
| `/dignicap/` | DigniCap scalp-cooling service information | **Keep as a service page if UCS still offers it.** It is useful treatment-specific content and is referenced by an existing patient story. Otherwise retire it rather than redirecting generically. |
| `/patient-advocacy/` | Insurance authorization, financial assistance, education, and liaison services | **301 redirect to `/programs-and-services.html#patient-advocacy`.** The current page already represents this service. |
| `/a-team-approach/` | General multidisciplinary-care message plus advocacy, education, support, and portal links | **301 redirect to `/programs-and-services.html`.** Its useful content is already represented across Programs & Services and Patient Resources. |
| `/medically-integrated-pharmacy/` | UCS oral-oncology pharmacy, insurance authorization, copay help, counseling, and care-team coordination | **Build a dedicated pharmacy service page.** This is a current, differentiating service with strong patient value and search intent. |
| `/patient-education-empowering-individuals-through-knowledge/` | A very long general cancer encyclopedia that duplicates specialty and treatment pages | **301 redirect to `/patient-education.html`.** Keep the curated specialty and treatment pages as the authoritative content instead of recreating a broad duplicate. |
| `/patient-education-empowering-individuals-through-knowledge/brain-tumors-the-basics/` | General brain-tumor grading, symptoms, diagnosis, and treatment information | **301 redirect to `/specialties/brain-cancers.html`.** The specialty page is the closest maintained replacement. |
| `/supportivecare/` | Symptom management, emotional support, counseling referrals, insurance coordination, goals of care, and supportive-care providers | **Build a dedicated Supportive Care page** and link it from Programs & Services. This is an active clinical service and deserves more than a generic redirect. |
| `/breathwork-class/` | Monthly virtual SOMA breathwork class, benefits, eligibility, and an old registration form | **301 redirect to the Breathwork section on Programs & Services** after confirming the schedule and adding a working registration path. |
| `/low-dose-radiation-therapy-ldrt/` | LDRT for arthritis and chronic joint pain, conditions treated, physicians, location, and consultation details | **Build a dedicated LDRT service page** and link it from Radiation Oncology. This is distinctive, current service content with meaningful search value. |
| `/cancer-rehabilitation-centers/` | The Sandy cancer-rehabilitation clinic, address, hours, phone, and physical-therapy summary | **301 redirect to `/physical-therapy.html`.** The current page carries the same address, phone number, hours, and service. |

## Recommended order

1. Apply the six clear redirects: Education Videos, Patient Advocacy, Team Approach, the broad Patient Education guide, Brain Tumors, and Cancer Rehabilitation.
2. Retire the three obsolete COVID pages with `410 Gone` at Cloudflare launch.
3. Confirm whether DigniCap, medically integrated pharmacy, supportive care, breathwork, and LDRT are current. Preserve the active services; LDRT, pharmacy, and supportive care should receive dedicated pages.
4. Confirm the visitor policy with clinic operations.
5. Build one maintained Supportive Resources page for housing, nutrition, personal safety, cleaning, and transportation, with a named owner and periodic link review.

This approach preserves useful patient help and search value while avoiding stale medical guidance and duplicated encyclopedia content.
