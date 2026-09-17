import type { APIRoute } from 'astro';
import { url } from '../lib/urls';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to build robots.txt.');
  const isIndexable = process.env.SITE_INDEXABLE === 'true';
  const body = isIndexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('/sitemap.xml'), site).href}\n`
    : `User-agent: *\nDisallow: ${import.meta.env.BASE_URL.replace(/\/$/, '')}/\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
