# Contact form delivery

The static Astro/GitHub Pages site sends general inquiries through [FormSubmit](https://formsubmit.co/documentation). The public endpoint in `src/data/contact.ts` is **referrals@utahcancerspecialists.com**. No server, API secret, or hosting migration is required.

Medical questions belong in the patient portal. The form displays this instruction and asks visitors not to include sensitive information. This setup is for general inquiries; it is not a patient messaging system.

## Choose the clinic recipient

Use a clinic-owned shared mailbox or email distribution group as the primary recipient. Group membership can then change in the clinic's email administration without a site deployment. Ensure the group accepts external mail and that someone can receive its verification message.

1. Submit a synthetic test from the deployed site's contact page.
2. Open FormSubmit's activation email in the referrals mailbox and activate the form.
3. If FormSubmit supplies an opaque endpoint alias after activation, replace the address in `endpointId` with that alias, rebuild, and deploy.
4. Submit another uniquely labeled test and confirm the actual email arrives, contains the fields, and has the visitor's address in `Reply-To`.

For additional direct recipients, set `copyRecipients` to an array of addresses. These become FormSubmit's `_cc` field and are public in the built HTML. Prefer one shared mailbox/group when practical. Verify every intended recipient with a test. Recheck activation and delivery whenever the site origin or recipient changes.

## Behavior and maintenance

- `src/components/ContactForm.astro`: fields, notice, native POST fallback, and styles.
- `public/scripts/contact-form.js`: enhanced submission, pending/success/error messages, 20-second timeout, and duplicate-click protection. Failed or unconfirmed requests retain the user's fields; a timeout does not prove the server failed to deliver.
- Native HTML validation, field length limits, and a hidden spam trap are included. FormSubmit's native CAPTCHA setting is not disabled. AJAX delivery follows the service's AJAX endpoint behavior.
- Replies to notification emails use the visitor's email address. Notification subject is “Utah Cancer Specialists — general inquiry”; the visitor's subject is included in the body.
- FormSubmit is an external dependency and its documentation describes 30-day submission retention. Reassess the service if requirements expand beyond general inquiries.
- Run `npm run verify` before release. Automated tests cover failed responses, timeouts, duplicates, spam-trap/validation behavior, native fallback, and provider phone links. A real inbox test remains necessary to prove delivery.

The main phone is also defined once in `src/data/contact.ts`: **801.262.9494**, matching the Contact page. All provider hero appointment buttons use it.
