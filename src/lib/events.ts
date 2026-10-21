// Events for the Events page and the homepage.
//
// Editors manage events as a list on the Events page document (`events`, one `eventItem` per
// event). Until that list exists in Sanity, the events come from the page's original keyed text
// slots (`editorContent`/`editorImages`), mapped by `legacyEventItems` below. The migration script
// (scripts/migrate-events-to-list.mjs) uses the same mapping to create the list, so the website
// looks the same before and after the migration.
import { eventDateKey, isEventPast, parseWrittenDate } from './event-dates';
import { pageEditor } from './page-content';
import type { PageData } from './types';

export type EventCategory = 'support' | 'community' | 'fundraiser';
export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  support: 'Patient Resources',
  community: 'Community',
  fundraiser: 'Fundraiser',
};

export interface EventImage { src: string; alt: string; caption?: string }

/** One event as the website renders it. */
export interface SiteEvent {
  id: string;
  title: string;
  /** "YYYY-MM-DD"; decides Upcoming vs Past. Missing only for old text slots we couldn't read. */
  date: string | null;
  /** Original written date, shown when `date` is missing. */
  dateText?: string;
  /** Old text-only past items whose written date can't be read stay in Past. */
  alwaysPast?: boolean;
  timeText?: string;
  location?: string;
  category: EventCategory;
  categoryLabel: string;
  description?: string;
  link?: string;
  linkLabel?: string;
  image?: EventImage;
  featured: boolean;
  photos: EventImage[];
  videoUrl?: string;
}

/** The CMS `eventItem` shape (after src/lib/cms-records `convert`, or raw for the migration). */
export interface EventItem<I = EventImage> {
  _key?: string;
  _type?: 'eventItem';
  title: string;
  date?: string;
  timeText?: string;
  location?: string;
  category: EventCategory;
  categoryLabel?: string;
  description?: string;
  link?: string;
  linkLabel?: string;
  image?: I;
  featured?: boolean;
  photos?: Array<{ src?: string; alt?: string; caption?: string }>;
  videoUrl?: string;
}

// ---------------------------------------------------------------------------------------------
// Original keyed slots on the Events page. Key + default text, exactly as the template used them.

type Text = readonly [key: string, fallback: string];
interface CardSlot {
  key: string; anchor?: string; cat: EventCategory;
  link: Text; month: Text; day: Text; year: Text;
  image: readonly [key: string, src: string, alt: string];
  category: Text; title: Text; desc: Text; time?: Text; location?: Text;
}
interface PastSlot { key: string; cat: EventCategory; categoryLabel?: string; date: Text; title: Text; desc: Text }

export const LEGACY_EVENT_CARDS: readonly CardSlot[] = [
  {
    key: 'pink-bag-event', anchor: 'pink-bag-event', cat: 'support',
    link: ['link-c975770d3e-1', 'https://www.fashionplace.com/en/events/50851/'],
    month: ['text-492c5f509c-1', 'SEP'], day: ['text-887309d048-2', '26'], year: ['text-aee655773d-1', '2026'],
    image: ['image-8ad26086fb-1', '/images/event-pink-bag-640.webp', 'People receiving pink resource bags at a community event'],
    category: ['text-f14e95f52d-1', 'Patient Resources'], title: ['text-108325cf43-1', 'Pink Bag Event'],
    desc: ['text-11f8f8c6ad-1', 'A community resource and support event for breast cancer patients and survivors.'],
    // This card's only detail line is "time · place".
    time: ['text-a7e8f83583-1', '10:00 AM–1:30 PM · Fashion Place Mall'],
  },
  {
    key: 'utah-prostate-cancer-run', cat: 'fundraiser',
    link: ['link-746a0d23a3', 'https://utahprostatecancerrun.com/'],
    month: ['text-aa58169fd2-1', 'OCT'], day: ['text-b1d5781111-1', '10'], year: ['text-aee655773d-2', '2026'],
    image: ['image-4b73894c12', '/images/event-prostate-run-640.webp', 'Runners gathering at a farm for a community prostate cancer run'],
    category: ['text-12bc9a713f', 'Fundraiser'], title: ['text-3d7e931962', 'Utah Prostate Cancer Run & Walk'],
    desc: ['text-bc6a22e715', 'A 5K run/walk and family-friendly 1-mile stroll supporting prostate cancer patients and early detection.'],
    location: ['text-d8586c0be0', 'Wheeler Historic Farm, Salt Lake City'],
  },
  {
    key: 'haunted-salt-lake-city', cat: 'community',
    link: ['link-4e3c6d529a', 'https://runtasticevents.com/races/haunted-salt-lake-city/'],
    month: ['text-aa58169fd2-2', 'OCT'], day: ['text-0716d9708d', '17'], year: ['text-aee655773d-3', '2026'],
    image: ['image-0d0446a840', '/images/event-haunted-half-640.webp', 'Costumed runners at a fall race in Salt Lake City'],
    category: ['text-58988359c8', 'Run / Walk'], title: ['text-df0b58f960', 'HAUNTED Salt Lake City'],
    desc: ['text-d7c56685bd', 'A costume-ready half marathon, 5K, and kids run from Emigration Canyon to Sugar House Park.'],
    time: ['text-77b1c41b42', 'Half starts 8:00 AM'], location: ['text-5ae38a9069', 'Sugar House Park'],
  },
  {
    key: 'making-strides', anchor: 'making-strides', cat: 'fundraiser',
    link: ['link-6ba352001e', 'https://makingstrideswalk.org/saltlakecityut'],
    month: ['text-aa58169fd2-3', 'OCT'], day: ['text-4d134bc072', '24'], year: ['text-aee655773d-4', '2026'],
    image: ['image-9c9855db85', '/images/event-making-strides-640.webp', 'Breast cancer awareness walk participants gathered outside a stadium'],
    category: ['text-12bc9a713f-1', 'Fundraiser'], title: ['text-deac30791e', 'Making Strides Against Breast Cancer Walk'],
    desc: ['text-95ff303111', 'Walk together to honor survivors, remember loved ones, and support the fight against breast cancer.'],
    time: ['text-e07c937388', 'Time to be announced'], location: ['text-8a946df913', 'America First Field'],
  },
  {
    key: 'pinksync', anchor: 'pinksync', cat: 'support',
    link: ['link-f9d1dba0f0', 'https://www.pinksync.org/registration-pages/register'],
    month: ['text-aa58169fd2-4', 'OCT'], day: ['text-4d134bc072-1', '24'], year: ['text-aee655773d-5', '2026'],
    image: ['image-2e7ef35aa4', '/images/event-pinksync-640.webp', 'People visiting a pink community resource fair'],
    category: ['text-f14e95f52d-2', 'Patient Resources'], title: ['text-4fad3b9ce6', 'PinkSync'],
    desc: ['text-35ee5bdd80', 'A patient resource event featuring speakers, practical information, and valuable resources.'],
    time: ['text-2c5dbebcfe', '9:00 AM–2:00 PM'], location: ['text-49b45386ef', 'Awardco Headquarters, Lindon'],
  },
  {
    key: 'runtastic-thankful', cat: 'community',
    link: ['link-82d6199a29', 'https://runtasticevents.com/races/thankful/'],
    month: ['text-f62ce2aaac-1', 'NOV'], day: ['text-887309d048-3', '26'], year: ['text-aee655773d-6', '2026'],
    image: ['image-2b7587dd52', '/images/event-thankful-640.webp', 'Families running together through an autumn landscape at Thanksgiving Point'],
    category: ['text-58988359c8-1', 'Run / Walk'], title: ['text-c3b5295cf5', 'Runtastic THANKFUL'],
    desc: ['text-d39d8a2513', 'A Thanksgiving Day half marathon, 10K, 5K, and kids run along the Jordan River Trail.'],
    time: ['text-c569d6528c', 'Half starts 7:45 AM'], location: ['text-1c6fd50226', 'Thanksgiving Point, Lehi'],
  },
];

// The older text-only items had no category; these are best guesses for editors to review.
export const LEGACY_PAST_EVENTS: readonly PastSlot[] = [
  { key: 'runtastic-nebo', cat: 'community', categoryLabel: 'Run / Walk', date: ['text-d9fd4d8c32', 'August 29, 2026'], title: ['text-b48c7fa62c', 'Runtastic NEBO'], desc: ['text-3ddcbbc836', 'A marathon, half marathon, 10K, and 5K through Payson Canyon, finishing at Memorial Park in Payson.'] },
  { key: 'spring-wellness-fair', cat: 'community', date: ['text-7e1c4f6044', 'April 19, 2026'], title: ['text-5e865727e6', 'Spring Wellness Fair'], desc: ['text-9f17e8677c', 'Screenings, demos, and provider Q&A across three campuses.'] },
  { key: 'clinical-trials-open-house', cat: 'support', date: ['text-796a240905', 'March 8, 2026'], title: ['text-00c0805001', 'Clinical Trials Open House'], desc: ['text-f9300dddc8', "Learn how clinical trials work and what's currently enrolling at UCS."] },
  { key: 'heart-to-heart-survivor-brunch', cat: 'community', date: ['text-0b779b3b02', 'February 14, 2026'], title: ['text-6a7fa596cc', 'Heart-to-Heart Survivor Brunch'], desc: ['text-8482188db2', 'A morning of stories, laughter, and brunch with our survivor community.'] },
  { key: 'new-year-new-conversations', cat: 'support', date: ['text-bf1b1913ea', 'January 25, 2026'], title: ['text-2c3be83480', 'New Year, New Conversations'], desc: ['text-029c48b73f', 'A panel discussion on goal-setting through and beyond cancer treatment.'] },
];

/** The featured block's own fields on the original page. */
export const LEGACY_FEATURED = {
  title: ['text-108325cf43', 'Pink Bag Event'],
  description: ['text-11f8f8c6ad', 'A community resource and support event for breast cancer patients and survivors.'],
  date: ['text-aa9721454a', 'Saturday, September 26, 2026'],
  time: ['text-a7e8f83583', '10:00 AM–1:30 PM · Fashion Place Mall'],
  link: ['link-c975770d3e', 'https://www.fashionplace.com/en/events/50851/'],
  category: ['text-f14e95f52d', 'Patient Resources'],
  image: ['image-8ad26086fb', '/images/event-pink-bag-640.webp', 'People receiving pink resource bags at a community event'],
} as const;

export interface LegacyEventItem<I> extends EventItem<I> {
  /** The written date when it couldn't be read as a date. */
  unreadableDate?: string;
  /** True for the old text-only "Recently Past" items. */
  legacyPast?: boolean;
  anchor?: string;
}

const clean = (value: string | undefined) => (value ?? '').trim() || undefined;

/** Split "10:00 AM–1:30 PM · Fashion Place Mall" into time and place. */
function splitTimeAndPlace(time?: string, location?: string): { timeText?: string; location?: string } {
  if (time && !location && time.includes(' · ')) {
    const [first, ...rest] = time.split(' · ');
    return { timeText: clean(first), location: clean(rest.join(' · ')) };
  }
  return { timeText: clean(time), location: clean(location) };
}

/**
 * Map the original keyed text slots to event list items. `text` and `image` read a key with the
 * template's default; the site passes pageEditor accessors, the migration passes raw CMS values.
 */
export function legacyEventItems<I>(text: (key: string, fallback: string) => string, image: (key: string, src: string, alt: string) => I): LegacyEventItem<I>[] {
  const featuredTitle = text(...LEGACY_FEATURED.title).trim().toLowerCase();
  const cards = LEGACY_EVENT_CARDS.map((slot): LegacyEventItem<I> => {
    const date = eventDateKey(text(...slot.month), text(...slot.day), text(...slot.year)) ?? undefined;
    const title = text(...slot.title);
    const categoryLabel = clean(text(...slot.category));
    return {
      _key: slot.key, _type: 'eventItem', anchor: slot.anchor,
      title, date, unreadableDate: date ? undefined : [text(...slot.month), text(...slot.day), text(...slot.year)].join(' ').trim(),
      ...splitTimeAndPlace(slot.time && text(...slot.time), slot.location && text(...slot.location)),
      category: slot.cat,
      categoryLabel: categoryLabel && categoryLabel !== EVENT_CATEGORIES[slot.cat] ? categoryLabel : undefined,
      description: clean(text(...slot.desc)),
      link: clean(text(...slot.link)),
      image: image(...slot.image),
      featured: title.trim().toLowerCase() === featuredTitle || undefined,
    };
  });
  const past = LEGACY_PAST_EVENTS.map((slot): LegacyEventItem<I> => {
    const written = text(...slot.date);
    const date = parseWrittenDate(written) ?? undefined;
    return {
      _key: slot.key, _type: 'eventItem', legacyPast: true,
      title: text(...slot.title), date, unreadableDate: date ? undefined : written,
      category: slot.cat, categoryLabel: slot.categoryLabel,
      description: clean(text(...slot.desc)),
    };
  });
  return [...cards, ...past];
}

// ---------------------------------------------------------------------------------------------
// Rendering helpers

export function slugify(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
}

function isCategory(value: unknown): value is EventCategory {
  return typeof value === 'string' && value in EVENT_CATEGORIES;
}

function toImage(value: any): EventImage | undefined {
  const src = typeof value?.src === 'string' ? value.src.trim() : '';
  return src ? { src, alt: String(value.alt ?? ''), ...(clean(value.caption) ? { caption: clean(value.caption) } : {}) } : undefined;
}

/** Turn list items into render-ready events with unique anchors. Items without a title are skipped. */
export function toSiteEvents(items: Array<LegacyEventItem<any> | EventItem<any>>): SiteEvent[] {
  const used = new Set<string>();
  const events: SiteEvent[] = [];
  for (const item of items) {
    const title = clean(item?.title);
    if (!title) continue;
    const legacy = item as LegacyEventItem<any>;
    const date = validDate(item.date);
    let id = legacy.anchor || slugify(title);
    if (used.has(id)) id = `${id}-${date ?? events.length}`;
    used.add(id);
    const category = isCategory(item.category) ? item.category : 'community';
    events.push({
      id, title, date,
      dateText: date ? undefined : clean(legacy.unreadableDate),
      alwaysPast: !date && legacy.legacyPast ? true : undefined,
      timeText: clean(item.timeText), location: clean(item.location),
      category, categoryLabel: clean(item.categoryLabel) || EVENT_CATEGORIES[category],
      description: clean(item.description),
      link: clean(item.link), linkLabel: clean(item.linkLabel),
      image: toImage(item.image),
      featured: Boolean(item.featured),
      photos: (item.photos ?? []).map(toImage).filter((photo): photo is EventImage => Boolean(photo)),
      videoUrl: clean(item.videoUrl),
    });
  }
  return events;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** A Sanity date ("YYYY-MM-DD") if it is a real calendar date. */
function validDate(value: string | undefined): string | null {
  const parts = value?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return parts ? eventDateKey(MONTH_NAMES[Number(parts[2]) - 1], parts[3], parts[1]) : null;
}

export interface ResolvedEvents {
  source: 'list' | 'legacy';
  events: SiteEvent[];
  /** In legacy mode, the featured block's own fields (it can differ from its card). */
  legacyFeatured?: SiteEvent;
}

/** Events for a page: the CMS list when it exists, otherwise the original keyed slots. */
export function resolveEvents(page: PageData): ResolvedEvents {
  if (Array.isArray(page.events)) return { source: 'list', events: toSiteEvents(page.events) };
  const edit = pageEditor(page);
  const items = legacyEventItems(edit.text, (key, src, alt) => ({ src: edit.image(key, src), alt: edit.imageAlt(key, alt) }));
  const events = toSiteEvents(items);
  const card = events.find(event => event.featured);
  const writtenDate = edit.text(...LEGACY_FEATURED.date);
  const [featuredItem] = toSiteEvents([{
    ...splitTimeAndPlace(edit.text(...LEGACY_FEATURED.time)),
    title: edit.text(...LEGACY_FEATURED.title),
    description: edit.text(...LEGACY_FEATURED.description),
    link: edit.text(...LEGACY_FEATURED.link),
    category: card?.category ?? 'support',
    categoryLabel: edit.text(...LEGACY_FEATURED.category),
    image: { src: edit.image(LEGACY_FEATURED.image[0], LEGACY_FEATURED.image[1]), alt: edit.imageAlt(LEGACY_FEATURED.image[0], LEGACY_FEATURED.image[2]) },
    date: parseWrittenDate(writtenDate) ?? card?.date ?? undefined,
    featured: true,
  }]);
  // The matching card is marked featured (used by the homepage); the Events page's featured block
  // shows the block's own fields.
  return { source: 'legacy', events, legacyFeatured: featuredItem && { ...featuredItem, id: card?.id ?? featuredItem.id } };
}

export function isPast(event: SiteEvent, today: string): boolean {
  return event.alwaysPast === true || isEventPast(event.date, today);
}

const byDate = (direction: 1 | -1) => (a: SiteEvent, b: SiteEvent) => {
  if (a.date && b.date) return direction * a.date.localeCompare(b.date);
  return a.date ? -1 : b.date ? 1 : 0; // undated last
};

/** Upcoming (soonest first) and Past (most recent first) on a given Denver day. */
export function splitEvents(events: SiteEvent[], today: string): { upcoming: SiteEvent[]; past: SiteEvent[] } {
  return {
    upcoming: events.filter(event => !isPast(event, today)).sort(byDate(1)),
    past: events.filter(event => isPast(event, today)).sort(byDate(-1)),
  };
}

/**
 * Featured block candidates in priority order: upcoming events marked featured (soonest first),
 * then the other upcoming events (soonest first). The first one that hasn't passed is shown.
 */
export function featuredCandidates(upcoming: SiteEvent[], flagged: SiteEvent[] = upcoming.filter(event => event.featured)): SiteEvent[] {
  const first = new Set(flagged);
  return [...flagged.slice().sort(byDate(1)), ...upcoming.filter(event => !first.has(event))];
}

/** Run / walk events, for the hero count. */
export function isRunWalk(event: SiteEvent): boolean {
  return /\b(run|walk|5k|10k|marathon|race)\b/i.test(`${event.categoryLabel} ${event.title}`);
}

/** YouTube or Vimeo embed address for a video link, or null when it should just be linked. */
export function videoEmbedUrl(value: string | undefined): string | null {
  if (!value) return null;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  let id: string | null | undefined;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
  }
  if (id && /^[\w-]{6,}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const vimeo = url.pathname.match(/(?:^|\/)(\d{5,})(?:\/|$)/)?.[1];
    if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  }
  return null;
}
