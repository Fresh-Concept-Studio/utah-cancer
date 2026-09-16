import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';

export const baselineCommit = 'e910dc774aa8a575a3d3bd55e7eeb96ef96936e9';
export const base = '/utah-cancer';
export const hash = value => createHash('sha256').update(value).digest('hex');
export const files = directory => fs.readdirSync(directory, { recursive: true }).filter(file => fs.statSync(path.join(directory, file)).isFile()).sort();
export function canonical(value, file, built = true) {
  if (!value) return value;
  if (built) value = value.replace(/^\/utah-cancer(?=\/)/, '');
  return new URL(value, 'https://site.test/' + file).href;
}

// Ignore formatting whitespace and shared chrome; compare the page itself.
// The newsletter's inline handler moved to events-index.js without changing behavior.
export function fingerprints(html, file, built = true) {
  const $ = load(html);
  const metadata = [$('title').text(), $('meta[name="description"]').attr('content') || '', $('body').attr('class') || ''];
  $('script,style,.navbar,footer,.mobile-menu-overlay,.marquee-banner').remove();
  const text = $('body').text().replace(/\s/g, '');
  const structure = $('body *').toArray().map(element => [element.tagName,
    Object.fromEntries(Object.entries(element.attribs)
      .filter(([name]) => !['href', 'src', 'onsubmit'].includes(name))
      .sort().map(([name, value]) => [name, value.trim().replace(/\s+/g, ' ')]))]);
  const destinations = ['a', 'img', 'iframe'].map(selector => $(selector).toArray().map(element =>
    canonical($(element).attr(selector === 'a' ? 'href' : 'src'), file, built)));
  return { metadata: hash(JSON.stringify(metadata)), text: hash(text), structure: hash(JSON.stringify(structure)), destinations: hash(JSON.stringify(destinations)) };
}
