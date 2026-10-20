import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { parse } from 'acorn';
import { base, files, site } from './helpers.mjs';
const htmlFiles = files('dist').filter(p => p.endsWith('.html'));
const pages = new Map(htmlFiles.map(file => [file, load(fs.readFileSync(`dist/${file}`, 'utf8'))]));
const isErrorFile = file => file === '404.html' || file.startsWith('errors/');

test('every directory card points to a built detail page', () => {
  for (const [file, selector] of [['providers/index.html','.provider-card'],['specialties/index.html','.spec-card'],['locations/index.html','.loc-card']]) {
    const $ = pages.get(file);
    assert.ok($(selector).length > 0, file);
    for (const element of $(selector).toArray()) {
      const pathname = new URL($(element).attr('href'), 'https://site.test').pathname.slice(base.length + 1);
      assert.ok(pages.has(`${pathname}index.html`), `${file}: ${pathname}`);
    }
  }
});

test('clinical trial count and filters match the rendered studies', () => {
  const $ = pages.get('late-phase-trials/index.html');
  const cards = $('.lp-trial-card');
  assert.equal($('#trial-count').text().trim(), `${cards.length} ${cards.length === 1 ? 'trial' : 'trials'}`);
  const filters = $('.lp-filter[data-filter]').toArray().map(button => $(button).attr('data-filter')).filter(value => value !== 'all');
  const sections = $('.lp-trial-section').toArray();
  assert.deepEqual(filters, sections.map(section => $(section).attr('data-category')));
  for (const section of sections) assert.ok($(section).find('.lp-trial-card').length > 0, $(section).attr('data-category'));
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
  const publishable = [...pages].filter(([file, $]) => !file.startsWith('signature/') && !isErrorFile(file) && !$('meta[http-equiv="refresh"]').length);
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
  const sourcePaths = new Set(rows.map(row => new URL(`https://${row.split(',')[0]}`).pathname));
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
    assert.equal(sourcePaths.has(parsed.pathname), false, `${source}: target is also a redirect source (loop or chain): ${target}`);
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

test('policy pages render at their public paths and are linked from the footer', () => {
  for (const href of ['/nosurprisesact/', '/termsandconditions/', '/privacy-policy/', '/patient-privacy/', '/discalaimer/']) {
    const file = `${href.slice(1)}index.html`;
    assert.equal(pages.has(file), true, `${file}: missing policy page`);
    const $ = pages.get(file);
    assert.ok($('h1').text().trim(), `${file}: missing heading`);
    assert.equal($('.policy-content').length, 1, file);
    assert.equal($(`link[rel="canonical"]`).attr('href'), `${site}${base}${href}`);
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

test('employment application is restored at its legacy URL', () => {
  const $ = pages.get('job-application/index.html');
  assert.ok($, 'missing employment application');
  assert.equal($('form[enctype="multipart/form-data"]').length, 1);
  assert.equal($('[name="job_applying_for"][required]').length, 1);
  assert.equal($('[name="attachment"][type="file"][required]').length, 1);
  assert.equal(pages.get('careers/index.html')('a[href*="/job-application/"]').length > 0, true);
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
  const publishableCount = [...pages].filter(([file, $]) => !file.startsWith('signature/') && !isErrorFile(file) && !$('meta[http-equiv="refresh"]').length).length;
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

test('themed error documents are generated and kept out of search indexes', () => {
  const expected = ['404.html', 'errors/400/index.html', 'errors/403/index.html', 'errors/408/index.html', 'errors/429/index.html', 'errors/500/index.html', 'errors/502/index.html', 'errors/503/index.html', 'errors/504/index.html'];
  for (const file of expected) {
    const $ = pages.get(file);
    assert.ok($, `${file}: missing error document`);
    assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow', `${file}: robots`);
    assert.equal($('h1').length, 1, `${file}: expected one heading`);
    assert.equal($('.error-shortcuts a').length, 3, `${file}: helpful destinations`);
    assert.equal($('.navbar').length, 1, `${file}: shared header`);
    assert.equal($('footer').length, 1, `${file}: shared footer`);
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

test('retired placeholder event pages and the events newsletter form stay removed', () => {
  assert.equal(pages.get('events/index.html')('.events-newsletter-form').length, 0);
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

test('events page keeps every editor field from the CMS page record', () => {
  const template = fs.readFileSync('src/views/events-index.astro', 'utf8');
  const used = new Set([...template.matchAll(/edit\.(?:text|image|imageAlt|number)\("([^"]+)"/g)].map(match => match[1]));
  const record = JSON.parse(fs.readFileSync('src/data/page-content.json', 'utf8'))['events-index'];
  const stored = [...record.editorContent, ...record.editorImages].map(item => item.key || item._key);
  assert.deepEqual(stored.filter(key => !used.has(key)), [], 'editor keys no longer read by the template');
  assert.deepEqual([...used].filter(key => !stored.includes(key)), [], 'template keys missing from the page record');
});

test('events page splits Upcoming and Recently Past by dated cards with working filter markup', () => {
  const $ = pages.get('events/index.html');
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const today = $('.events-list').attr('data-events-today');
  assert.match(today, isoDate, 'build date for the Upcoming/Past split');

  const filters = $('#events-filters .event-filter').toArray().map(button => $(button).attr('data-filter'));
  assert.deepEqual(filters, ['all', 'support', 'community', 'fundraiser']);
  assert.equal($('#events-filters .event-filter.active').attr('data-filter'), 'all');
  assert.equal($('#events-grid').length, 1);
  assert.equal($('#events-empty').length, 1);

  const upcoming = $('#events-grid .event-card').toArray();
  const recent = $('#past-events-recent .past-event-card--photo').toArray();
  assert.ok(upcoming.length + recent.length > 0, 'events are rendered');
  for (const card of upcoming) {
    const date = $(card).attr('data-event-date');
    assert.match(date, isoDate, `${$(card).find('.event-card-title').text()}: data-event-date`);
    assert.ok(date >= today, `${date} is past but still listed as upcoming`);
    assert.ok(filters.includes($(card).attr('data-cat')), `${date}: filter category`);
  }
  assert.equal($('#events-empty').is('[hidden]'), upcoming.length > 0, 'empty state shows only when nothing is upcoming');

  const recentDates = recent.map(card => $(card).attr('data-event-date'));
  assert.deepEqual([...recentDates].sort().reverse(), recentDates, 'Recently Past is newest first');
  for (const card of recent) {
    const date = $(card).attr('data-event-date');
    assert.match(date, isoDate);
    assert.ok($(card).find('.past-event-media img[src]').length, `${date}: photo`);
    assert.ok($(card).find('.past-event-title').text().trim(), `${date}: title`);
    assert.equal($(card).is('[hidden]'), date >= today, `${date}: shown in Recently Past only once it has passed`);
  }
  // Every upcoming card has a hidden past counterpart the browser can reveal after the build.
  const recentIds = new Set(recent.map(card => $(card).attr('data-event-id')));
  for (const card of upcoming) assert.ok(recentIds.has($(card).attr('data-event-id')), $(card).attr('data-event-id'));
  assert.equal($('#past-events-recent').is('[hidden]'), !recent.some(card => !$(card).is('[hidden]')));

  const featured = $('.featured-event');
  assert.equal(featured.length, 1);
  const featuredDate = featured.attr('data-event-date');
  if (featuredDate) {
    assert.match(featuredDate, isoDate);
    assert.equal(featured.is('[hidden]'), featuredDate < today, 'featured event hides once its date has passed');
  }
  assert.ok($('.past-events-grid:not(.past-events-grid--recent) .past-event-card').length > 0, 'older past events remain');
});
