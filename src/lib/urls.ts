/** Content paths are relative to the site root, never to the current page. */
export function url(path: string = ''): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
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
