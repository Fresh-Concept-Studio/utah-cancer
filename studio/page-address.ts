export function pageAddress(doc: any): string | undefined {
  if (!doc) return undefined
  const slug=typeof doc.slug === 'string' ? doc.slug : doc.slug?.current
  if (doc._type === 'page') {
    if (doc.settings?.redirect) return undefined
    if (!doc.path) return undefined
    return '/' + doc.path.replace(/^index\.html$/, '').replace(/index\.html$/, '').replace(/\.html$/, '/')
  }
  const folders: Record<string,string>={provider:'providers', location:'locations', specialty:'specialties', leader:'leadership'}
  if (folders[doc._type] && slug) return `/${folders[doc._type]}/${slug}/`
  if (['newsArticle','policy','resourcePage'].includes(doc._type) && slug) return `/${slug}/`
}
