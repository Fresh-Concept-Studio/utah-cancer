/** Convert legacy source filenames to the site's clean public URL structure. */
export function publicPath(path: string = ''): string {
  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '';
  const suffix = match?.[2] || '';
  if (pathname === '/index.html' || pathname === 'index.html') return `/${suffix}`;
  if (pathname.endsWith('/index.html')) return `${pathname.slice(0, -'index.html'.length)}${suffix}`;
  if (pathname.endsWith('.html')) return `${pathname.slice(0, -'.html'.length)}/${suffix}`;
  return path;
}

/** Content paths are relative to the site root, never to the current page. */
export function url(path: string = ''): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  path = publicPath(path);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Only use for trusted, checked-in rich text in src/data. No remote/user HTML. */
export function richHtml(html: string = ''): string {
  return html
    .replace(/\b(href|src|poster|action)=(['"])(\/(?!\/)[^'"]*)\2/g,
      (_, attr, quote, path) => `${attr}=${quote}${url(path)}${quote}`)
    .replace(/url\((['"]?)(\/(?!\/)[^)'"\s]+)\1\)/g,
      (_, _quote, path) => `url('${url(path)}')`);
}
