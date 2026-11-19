import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pageFileName, readRepoRecords} from '../src/lib/content-sources.ts';

function contentFolder(files: Record<string, unknown>) {
  const root = mkdtempSync(join(tmpdir(), 'content-'));
  for (const [name, value] of Object.entries(files)) {
    mkdirSync(join(root, name, '..'), {recursive: true});
    writeFileSync(join(root, name), JSON.stringify(value));
  }
  return root;
}

test('repository records follow their order field, then file name, and drop the order field', () => {
  const root = contentFolder({
    'providers/b.json': {order: 1, slug: 'b'},
    'providers/a.json': {order: 2, slug: 'a'},
    'providers/c.json': {slug: 'c'},
    'settings.json': {mainPhoneDisplay: '801.000.0000'},
  });
  const records = readRepoRecords(root);
  assert.deepEqual(records.provider, [{slug: 'b', contentId: 'providers/b'}, {slug: 'a', contentId: 'providers/a'}, {slug: 'c', contentId: 'providers/c'}]);
  assert.equal(records.siteSettings[0].mainPhoneDisplay, '801.000.0000');
  assert.deepEqual(records.location, []);
});

test('jobs and events are stored apart and rejoin their pages in order', () => {
  const root = contentFolder({
    'pages/careers.json': {path: 'careers.html', title: 'Careers'},
    'pages/events.json': {path: 'events/index.html', title: 'Events'},
    'jobs/nurse.json': {order: 2, title: 'Nurse'},
    'jobs/clerk.json': {order: 1, title: 'Clerk'},
    'events/run.json': {order: 1, title: 'Run'},
  });
  const pages = Object.fromEntries(readRepoRecords(root).page.map((page) => [page.path, page]));
  assert.deepEqual(pages['careers.html'].jobs.map((job: any) => job.title), ['Clerk', 'Nurse']);
  assert.deepEqual(pages['events/index.html'].events, [{title: 'Run', contentId: 'events/run'}]);
  assert.equal(pages['careers.html'].jobs[0].contentId, 'jobs/clerk');
});

test('a missing content folder is an error, not a silent fallback', () => {
  assert.throws(() => readRepoRecords(join(tmpdir(), 'no-such-content-folder')), /No content folder/);
});

test('page file names are readable and the homepage is home.json', () => {
  assert.equal(pageFileName('index.html'), 'home');
  assert.equal(pageFileName('careers.html'), 'careers');
  assert.equal(pageFileName('job-application/index.html'), 'job-application');
  assert.equal(pageFileName('providers/dustin-boothe.html'), 'providers-dustin-boothe');
});
