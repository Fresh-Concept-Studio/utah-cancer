import test from 'node:test';
import assert from 'node:assert/strict';
import {featuredCandidates, resolveEvents, splitEvents, toSiteEvents, videoEmbedUrl, isRunWalk} from '../src/lib/events.ts';
import {planEventsMigration} from '../src/lib/events-migration.ts';
import {convert} from '../src/lib/cms-records.ts';
import {eventDateParts} from '../src/lib/event-dates.ts';
import type {PageData} from '../src/lib/types.ts';

const page = (extra: Partial<PageData> = {}): PageData => ({title: 'Events', styles: [], scripts: [], component: 'events-index', ...extra});

// A small Events page document as Sanity stores it (not live content).
const fixture = {
  editorContent: [
    {_key: 'text-108325cf43', key: 'text-108325cf43', value: 'Fall Fair'},
    {_key: 'link-c975770d3e-1', key: 'link-c975770d3e-1', value: 'https://example.org/fair'},
    {_key: 'text-492c5f509c-1', key: 'text-492c5f509c-1', value: 'oct'},
    {_key: 'text-887309d048-2', key: 'text-887309d048-2', value: '3'},
    {_key: 'text-aee655773d-1', key: 'text-aee655773d-1', value: '2027'},
    {_key: 'text-f14e95f52d-1', key: 'text-f14e95f52d-1', value: 'Patient Resources'},
    {_key: 'text-108325cf43-1', key: 'text-108325cf43-1', value: 'Fall Fair'},
    {_key: 'text-11f8f8c6ad-1', key: 'text-11f8f8c6ad-1', value: 'Resources and screenings.'},
    {_key: 'text-a7e8f83583-1', key: 'text-a7e8f83583-1', value: '9:00 AM–noon · Main Clinic'},
    {_key: 'text-58988359c8', key: 'text-58988359c8', value: 'Run / Walk'},
    {_key: 'text-0716d9708d', key: 'text-0716d9708d', value: 'TBD'},
    {_key: 'text-d9fd4d8c32', key: 'text-d9fd4d8c32', value: 'Summer 2026'},
  ],
  editorImages: [
    {_key: 'image-8ad26086fb-1', key: 'image-8ad26086fb-1', image: {_type: 'legacyImage', src: '/images/old.webp', alt: 'Fair booth', asset: {_type: 'image', asset: {_ref: 'image-abc-1200x800-jpg', _type: 'reference'}, hotspot: {x: 0.4, y: 0.5, width: 1, height: 1}}}},
  ],
};

test('migration maps keyed slots to events and keeps uploaded image references', () => {
  const plan = planEventsMigration(fixture);
  const fair = plan.events.find(event => event._key === 'pink-bag-event')!;
  assert.equal(fair.title, 'Fall Fair');
  assert.equal(fair.date, '2027-10-03');
  assert.equal(fair.timeText, '9:00 AM–noon');
  assert.equal(fair.location, 'Main Clinic');
  assert.equal(fair.category, 'support');
  assert.equal(fair.categoryLabel, undefined, 'label equal to the category name is not stored');
  assert.equal(fair.featured, true, 'matches the featured block title');
  assert.equal(fair.link, 'https://example.org/fair');
  assert.equal((fair.image as any).asset.asset._ref, 'image-abc-1200x800-jpg');
  assert.deepEqual((fair.image as any).asset.hotspot, {x: 0.4, y: 0.5, width: 1, height: 1});
  assert.equal(fair._type, 'eventItem');
  for (const event of plan.events) {
    assert.ok(!('anchor' in event) && !('legacyPast' in event) && !('unreadableDate' in event), 'no website-only fields');
    assert.ok(Object.values(event).every(value => value !== undefined));
  }
  const haunted = plan.events.find(event => event._key === 'haunted-salt-lake-city')!;
  assert.equal(haunted.categoryLabel, 'Run / Walk');
  assert.equal(haunted.date, undefined);
  assert.equal(plan.events.length, 11);
  assert.ok(plan.problems.some(problem => problem.includes('HAUNTED')), 'unreadable day is reported');
  assert.ok(plan.problems.some(problem => problem.includes('Summer 2026')), 'unreadable past date is reported');
  assert.ok(plan.defaultsUsed.includes('text-3d7e931962'), 'missing slots fall back to template defaults and are listed');
  assert.ok(plan.defaultsUsed.includes('image-4b73894c12'));
});

test('the repository fallback content migrates cleanly', async () => {
  const defaults = (await import('../src/data/page-content.json', {with: {type: 'json'}})).default as any;
  const plan = planEventsMigration(defaults['events-index']);
  assert.deepEqual(plan.problems, []);
  assert.deepEqual(plan.defaultsUsed, []);
  assert.ok(plan.events.every(event => /^\d{4}-\d{2}-\d{2}$/.test(event.date!)));
});

test('without an events list, the page still renders events from its original slots', () => {
  const resolved = resolveEvents(page());
  assert.equal(resolved.source, 'legacy');
  assert.equal(resolved.events.length, 11);
  assert.ok(resolved.legacyFeatured, 'featured block fields are read');
  assert.equal(resolved.events.find(event => event.title === 'Pink Bag Event')?.id, 'pink-bag-event', 'old anchors are kept');
  const empty = resolveEvents(page({events: []}));
  assert.equal(empty.source, 'list');
  assert.equal(empty.events.length, 0);
});

const sample = toSiteEvents([
  {title: 'Later', date: '2026-12-01', category: 'community'},
  {title: 'Soon', date: '2026-10-24', category: 'support', featured: false},
  {title: 'Flagged later', date: '2026-11-15', category: 'fundraiser', featured: true},
  {title: 'Old', date: '2026-01-05', category: 'support'},
  {title: 'Event day', date: '2026-10-21', category: 'community', categoryLabel: 'Run / Walk'},
  {title: 'Bad date', date: '2026-02-30', category: 'support'},
  {title: '', date: '2026-10-30', category: 'support'},
] as any);

test('events split by Denver day: soonest first upcoming, most recent first past', () => {
  assert.equal(sample.length, 6, 'untitled items are skipped');
  const {upcoming, past} = splitEvents(sample, '2026-10-21');
  assert.deepEqual(upcoming.map(event => event.title), ['Event day', 'Soon', 'Flagged later', 'Later', 'Bad date']);
  assert.deepEqual(past.map(event => event.title), ['Old']);
  assert.deepEqual(splitEvents(sample, '2026-10-22').past.map(event => event.title), ['Event day', 'Old']);
});

test('featured: earliest upcoming flagged event, else earliest upcoming', () => {
  const {upcoming} = splitEvents(sample, '2026-10-21');
  assert.equal(featuredCandidates(upcoming)[0].title, 'Flagged later');
  assert.equal(featuredCandidates(upcoming).length, upcoming.length);
  const unflagged = upcoming.filter(event => !event.featured);
  assert.equal(featuredCandidates(unflagged)[0].title, 'Event day');
  assert.deepEqual(featuredCandidates([]), []);
});

test('event details normalize from the CMS shape', () => {
  const [event] = toSiteEvents([{
    title: ' Gala ', date: '2026-11-02', category: 'nonsense' as any, categoryLabel: '  ',
    image: {src: '/images/gala.webp', alt: 'Gala'},
    photos: [{src: 'https://cdn.sanity.io/images/x/y/a-10x10.jpg', alt: 'Dancing', caption: 'First dance'}, {alt: 'no source'}],
    videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
  }]);
  assert.equal(event.title, 'Gala');
  assert.equal(event.category, 'community', 'unknown category falls back');
  assert.equal(event.categoryLabel, 'Community');
  assert.equal(event.id, 'gala');
  assert.equal(event.photos.length, 1);
  assert.equal(event.photos[0].caption, 'First dance');
  assert.ok(isRunWalk(toSiteEvents([{title: 'Turkey Trot 5K', date: '2026-11-26', category: 'community'}])[0]));
  const twins = toSiteEvents([{title: 'Walk', date: '2026-05-01', category: 'community'}, {title: 'Walk', date: '2027-05-01', category: 'community'}]);
  assert.notEqual(twins[0].id, twins[1].id, 'anchors stay unique');
});

test('Sanity photo uploads keep their crop and focal point', () => {
  const [photo] = convert([{_type: 'image', _key: 'p1', alt: 'Crowd', caption: 'Start line', asset: {url: 'https://cdn.sanity.io/images/spba0u9p/production/abc-1000x500.jpg'}, hotspot: {x: 0.25, y: 0.5, width: 1, height: 1}}]);
  const src = new URL(photo.src);
  assert.equal(src.searchParams.get('fp-x'), '0.25');
  assert.equal(photo.alt, 'Crowd');
  assert.equal(photo.caption, 'Start line');
});

test('video links become embeds only for YouTube and Vimeo', () => {
  assert.equal(videoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(videoEmbedUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(videoEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(videoEmbedUrl('https://vimeo.com/123456789'), 'https://player.vimeo.com/video/123456789');
  assert.equal(videoEmbedUrl('https://www.facebook.com/watch/?v=1'), null);
  assert.equal(videoEmbedUrl('not a url'), null);
  assert.equal(videoEmbedUrl(undefined), null);
});

test('date parts for calendar tiles and labels', () => {
  assert.deepEqual(eventDateParts('2026-09-26'), {month: 'SEP', short: 'Sep', name: 'September', day: '26', year: '2026', weekday: 'Saturday'});
});
