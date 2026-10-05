import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from 'cheerio';

const source = fs.readFileSync('public/scripts/contact-form.js', 'utf8');
function harness(fetch, { valid = true, honey = '' } = {}) {
  const button = {}, label = {}, status = { dataset: {}, focus() {} };
  let submit, resets = 0, timeout;
  const form = {
    dataset: { ajaxEndpoint: 'https://formsubmit.co/ajax/test' },
    querySelector: selector => selector.startsWith('button') ? button : label,
    reportValidity: () => valid,
    setAttribute() {},
    reset() { resets++; },
    addEventListener(name, handler) { submit = handler; },
  };
  vm.runInNewContext(source, {
    document: { getElementById: id => id === 'contact-form' ? form : status },
    window: { fetch }, fetch, AbortController,
    setTimeout(callback) { timeout = callback; return 1; }, clearTimeout() {},
    FormData: class { *[Symbol.iterator]() { yield ['email', 'test@example.com']; yield ['message', 'Keep this message']; yield ['_honey', honey]; } },
  });
  return { button, status, submit: () => submit({ preventDefault() {} }), expire: () => timeout(), get resets() { return resets; } };
}
const accepted = { ok: true, json: async () => ({ success: 'true', message: 'Submitted successfully' }) };

test('successful submission waits for acceptance, prevents duplicate sends, then clears fields', async () => {
  let resolve, calls = 0;
  const ui = harness(() => { calls++; return new Promise(done => { resolve = done; }); });
  const sending = ui.submit();
  assert.equal(ui.button.disabled, true);
  assert.equal(ui.resets, 0);
  await ui.submit();
  assert.equal(calls, 1);
  resolve(accepted);
  await sending;
  assert.equal(ui.resets, 1);
  assert.equal(ui.status.dataset.state, 'success');
  assert.equal(ui.button.disabled, false);
});

test('network, HTTP, malformed JSON, rejected, and unactivated responses retain the message', async () => {
  const failures = [
    async () => { throw new Error('Offline'); },
    async () => ({ ...accepted, ok: false }),
    async () => ({ ok: true, json: async () => { throw new Error('Invalid JSON'); } }),
    async () => ({ ok: true, json: async () => ({ success: false }) }),
    async () => ({ ok: true, json: async () => ({ success: true, message: 'Please activate your form' }) }),
  ];
  for (const fetch of failures) {
    const ui = harness(fetch);
    await ui.submit();
    assert.equal(ui.resets, 0);
    assert.equal(ui.status.dataset.state, 'error');
    assert.equal(ui.button.disabled, false);
  }
});

test('a timed out request retains the message and permits a later attempt', async () => {
  const ui = harness((_, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('Timeout')))));
  const sending = ui.submit();
  ui.expire();
  await sending;
  assert.equal(ui.resets, 0);
  assert.equal(ui.status.dataset.state, 'error');
  assert.equal(ui.button.disabled, false);
});

test('invalid fields and the spam trap never send', async () => {
  let calls = 0;
  for (const options of [{ valid: false }, { honey: 'bot' }]) {
    const ui = harness(async () => { calls++; return accepted; }, options);
    await ui.submit();
    assert.equal(ui.resets, 0);
  }
  assert.equal(calls, 0);
});

test('built contact form has a native fallback and provider calls use their listed clinics', () => {
  const $ = load(fs.readFileSync('dist/contact/index.html', 'utf8'));
  const form = $('#contact-form');
  assert.equal(form.attr('method'), 'post');
  assert.equal(form.attr('action'), 'https://formsubmit.co/referrals@utahcancerspecialists.com');
  assert.equal(form.attr('data-ajax-endpoint'), form.attr('action').replace('formsubmit.co/', 'formsubmit.co/ajax/'));
  for (const name of ['first_name', 'last_name', 'email', 'subject', 'message']) assert.equal(form.find(`[name="${name}"][required]`).length, 1);
  assert.equal($('script[src$="/scripts/contact-form.js"]').length, 1);
  assert.ok($('a[href="tel:8012629494"]').length);
  const providers = JSON.parse(fs.readFileSync('src/data/providers.json', 'utf8'));
  const clinics = JSON.parse(fs.readFileSync('src/data/provider-locations.json', 'utf8'));
  for (const { slug, sections, locationIds } of providers) {
    const p = load(fs.readFileSync(`dist/providers/${slug}/index.html`, 'utf8'));
    const phones = [...new Set(locationIds.flatMap(id => clinics[id].actions.filter(a => a.attrs.href.startsWith('tel:')).map(a => a.attrs.href)))];
    const hero = p('.provider-hero-actions');
    assert.equal(hero.find('.provider-call-menu').length, phones.length > 1 ? 1 : 0, slug);
    assert.equal(hero.find('.provider-call-caret').length, phones.length > 1 ? 1 : 0, slug);
    assert.deepEqual(hero.find('.provider-call-options a, a.provider-call').toArray().map(a => p(a).attr('href')), phones, slug);
    if (sections.length) {
      const schedule = p('.provider-sidebar .sidebar-card--dark');
      assert.equal(schedule.length, phones.length ? 1 : 0, slug);
      assert.deepEqual(schedule.find('.provider-call-options a, a.provider-call').toArray().map(a => p(a).attr('href')), phones, slug);
      assert.equal(p('.provider-sidebar .sidebar-card:not(.sidebar-card--dark) a[href^="tel:"]').length, 0, slug);
      assert.equal(p('.provider-sidebar .sidebar-card:not(.sidebar-card--dark) .sidebar-contact-item').length, 0, slug);
    }
    assert.deepEqual(p('.provider-locations .location-card a[href^="tel:"]').toArray().map(a => p(a).attr('href')), locationIds.flatMap(id => clinics[id].actions.filter(a => a.attrs.href.startsWith('tel:')).map(a => a.attrs.href)), slug);
  }
  const arango = load(fs.readFileSync('dist/providers/belisario-arango/index.html', 'utf8'));
  assert.deepEqual(arango('.provider-hero-actions .provider-call-options a').toArray().map(a => arango(a).attr('href')), ['tel:8012966665', 'tel:3854232855']);
  const clarke = load(fs.readFileSync('dist/providers/james-clarke/index.html', 'utf8'));
  assert.equal(clarke('.provider-hero-actions a.provider-call').attr('href'), 'tel:8018520210');
});
