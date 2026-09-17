import type { APIRoute } from 'astro';
import pages from '../lib/pages';
import { publicPath, url } from '../lib/urls';

export const prerender = true;

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to build the sitemap.');
  const entries = Object.entries(pages)
    .filter(([, page]) => !page.redirect)
    .map(([path]) => `  <url><loc>${escapeXml(new URL(url(publicPath(`/${path}`)), site).href)}</loc></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
