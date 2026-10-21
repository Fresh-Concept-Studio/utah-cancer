/**
 * Create the Events page's `events` list from its current keyed text slots.
 * Dry run unless --apply is passed. Run with tsx (it imports the site's TypeScript mapping):
 *
 *   npx tsx scripts/migrate-events-to-list.mjs            # review
 *   npx tsx scripts/migrate-events-to-list.mjs --apply    # write
 *
 * Reads the published Events page fresh from Sanity and stops if it has a draft. Sets `events`
 * only when the field doesn't exist yet, and appends the new editor text keys only when missing.
 * Patches are guarded by the fetched revision. With --apply, the documents are backed up first
 * to .sanity/backups/ (gitignored). Existing text slots are left in place.
 */
import {createClient} from '@sanity/client';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {planEventsMigration, NEW_EDITOR_KEYS} from '../src/lib/events-migration.ts';

const apply = process.argv.includes('--apply');
const root = resolve(import.meta.dirname, '..');
const token = process.env.SANITY_WRITE_TOKEN || JSON.parse(readFileSync(`${process.env.HOME}/.config/sanity/config.json`, 'utf8')).authToken;
const client = createClient({projectId: 'spba0u9p', dataset: 'production', apiVersion: '2026-09-21', token, useCdn: false, perspective: 'raw'});
const EVENTS_ID = 'page-events-index-html';

const ids = Object.keys(NEW_EDITOR_KEYS);
const docs = await client.fetch('*[_id in $ids || _id in $drafts]', {ids, drafts: ids.map(id => `drafts.${id}`)});
const byId = new Map(docs.map(doc => [doc._id, doc]));
const eventsPage = byId.get(EVENTS_ID);
if (!eventsPage) throw new Error(`${EVENTS_ID} was not found.`);
if (byId.has(`drafts.${EVENTS_ID}`)) {
  console.error('The Events page has an unpublished draft. Publish or discard it in the Studio, then run this again.');
  process.exit(1);
}

const defaults = JSON.parse(readFileSync(resolve(root, 'src/data/page-content.json'), 'utf8'));
const componentFor = {[EVENTS_ID]: 'events-index', 'page-index-html': 'index'};
const operations = [];

// 1. The events list.
const plan = planEventsMigration(eventsPage);
if (eventsPage.events !== undefined) {
  console.log(`Events list: already present (${Array.isArray(eventsPage.events) ? eventsPage.events.length : '?'} events). Nothing to create.`);
} else {
  if (plan.problems.length) {
    console.error(['Cannot create the events list:', ...plan.problems.map(problem => `  - ${problem}`)].join('\n'));
    process.exit(1);
  }
  console.log(`Events list: would create ${plan.events.length} events on ${EVENTS_ID} (rev ${eventsPage._rev}):`);
  for (const event of plan.events) {
    const image = event.image ? (event.image.asset ? 'uploaded image' : `image ${event.image.src}`) : 'no image';
    const details = [event.timeText, event.location].filter(Boolean).join(' · ');
    console.log(`  ${event.date}  ${event.title}${event.featured ? '  [featured]' : ''}`);
    console.log(`              ${event.category}${event.categoryLabel ? ` ("${event.categoryLabel}")` : ''} · ${image}${event.link ? ` · ${event.link}` : ''}${details ? `\n              ${details}` : ''}`);
  }
  if (plan.defaultsUsed.length) console.log(`  Note: these slots were missing, so template defaults were used: ${plan.defaultsUsed.join(', ')}`);
  operations.push({doc: eventsPage, setIfMissing: {events: plan.events}, append: []});
}

// 2. New editor text keys for the tabs and empty states.
for (const [id, keys] of Object.entries(NEW_EDITOR_KEYS)) {
  const doc = byId.get(id);
  if (!doc) { console.log(`${id}: not found; skipped new text keys.`); continue; }
  if (byId.has(`drafts.${id}`)) { console.log(`${id}: has an unpublished draft; skipped new text keys (add them after that draft is published).`); continue; }
  const existing = new Set((doc.editorContent ?? []).map(item => item.key || item._key));
  const missing = defaults[componentFor[id]].editorContent.filter(item => keys.includes(item.key) && !existing.has(item.key));
  if (!missing.length) continue;
  console.log(`${id}: would add text fields ${missing.map(item => `${item.key} ("${item.value}")`).join(', ')}`);
  const operation = operations.find(op => op.doc._id === id);
  if (operation) operation.append = missing;
  else operations.push({doc, setIfMissing: null, append: missing});
}

if (!operations.length) {
  console.log('Nothing to do.');
  process.exit(0);
}
if (!apply) {
  console.log('\nDry run: nothing was written. Re-run with --apply to write these changes.');
  process.exit(0);
}

const folder = resolve(root, '.sanity/backups');
mkdirSync(folder, {recursive: true, mode: 0o700});
const backup = resolve(folder, `before-events-list-${Date.now()}.json`);
writeFileSync(backup, JSON.stringify(operations.map(op => op.doc), null, 2), {mode: 0o600});
let transaction = client.transaction();
for (const {doc, setIfMissing, append} of operations) {
  transaction = transaction.patch(doc._id, patch => {
    let next = patch.ifRevisionId(doc._rev);
    if (setIfMissing) next = next.setIfMissing(setIfMissing);
    if (append.length) next = next.setIfMissing({editorContent: []}).insert('after', 'editorContent[-1]', append);
    return next;
  });
}
await transaction.commit();
const after = await client.fetch('*[_id in $ids]{_id, "events": count(events)}', {ids: operations.map(op => op.doc._id)});
console.log(`Written. Backup: ${backup}`);
console.log(JSON.stringify(after));
