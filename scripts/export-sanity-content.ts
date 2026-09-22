import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {newsPosts} from '../src/data/news'
import {resourcePages} from '../src/data/resources'

const root = resolve(import.meta.dirname, '..')
const readJson = (name: string) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'))
const providers = readJson('providers.json')
const locations = readJson('locations.json')
const specialties = readJson('specialties.json')
const leaders = readJson('leaders.json')
const policies = readJson('policies.json')
const pages = readJson('pages.json')
const sharedContent = readJson('shared-content.json')
const providerLocations = readJson('provider-locations.json')

const safeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '')
const keyFor = (value: unknown, index: number) => {
  const text = typeof value === 'object' && value ? JSON.stringify(value) : String(value)
  let hash = 2166136261
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return `k${index}-${(hash >>> 0).toString(36)}`
}

function normalize(value: any): any {
  if (Array.isArray(value)) return value.map((item, index) =>
    item && typeof item === 'object' ? {...normalize(item), _key: item._key || keyFor(item, index)} : item,
  )
  if (!value || typeof value !== 'object') return value
  if (value.attrs && typeof value.attrs === 'object') {
    const {attrs, ...rest} = value
    return normalize({...rest, ...attrs, _type: 'contentLink'})
  }
  const normalized = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)]))
  if (!normalized._type && typeof normalized.src === 'string' && typeof normalized.alt === 'string') normalized._type = 'legacyImage'
  if (!normalized._type && typeof normalized.title === 'string' && typeof normalized.html === 'string') normalized._type = 'contentSection'
  if (!normalized._type && typeof normalized.href === 'string' && typeof normalized.label === 'string') normalized._type = normalized.href.startsWith('#') ? 'tab' : 'object'
  if (!normalized._type && typeof normalized.heading === 'string' && Array.isArray(normalized.links)) normalized._type = 'callToAction'
  if (!normalized._type && (Array.isArray(normalized.styles) || typeof normalized.component === 'string')) normalized._type = 'pageSettings'
  return normalized
}

const slug = (value: string) => ({_type: 'slug', current: value})
const docs: any[] = []
const addRecords = (type: string, records: any[]) => {
  for (const record of records) docs.push(normalize({...record, _id: `${type}-${safeId(record.slug)}`, _type: type, slug: slug(record.slug)}))
}

addRecords('provider', providers)
addRecords('location', locations)
addRecords('specialty', specialties)
addRecords('leader', leaders)
addRecords('policy', policies.map((item: any) => ({...item, seoTitle: item.title})))
addRecords('newsArticle', newsPosts.map(({contentHtml, ...item}) => ({...item, html: contentHtml})))
addRecords('resourcePage', resourcePages)

for (const [path, value] of Object.entries<any>(pages)) {
  const {title, description, ...settings} = value
  docs.push(normalize({_id: `page-${safeId(path)}`, _type: 'page', path, title, description, settings}))
}
for (const [key, html] of Object.entries(sharedContent)) {
  docs.push({_id: `sharedContent-${safeId(key)}`, _type: 'sharedContent', key, title: key.replaceAll('-', ' '), html})
}
for (const [key, value] of Object.entries<any>(providerLocations)) {
  docs.push(normalize({_id: `providerLocation-${safeId(key)}`, _type: 'providerLocation', key, ...value}))
}
docs.push({_id: 'siteSettings', _type: 'siteSettings', siteName: 'Utah Cancer Specialists', mainPhoneDisplay: '801.262.9494', mainPhoneHref: 'tel:8012629494', cmsVerification: 'Initial Sanity migration'})

const output = resolve(root, '.sanity/initial-content.ndjson')
mkdirSync(dirname(output), {recursive: true})
writeFileSync(output, `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`)
console.log(`Exported ${docs.length} documents to ${output}`)
