import standalonePages from '../data/pages.json';
import defaults from '../data/page-defaults.json';
import providers from '../data/providers.json';
import leaders from '../data/leaders.json';
import specialties from '../data/specialties.json';
import locations from '../data/locations.json';
import policies from '../data/policies.json';
import type { PageData } from './types';

type Family = NonNullable<PageData['family']>;
interface RecordPage {
  slug: string;
  name?: string;
  title?: string;
  role?: string;
  specialty?: string;
  languages?: string;
  description?: string;
  tag?: string;
  subtitle?: string;
  directory?: { addressHtml?: string; [key: string]: unknown };
  page?: Record<string, unknown>;
}

const standaloneDescriptions: Record<string, string> = {
  'about.html': 'Learn about Utah Cancer Specialists, a community-based oncology practice providing compassionate cancer care, research, and support across Utah.',
  'clinical-trials.html': 'Explore clinical trials available through Utah Cancer Specialists and learn how our research team connects patients with promising cancer treatments.',
  'careers.html': 'Explore current career opportunities at Utah Cancer Specialists and apply to join a team dedicated to compassionate, community-based cancer care.',
  'contact.html': 'Contact Utah Cancer Specialists for general questions, clinic information, and help finding the right cancer care team or location.',
  'events/index.html': 'Find upcoming Utah Cancer Specialists events, education opportunities, fundraisers, and community programs for patients and families.',
  'index.html': 'Utah Cancer Specialists provides advanced, compassionate cancer care, clinical trials, and supportive services at convenient locations across Utah.',
  'late-phase-trials.html': 'Explore current Phase II and Phase III clinical trials available through Utah Cancer Specialists and the START Mountain Region research program.',
  'leadership.html': 'Meet the executive team and directors who lead Utah Cancer Specialists, Utah’s largest community-based oncology practice.',
  'locations/index.html': 'Find a Utah Cancer Specialists clinic near you, with addresses, phone numbers, directions, hours, services, and local care teams.',
  'newly-diagnosed.html': 'Learn what to expect after a cancer diagnosis and how Utah Cancer Specialists helps patients understand treatment, appointments, and support resources.',
  'patient-education.html': 'Access trusted cancer education and practical guidance to help patients and families understand diagnoses, treatments, side effects, and recovery.',
  'patient-resources.html': 'Find financial assistance, patient portal access, education, support services, billing information, and other cancer-care resources.',
  'physical-therapy.html': 'Cancer-focused physical therapy at Utah Cancer Specialists Sandy Clinic, with personalized rehabilitation, exercise, and recovery support.',
  'programs-and-services.html': 'Explore cancer care programs and supportive services from Utah Cancer Specialists, including treatment, rehabilitation, education, and research.',
  'providers/index.html': 'Find medical oncologists, hematologists, radiation oncologists, advanced practitioners, and supportive-care providers across Utah.',
  'radiation-oncology.html': 'Learn about personalized radiation oncology at Utah Cancer Specialists, including advanced technology, treatment planning, and supportive care.',
  'specialties/index.html': 'Explore the cancer types and blood disorders treated by Utah Cancer Specialists and connect with an experienced specialist in Utah.',
  'stories/index.html': 'Read patient stories about cancer diagnosis, treatment, resilience, and the compassionate care provided by Utah Cancer Specialists.',
  'stories/amy-jensen.html': 'Amy navigated a breast cancer diagnosis during pregnancy with support from her family and care team at Utah Cancer Specialists.',
  'stories/dale.html': 'Read Dale’s cancer story and learn how personalized treatment and a supportive care team helped guide his experience.',
  'stories/dukhi-hong.html': 'At 84, Dukhi marked her 100th immunotherapy treatment with the people who had supported her throughout her cancer care.',
  'stories/jasmine.html': 'Read Jasmine’s cancer story and how compassionate, individualized care supported her through diagnosis and treatment.',
  'stories/maria.html': 'Read Maria’s cancer story and how her care team supported her with expertise, communication, and compassion throughout treatment.',
  'telehealth.html': 'Connect with your Utah Cancer Specialists care team through secure telehealth visits when an in-person appointment is not required.',
  'treatment-options.html': 'Explore cancer treatment options including chemotherapy, immunotherapy, targeted therapy, radiation, surgery, and clinical trials.',
};

function stripHtml(value = ''): string {
  return value.replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function metadataFor(family: Family, record: RecordPage): Pick<PageData, 'title' | 'description'> {
  const label = record.name ?? record.title ?? '';
  if (family === 'provider') {
    return {
      title: `${label} | Utah Cancer Specialists`,
      description: `${label} is a ${record.specialty || 'cancer care'} provider at Utah Cancer Specialists. View clinical focus, locations, and appointment information.`,
    };
  }
  if (family === 'leader') {
    return {
      title: `${label} | Utah Cancer Specialists`,
      description: `${label} serves as ${record.role} at Utah Cancer Specialists, helping lead Utah’s largest community-based oncology practice.`,
    };
  }
  if (family === 'specialty') {
    const longTitle = `${label} Care in Utah | Utah Cancer Specialists`;
    const specialtySummary = record.description || `Learn about ${label.toLowerCase()} diagnosis and treatment.`;
    const expandedSummary = `${specialtySummary} Find specialists and personalized care options at Utah Cancer Specialists.`;
    return {
      title: longTitle.length <= 60 ? longTitle : `${label} Care in Utah | UCS`,
      description: expandedSummary.length <= 180 ? expandedSummary : specialtySummary,
    };
  }
  const address = stripHtml(record.directory?.addressHtml);
  const city = address.match(/(?:^|,\s*)([^,]+),\s*UT\s+\d{5}/)?.[1] || 'Utah';
  return {
    title: `${label} | Utah Cancer Specialists`,
    description: `${label} provides ${(record.tag || 'cancer care').toLowerCase()} services in ${city}, Utah. Find the address, phone number, hours, directions, and care team.`,
  };
}

// Adding a detail record also creates its URL; no second route list to update.
const pages: Record<string, PageData> = Object.fromEntries(
  Object.entries(standalonePages).map(([path, page]) => [path, {
    ...page,
    description: standaloneDescriptions[path] || page.description,
    ...(path === 'index.html' ? { title: 'Cancer Care in Utah | Utah Cancer Specialists' } : {}),
  }]),
) as Record<string, PageData>;

for (const policy of policies) {
  pages[`${policy.slug}/index.html`] = {
    ...policy,
    contentHtml: policy.html,
    bodyClass: 'policy-page',
    styles: ['/styles.css', '/page-styles/policy.css'],
    scripts: [],
    marquee: false,
    component: 'policy-page',
  };
}

const families: { family: Family; directory: string; records: RecordPage[] }[] = [
  { family: 'provider', directory: 'providers', records: providers },
  { family: 'leader', directory: 'leadership', records: leaders },
  { family: 'specialty', directory: 'specialties', records: specialties },
  { family: 'location', directory: 'locations', records: locations },
];
for (const { family, directory, records } of families) {
  for (const record of records) {
    const path = `${directory}/${record.slug}.html`;
    if (pages[path]) throw new Error(`Duplicate page: ${path}`);
    const metadata = metadataFor(family, record);
    pages[path] = {
      ...defaults[family],
      ...metadata,
      ...record.page,
      family,
      slug: record.slug,
    } as PageData;
  }
}
export default pages;
