import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';

const policies = [
  {
    slug: 'patient-privacy',
    title: 'Patient Privacy | Utah Cancer Specialists',
    heading: 'Patient Privacy',
    eyebrow: 'Patient rights',
    description: 'Read the Utah Cancer Specialists Notice of Privacy Practices, including how health information may be used and your privacy rights.',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy | Utah Cancer Specialists',
    heading: 'Privacy Policy',
    eyebrow: 'Website policy',
    description: 'Read the Utah Cancer Specialists website privacy policy covering cookies, embedded content, retained data, and visitor privacy rights.',
  },
  {
    slug: 'nosurprisesact',
    title: 'No Surprises Act | Utah Cancer Specialists',
    heading: 'No Surprises Act',
    eyebrow: 'Patient rights',
    description: 'Understand your rights and protections against surprise medical bills and how to request a Good Faith Estimate for medical care.',
  },
  {
    slug: 'termsandconditions',
    title: 'Payment Terms and Conditions | Utah Cancer Specialists',
    heading: 'Terms and Conditions',
    eyebrow: 'Online payments',
    description: 'Review the Utah Cancer Specialists terms and conditions governing authorization and processing of online bill payments.',
  },
  {
    slug: 'discalaimer',
    title: 'Website Disclaimer | Utah Cancer Specialists',
    heading: 'Disclaimer',
    eyebrow: 'Website policy',
    description: 'Read the Utah Cancer Specialists website disclaimer regarding medical information, professional advice, and third-party links.',
  },
];

const normalizedText = value => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

for (const policy of policies) {
  policy.sourceUrl = `https://utahcancer.com/${policy.slug}/`;
  const response = await fetch(policy.sourceUrl);
  if (!response.ok) throw new Error(`${policy.sourceUrl}: ${response.status}`);
  const $ = load(await response.text());
  let content = $('.entry-content .wpb_text_column .wpb_wrapper').first();
  if (!content.length) content = $('.entry-content').first();
  if (!content.length) throw new Error(`${policy.sourceUrl}: page content was not found`);

  content.find('script, style, .tm-last-div-in-row').remove();
  content.find('*').each((_, element) => {
    for (const attribute of Object.keys(element.attribs || {})) {
      if (!['href', 'target', 'rel'].includes(attribute)) $(element).removeAttr(attribute);
    }
  });
  content.find('p').each((_, element) => {
    if (!normalizedText($(element).text())) $(element).remove();
  });
  content.find('a[target="_blank"]').attr('rel', 'noopener');
  // The legacy privacy notice contains an escaped closing tag that renders as visible text.
  content.html(content.html().replace(/&lt;\/li&gt;/gi, ''));

  policy.html = content.html().trim();
  policy.sourceTextHash = createHash('sha256').update(normalizedText(content.text())).digest('hex');
}

fs.writeFileSync('src/data/policies.json', `${JSON.stringify(policies, null, 2)}\n`);
