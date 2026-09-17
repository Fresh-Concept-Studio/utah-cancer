import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { parse } from 'acorn';
import { base, files } from './helpers.mjs';
const readData = name => JSON.parse(fs.readFileSync(`src/data/${name}.json`, 'utf8'));
const htmlFiles = files('dist').filter(p => p.endsWith('.html'));
const pages = new Map(htmlFiles.map(file => [file, load(fs.readFileSync(`dist/${file}`, 'utf8'))]));

test('every content record has a detail page, and every directory card points to one', () => {
  for (const [name, folder] of [['providers','providers'],['leaders','leadership'],['specialties','specialties'],['locations','locations']]) {
    const records = readData(name);
    assert.equal(new Set(records.map(p => p.slug)).size, records.length, `${name}: duplicate slug`);
    for (const record of records) assert.ok(pages.has(`${folder}/${record.slug}.html`), `${folder}/${record.slug}`);
  }
  for (const [file, selector, family] of [['providers/index.html','.provider-card','providers'],['specialties/index.html','.spec-card','specialties']]) {
    const $ = pages.get(file);
    assert.equal($(selector).length, readData(family).length);
    for (const element of $(selector).toArray()) assert.ok(pages.has($(element).attr('href').slice(base.length+1)));
  }
  const clinics = readData('provider-locations');
  for (const provider of readData('providers')) for (const id of provider.locationIds) assert.ok(clinics[id], `${provider.slug}: unknown clinic ${id}`);
});

test('all internal page links and local HTML/CSS assets resolve under the GitHub Pages base', () => {
  const failures = [];
  function check(value, from) {
    if (!value || value.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return;
    if (value.startsWith('/') && !value.startsWith(base+'/')) failures.push(`${from}: outside base ${value}`);
    const resolved = new URL(value, `https://site.test${base}/${from}`);
    let target = decodeURIComponent(resolved.pathname).slice(base.length+1);
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!fs.existsSync(path.join('dist',target))) failures.push(`${from}: missing ${value}`);
  }
  for (const [file, $] of pages) {
    $('[href],[src],[poster]').each((_, e) => {
      for (const attr of ['href','src','poster']) check($(e).attr(attr), file);
    });
    $('[style]').each((_,e) => {
      for (const match of $(e).attr('style').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) check(match[1],file);
    });
  }
  for (const file of files('dist').filter(p=>p.endsWith('.css'))) {
    for (const match of fs.readFileSync('dist/'+file,'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) check(match[1],file);
  }
  assert.deepEqual(failures, []);
});

test('normal pages share one header/footer and load each valid script once', () => {
  for (const [file,$] of pages) {
    if ($('meta[http-equiv="refresh"]').length) continue;
    assert.equal($('.navbar').length,1,file);
    assert.equal($('footer').length,1,file);
    const scripts=$('script[src]').toArray().map(e=>$(e).attr('src'));
    assert.equal(new Set(scripts).size,scripts.length,`${file}: duplicate script`);
    assert.ok(scripts.includes(base+'/scripts/site.js'),file);
  }
  for (const file of files('public/scripts').filter(p=>p.endsWith('.js'))) {
    assert.doesNotThrow(()=>parse(fs.readFileSync('public/scripts/'+file,'utf8'),{ecmaVersion:'latest'}),file);
  }
});

test('retired clinic URLs preserve their redirect, fallback link, and canonical destination', () => {
  for (const slug of ['idaho-falls','madison','teton','wyoming']) {
    const $=pages.get(`locations/${slug}.html`);
    assert.equal($('meta[http-equiv="refresh"]').attr('content'),`0; url=${base}/locations/index.html`);
    assert.equal($('body a').attr('href'),`${base}/locations/index.html`);
    assert.equal($('link[rel="canonical"]').attr('href'),`https://fresh-concept-studio.github.io${base}/locations/index.html`);
  }
});

test('internal section links point to existing anchors', () => {
  const origin = 'https://fresh-concept-studio.github.io';
  const failures = [];
  for (const [file, $] of pages) for (const a of $('a[href]').toArray()) {
    const href = $(a).attr('href');
    if (href === '#') continue; // Registration and other undecided destinations remain in the audit.
    const target = new URL(href, `${origin}${base}/${file}`);
    if (target.origin !== origin || !target.hash) continue;
    let pathname = target.pathname.slice(base.length + 1);
    if (!pathname || pathname.endsWith('/')) pathname += 'index.html';
    const doc = pages.get(pathname);
    const id = decodeURIComponent(target.hash.slice(1));
    if (!doc || !doc('[id],[name]').toArray().some(e => e.attribs.id === id || e.attribs.name === id)) failures.push(`${file}: ${href}`);
  }
  assert.deepEqual(failures, []);
});

test('clinic appointment links call that clinic and event shares use the published page', () => {
  for (const [file, $] of pages) {
    if (file.startsWith('locations/') && $('.loc-hero-actions').length) {
      const phone = $('.loc-hero-actions a[href^="tel:"]').attr('href');
      const appointment = $('a').filter((_, e) => $(e).text().trim() === 'Request Appointment');
      assert.equal(appointment.attr('href'), phone, file);
      const directions = $('.loc-hero-actions a').filter((_, e) => $(e).text().includes('Get Directions'));
      const dest = new URL(directions.attr('href'));
      assert.equal(dest.pathname, '/maps/dir/', file);
      assert.equal(dest.searchParams.get('api'), '1', file);
      assert.match(dest.searchParams.get('destination'), /\d.+(?:UT|Utah)/, file);
    }
    if ($('.event-share').length) {
      const canonical = `https://fresh-concept-studio.github.io${base}/${file}`;
      for (const a of $('.event-share a').toArray()) {
        const target = new URL($(a).attr('href'));
        const key = target.protocol === 'mailto:' ? 'body' : target.hostname.includes('facebook') ? 'u' : 'url';
        assert.equal(target.searchParams.get(key), canonical, `${file}: ${$(a).attr('aria-label')}`);
      }
    }
  }
});
