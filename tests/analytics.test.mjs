import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from 'cheerio';
import { base, files, site } from './helpers.mjs';

const source = fs.readFileSync('public/scripts/analytics.js', 'utf8');
const id = 'G-68V7TELGCD';
function browser(overrides = {}) {
  const button = { hidden: true, addEventListener(event, fn) { this.click = fn; } };
  const status = {};
  const scripts = [];
  const stored = new Map();
  let reloads = 0;
  if (overrides.optedOut) stored.set('ucs.analytics-opt-out', '1');
  const win = {};
  win.self = win;
  win.top = overrides.frame ? {} : win;
  const handlers = {};
  const links = (overrides.links || []).map(href => ({ href }));
  const context = {
    URL, URLSearchParams, window: win, navigator: overrides.navigator || {},
    location: { origin: 'https://utahcancer.com', pathname: '/about/', search: '', hash: '', reload() { reloads++; }, ...overrides.location },
    sessionStorage: { getItem() { return overrides.editor ? '1' : null; } },
    localStorage: { getItem(k) { return stored.get(k) || null; }, setItem(k, v) { stored.set(k, v); } },
    document: {
      currentScript: { dataset: { measurementId: id, origin: 'https://utahcancer.com', path: '/about/', title: 'About Us' } },
      referrer: overrides.referrer || '', cookie: '_ga=example',
      getElementById(name) { return name === 'analytics-opt-out' ? button : status; },
      querySelector() { return overrides.form ? {} : null; }, querySelectorAll() { return links; },
      addEventListener(event, fn) { handlers[event] = fn; },
      createElement() { return {}; }, head: { appendChild(script) { scripts.push(script); } }
    }
  };
  vm.runInNewContext(source, context);
  return { context, scripts, button, status, stored, links,
    get calls() { return Array.from(win.dataLayer || [], args => Array.from(args)); },
    get reloads() { return reloads; },
    click(index) { handlers.click({ target: { closest() { return links[index]; } } }); }
  };
}

test('public marketing visits start once without a banner, with advertising disabled', () => {
  const b = browser();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].referrerPolicy, 'no-referrer');
  assert.equal(b.calls[0][2].analytics_storage, 'granted');
  assert.equal(b.calls[0][2].ad_storage, 'denied');
  const config = b.calls.find(call => call[0] === 'config')[2];
  assert.equal(config.page_location, 'https://utahcancer.com/about/');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.send_page_view, false);
  vm.runInNewContext(source, b.context);
  assert.equal(b.scripts.length, 1);
  assert.equal(b.calls.filter(call => call[0] === 'event' && call[1] === 'page_view').length, 1);
});

test('tracking is absent for forms, previews, editors, mismatched routes, frames, and opt-outs', () => {
  for (const options of [
    { location: { origin: 'http://localhost:4322' } },
    { location: { origin: 'https://fresh-concept-studio.github.io' } },
    { location: { pathname: '/contact/' } },
    { location: { search: '?siteadjust=private-token' } },
    { location: { search: '?sitewalk=1' } },
    { editor: true }, { frame: true }, { form: true }, { optedOut: true },
    { navigator: { globalPrivacyControl: true } }, { navigator: { doNotTrack: '1' } }
  ]) {
    const b = browser(options);
    assert.equal(b.scripts.length, 0, JSON.stringify(options));
    assert.equal(b.context.window.dataLayer, undefined);
  }
});

test('campaign attribution survives while arbitrary URL values and referrer paths are removed', () => {
  const b = browser({
    location: { search: '?utm_source=newsletter&utm_medium=email&utm_campaign=fall-2026&email=private@example.test&q=private&utm_term=private', hash: '#private' },
    referrer: 'https://www.google.com/search?q=private@example.test'
  });
  const config = b.calls.find(call => call[0] === 'config')[2];
  assert.equal(config.campaign_source, 'newsletter');
  assert.equal(config.campaign_medium, 'email');
  assert.equal(config.campaign_name, 'fall-2026');
  assert.equal(config.campaign_term, '(redacted)');
  assert.equal(config.page_referrer, 'https://www.google.com/');
  assert.equal(JSON.stringify(b.calls).includes('private'), false);
  const unsafe = browser({ location: { search: '?utm_source=patient%40example.test&utm_campaign=8015551234' }, referrer: 'https://www.navigatingcare.com/private' });
  assert.equal(JSON.stringify(unsafe.calls).includes('patient'), false);
  assert.equal(unsafe.calls.find(call => call[0] === 'config')[2].page_referrer, '');
});

test('contact and content events omit personal details and ignore portal/payment/form destinations', () => {
  const b = browser({ links: [
    'tel:8015551234', 'mailto:office@example.test',
    'https://utahcancer.com/files/brochure.pdf?token=private',
    'https://www.cancer.org/resources/?q=private',
    'https://www.navigatingcare.com/navigatingcare/',
    'https://mypay.poscorp.com/UtahCancer#/account/login',
    'https://utahcancer.com/contact/', 'https://formsubmit.co/private'
  ] });
  b.links.forEach((_, index) => b.click(index));
  const events = b.calls.filter(call => call[0] === 'event');
  assert.deepEqual(events.map(call => call[1]), ['page_view', 'contact_click', 'contact_click', 'file_download', 'click']);
  for (const sensitive of ['8015551234', 'office@example', 'private', 'navigatingcare', 'poscorp', 'formsubmit']) assert.equal(JSON.stringify(events).includes(sensitive), false);
  b.links[0].href = 'https://example.test/untrusted';
  b.click(0);
  assert.equal(b.calls.filter(call => call[0] === 'event').length, 5);
});

test('opt-out disables collection immediately, clears the cookie, and persists across loads', () => {
  const b = browser();
  b.button.click();
  assert.equal(b.context.window[`ga-disable-${id}`], true);
  assert.equal(b.stored.get('ucs.analytics-opt-out'), '1');
  assert.equal(b.reloads, 1);
  assert.match(b.context.document.cookie, /Max-Age=0/);
  assert.equal(browser({ optedOut: true }).scripts.length, 0);
});

test('built pages include marketing tracking only in production and exclude form/error routes', () => {
  const production = site === 'https://utahcancer.com' && process.env.SITE_INDEXABLE === 'true';
  let included = 0;
  for (const file of files('dist').filter(file => file.endsWith('.html'))) {
    const $ = load(fs.readFileSync('dist/' + file, 'utf8'));
    const tags = $('script[src$="/scripts/analytics.js"]');
    assert.ok(tags.length <= 1);
    if (!production || file === 'contact/index.html' || file === 'job-application/index.html' || file === '404.html' || file.startsWith('errors/') || $('form').length) assert.equal(tags.length, 0, file);
    included += tags.length;
  }
  assert.equal(included > 0, production);
  const privacy = load(fs.readFileSync('dist/privacy-policy/index.html', 'utf8'));
  assert.equal(privacy('#website-analytics').length, 1);
  assert.equal(privacy('#analytics-opt-out').length, 1);
  assert.equal(privacy(`a[href="${base}/privacy-policy/#website-analytics"]`).length, 1);
});
