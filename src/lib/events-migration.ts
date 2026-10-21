// Pure mapping used by scripts/migrate-events-to-list.mjs (and its tests): turn the Events page's
// keyed text slots into the `events` list, preserving image objects (uploads keep their asset
// references, crop, and hotspot; repository images keep their paths).
import { legacyEventItems, type EventItem } from './events';

type Raw = Record<string, any>;

export interface EventsMigrationPlan {
  events: EventItem<Raw>[];
  /** Slots whose key wasn't in the document, so the template default was used. */
  defaultsUsed: string[];
  /** Blocking issues (for example, a date that can't be read). */
  problems: string[];
}

/** Remove undefined values so the patch only contains real fields. */
function compact<T extends Raw>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== '')) as T;
}

export function planEventsMigration(doc: { editorContent?: Raw[]; editorImages?: Raw[] }): EventsMigrationPlan {
  const content = new Map((doc.editorContent ?? []).map(item => [item.key || item._key, item.value]));
  const images = new Map((doc.editorImages ?? []).map(item => [item.key || item._key, item.image]));
  const defaultsUsed: string[] = [];
  const text = (key: string, fallback: string): string => {
    if (!content.has(key)) { defaultsUsed.push(key); return fallback; }
    return String(content.get(key) ?? '');
  };
  const image = (key: string, src: string, alt: string): Raw => {
    const current = images.get(key);
    if (!current) { defaultsUsed.push(key); return { _type: 'legacyImage', src, alt }; }
    const { _key, ...rest } = current;
    return { _type: 'legacyImage', ...rest };
  };
  const problems: string[] = [];
  const events = legacyEventItems(text, image).map(item => {
    if (!item.date) problems.push(`"${item.title}" has a date that can't be read (${item.unreadableDate || 'blank'}); set it by hand.`);
    const { anchor, legacyPast, unreadableDate, ...rest } = item;
    return compact({ ...rest, featured: rest.featured ? true : undefined }) as EventItem<Raw>;
  });
  return { events, defaultsUsed, problems };
}

/** New editor text keys this change adds, by page document. Appended only when missing. */
export const NEW_EDITOR_KEYS: Record<string, string[]> = {
  'page-events-index-html': ['text-events-tab-past', 'text-events-empty-upcoming', 'text-events-empty-past'],
  'page-index-html': ['text-home-events-empty'],
};
