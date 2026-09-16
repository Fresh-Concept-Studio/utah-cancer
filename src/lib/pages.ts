import standalonePages from '../data/pages.json';
import defaults from '../data/page-defaults.json';
import providers from '../data/providers.json';
import leaders from '../data/leaders.json';
import specialties from '../data/specialties.json';
import locations from '../data/locations.json';
import type { PageData } from './types';

type Family = NonNullable<PageData['family']>;
interface RecordPage {
  slug: string;
  name?: string;
  title?: string;
  role?: string;
  page?: Record<string, unknown>;
}

// Adding a detail record also creates its URL; no second route list to update.
const pages: Record<string, PageData> = { ...standalonePages } as Record<string, PageData>;
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
    pages[path] = {
      ...defaults[family],
      title: `${record.name ?? record.title}${family === 'specialty' ? ' Treatment' : ''} - Utah Cancer Specialists`,
      description: family === 'leader' ? `${record.name}, ${record.role} at Utah Cancer Specialists.` : '',
      ...record.page,
      family,
      slug: record.slug,
    } as PageData;
  }
}
export default pages;
