import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { parse } from 'acorn';
import { createHash } from 'node:crypto';
import { base, files, site } from './helpers.mjs';
const readData = name => JSON.parse(fs.readFileSync(`src/data/${name}.json`, 'utf8'));
const htmlFiles = files('dist').filter(p => p.endsWith('.html'));
const pages = new Map(htmlFiles.map(file => [file, load(fs.readFileSync(`dist/${file}`, 'utf8'))]));

test('every content record has a detail page, and every directory card points to one', () => {
  for (const [name, folder] of [['providers','providers'],['leaders','leadership'],['specialties','specialties'],['locations','locations']]) {
    const records = readData(name);
    assert.equal(new Set(records.map(p => p.slug)).size, records.length, `${name}: duplicate slug`);
    for (const record of records) assert.ok(pages.has(`${folder}/${record.slug}/index.html`), `${folder}/${record.slug}`);
  }
  for (const [file, selector, family] of [['providers/index.html','.provider-card','providers'],['specialties/index.html','.spec-card','specialties']]) {
    const $ = pages.get(file);
    assert.equal($(selector).length, readData(family).length);
    for (const element of $(selector).toArray()) {
      const pathname = new URL($(element).attr('href'), 'https://site.test').pathname.slice(base.length + 1);
      assert.ok(pages.has(`${pathname}index.html`));
    }
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
    if ($('meta[http-equiv="refresh"]').length || file.startsWith('signature/')) continue;
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

test('publishable pages have unique search and social metadata', () => {
  const publishable = [...pages].filter(([file, $]) => !file.startsWith('signature/') && !$('meta[http-equiv="refresh"]').length);
  const titles = new Map();
  const descriptions = new Map();
  for (const [file, $] of publishable) {
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content')?.trim() || '';
    const canonical = $('link[rel="canonical"]').attr('href');
    assert.ok(title.length >= 30 && title.length <= 70, `${file}: title length ${title.length}`);
    assert.ok(description.length >= 70 && description.length <= 180, `${file}: description length ${description.length}`);
    assert.equal(titles.has(title), false, `${file}: duplicate title with ${titles.get(title)}`);
    assert.equal(descriptions.has(description), false, `${file}: duplicate description with ${descriptions.get(description)}`);
    titles.set(title, file);
    descriptions.set(description, file);
    assert.ok(canonical?.startsWith(`${site}${base}/`) || canonical === `${site}${base}/`, `${file}: canonical ${canonical}`);
    assert.equal($('meta[property="og:title"]').attr('content'), title, `${file}: og:title`);
    assert.equal($('meta[property="og:description"]').attr('content'), description, `${file}: og:description`);
    assert.equal($('meta[property="og:url"]').attr('content'), canonical, `${file}: og:url`);
    assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image', `${file}: Twitter card`);
    assert.doesNotThrow(() => JSON.parse($('script[type="application/ld+json"]').text()), `${file}: JSON-LD`);
    assert.equal($('meta[name="robots"]').length, process.env.SITE_INDEXABLE === 'true' ? 0 : 1, `${file}: indexability`);
  }
});

test('Cloudflare legacy redirects have unique sources and valid local targets', () => {
  const rows = fs.readFileSync('docs/cloudflare-redirects.csv', 'utf8').trim().split('\n');
  const sources = new Set();
  assert.ok(rows.length >= 300, `expected both slash variants for the redirect inventory, found ${rows.length}`);
  for (const row of rows) {
    const [source, target, status, preserveQuery, includeSubdomains, subpathMatching, preserveSuffix] = row.split(',');
    assert.equal(sources.has(source), false, `duplicate redirect source: ${source}`);
    sources.add(source);
    assert.equal(status, '301', `${source}: expected permanent redirect`);
    assert.equal(preserveQuery, 'TRUE', `${source}: query strings should be preserved`);
    assert.equal(includeSubdomains, 'TRUE');
    assert.equal(subpathMatching, 'FALSE');
    assert.equal(preserveSuffix, 'FALSE');
    const parsed = new URL(target);
    assert.equal(parsed.origin, 'https://utahcancer.com', `${source}: unexpected target host`);
    const output = parsed.pathname.endsWith('/')
      ? `${parsed.pathname.slice(1)}index.html`
      : parsed.pathname.slice(1);
    assert.equal(fs.existsSync(path.join('dist', output)), true, `${source}: missing target ${parsed.pathname}`);
    if (parsed.hash) {
      const $ = load(fs.readFileSync(path.join('dist', output), 'utf8'));
      assert.equal($(parsed.hash).length, 1, `${source}: missing target fragment ${parsed.hash}`);
    }
  }
});

test('policy pages preserve the checked-in source wording and public paths', () => {
  const policies = readData('policies');
  const normalize = value => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  for (const policy of policies) {
    const file = `${policy.slug}/index.html`;
    assert.equal(pages.has(file), true, `${file}: missing policy page`);
    const $ = pages.get(file);
    assert.equal($('h1').text().trim(), policy.heading);
    assert.equal($('.policy-content').length, 1);
    const hash = createHash('sha256').update(normalize($('.policy-content').text())).digest('hex');
    assert.equal(hash, policy.sourceTextHash, `${file}: policy wording changed`);
    assert.equal($(`link[rel="canonical"]`).attr('href'), `${site}${base}/${policy.slug}/`);
  }
  for (const href of ['/nosurprisesact/', '/termsandconditions/', '/privacy-policy/', '/patient-privacy/', '/discalaimer/']) {
    assert.equal(pages.get('index.html')(`.footer-legal a[href="${base}${href}"]`).length, 1, `missing footer link ${href}`);
  }
});

test('legacy news posts remain available at their original public URLs', () => {
  const expected = [
    ['dr-william-stephensons-new-works-at-reflections-concert/index.html', '2025-09-23'],
    ['attended-recent-event-to-support-cancer-patients-in-the-community/index.html', '2019-07-01'],
    ['utah-caner-specialists-patient-making-cancer-treatment-look-like-a-piece-of-cake/index.html', '2019-04-25'],
  ];
  assert.equal(pages.has('articles/index.html'), true, 'missing News index');
  const newsIndex = pages.get('articles/index.html');
  for (const [file, publishedDate] of expected) {
    assert.equal(pages.has(file), true, `${file}: missing migrated news article`);
    const $ = pages.get(file);
    assert.equal($('article.news-article').length, 1, `${file}: missing article content`);
    assert.equal($('meta[property="og:type"]').attr('content'), 'article', `${file}: Open Graph type`);
    assert.equal($('meta[property="article:published_time"]').attr('content'), publishedDate, `${file}: published date`);
    assert.equal($('script[type="application/ld+json"]').text().includes('NewsArticle'), true, `${file}: NewsArticle schema`);
    const href = `${base}/${file.replace(/index\.html$/, '')}`;
    assert.equal(newsIndex(`a[href="${href}"]`).length > 0, true, `${file}: not linked from News index`);
  }
});

test('legacy patient resources remain available without crowding global navigation', () => {
  const slugs = [
    'visitorandguestinfo', 'housing', 'nutrition', 'personalsafety', 'cleaning', 'transportation',
    'dignicap', 'medically-integrated-pharmacy', 'supportivecare', 'breathwork-class',
    'low-dose-radiation-therapy-ldrt',
  ];
  assert.equal(pages.has('supportive-resources/index.html'), true, 'missing practical-support hub');
  for (const slug of slugs) {
    const file = `${slug}/index.html`;
    assert.equal(pages.has(file), true, `${file}: missing recreated resource`);
    const $ = pages.get(file);
    assert.equal($('h1').length, 1, `${file}: expected one page heading`);
    assert.equal($(`.navbar a[href="${base}/${slug}/"], footer a[href="${base}/${slug}/"]`).length, 0, `${file}: resource should not be in global navigation`);
  }
  const inventory = fs.readFileSync('docs/legacy-url-inventory.csv', 'utf8');
  assert.doesNotMatch(inventory, /,review,/, 'legacy inventory still contains unresolved reviews');
});

test('retired WordPress and former-location URLs are omitted from generated pages', () => {
  for (const file of ['locations/idaho-falls/index.html', 'locations/madison/index.html', 'locations/teton/index.html', 'locations/wyoming/index.html']) {
    assert.equal(pages.has(file), false, `${file}: retired fallback should not be generated`);
  }
  const inventory = fs.readFileSync('docs/legacy-url-inventory.csv', 'utf8');
  for (const path of ['/author/administrator/', '/tag/abc4/', '/test/', '/test-page/', '/ucs-tooele/', '/idahofalls/', '/covid-19/', '/covid-19-vaccine/']) {
    assert.match(inventory, new RegExp(`https://utahcancer\\.com${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},retire,`), `${path}: not marked retired`);
  }
});

test('sitemap and robots directives match the deployment target', () => {
  const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const publishableCount = [...pages].filter(([file, $]) => !file.startsWith('signature/') && !$('meta[http-equiv="refresh"]').length).length;
  assert.equal(locations.length, publishableCount);
  assert.equal(new Set(locations).size, locations.length);
  for (const location of locations) assert.ok(location.startsWith(`${site}${base}/`) || location === `${site}${base}/`, location);
  const robots = fs.readFileSync('dist/robots.txt', 'utf8');
  if (process.env.SITE_INDEXABLE === 'true') {
    assert.match(robots, /Allow: \/\n/);
    assert.match(robots, new RegExp(`Sitemap: ${site.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  } else {
    assert.match(robots, new RegExp(`Disallow: ${base || '/'}(?:/|$)`));
  }
});

test('email signature assets retain the filenames distributed to staff', () => {
  const signatureFiles = [
    'UCS-logo-black.svg',
    'UCS-logo-color.svg',
    'UCS-logo-white.svg',
    'img-89b9f6bd-eba3-4cdd-97ea-29f5582fbec5.jpg',
  ];
  const directory = pages.get('signature/index.html');
  assert.ok(directory, 'signature directory index');
  for (const filename of signatureFiles) {
    assert.ok(fs.existsSync(path.join('dist/signature', filename)), filename);
    assert.equal(directory(`[href="${filename}"]`).length, 1, `${filename}: directory link`);
  }
});

test('internal section links point to existing anchors', () => {
  const origin = site;
  const failures = [];
  for (const [file, $] of pages) for (const a of $('a[href]').toArray()) {
    const href = $(a).attr('href');
    assert.notEqual(href, '#', `${file}: placeholder link`);
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

test('resolved event, foundation, and Provo actions use confirmed destinations', () => {
  const events = pages.get('events/index.html');
  assert.equal(events('#pink-bag-event').attr('href'), 'https://www.fashionplace.com/en/events/50851/');
  assert.equal(events('#making-strides').attr('href'), 'https://makingstrideswalk.org/saltlakecityut');
  assert.equal(events('#pinksync').attr('href'), 'https://www.pinksync.org/registration-pages/register');
  assert.equal(events('.events-newsletter-form').length, 0);

  for (const file of [
    'events/caregiver-workshop.html',
    'events/holiday-gift-drive.html',
    'events/nutrition-during-treatment.html',
    'events/patient-appreciation-dinner.html',
    'events/survivorship-support-group.html',
    'events/understanding-treatment-options.html',
    'events/walk-for-hope.html',
    'events/young-adult-meetup.html',
  ]) {
    assert.equal(pages.has(file), false, file);
  }

  const resources = pages.get('patient-resources/index.html');
  assert.equal(resources('a[href*="healthpay24"]').length, 0);
  const foundation = resources('button[data-coming-soon]').filter((_, element) => resources(element).text().includes('Utah Cancer Foundation'));
  assert.equal(foundation.length, 1);

  for (const [file, $] of pages) assert.equal($('a[href*="healthpay24"]').length, 0, file);

  for (const slug of ['nathan-rich', 'staci-gunter', 'stephanie-ellis', 'william-stephenson']) {
    const $ = pages.get(`providers/${slug}/index.html`);
    const card = $('.location-card').filter((_, element) => $(element).text().includes('Provo Clinic'));
    assert.equal(card.length, 1, slug);
    assert.match(card.text(), /395 W\. Cougar Blvd\./, slug);
    assert.match(card.find('a').filter((_, element) => $(element).text().includes('Get Directions')).attr('href'), /^https:\/\/www\.google\.com\/maps\/dir\//, slug);
  }

  const locations = pages.get('locations/index.html');
  const provoCard = locations('.loc-card').filter((_, element) => locations(element).text().includes('Provo Clinic'));
  assert.equal(provoCard.length, 1);
  assert.equal(provoCard.attr('href'), `${base}/locations/provo/`);
  const provo = pages.get('locations/provo/index.html');
  assert.match(provo('.loc-hero-meta').text(), /395 W\. Cougar Blvd\./);
  assert.equal(provo('.loc-hero-actions a[href^="tel:"]').attr('href'), 'tel:3853752700');
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
      const canonical = `${site}${base}/${file.replace(/index\.html$/, '')}`;
      for (const a of $('.event-share a').toArray()) {
        const target = new URL($(a).attr('href'));
        const key = target.protocol === 'mailto:' ? 'body' : target.hostname.includes('facebook') ? 'u' : 'url';
        assert.equal(target.searchParams.get(key), canonical, `${file}: ${$(a).attr('aria-label')}`);
      }
    }
  }
});
