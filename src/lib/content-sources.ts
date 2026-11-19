import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {createClient} from '@sanity/client'
import {convert} from './cms-records'

/**
 * Site content is stored as JSON files under `content/` (the source of truth since
 * Phase 0). Sanity keeps a read-only copy of the content as it was at migration and
 * can still be selected with CONTENT_SOURCE=sanity. Both sources produce the same
 * `ContentRecords`, which `content.ts` turns into the values templates use.
 */
export const sanityConfig = {
  projectId: 'spba0u9p',
  dataset: 'production',
  apiVersion: '2026-09-21',
}

type AnyRecord = Record<string, any>

/** Content records grouped by type, in the shape `convert()` produces from Sanity. */
export interface ContentRecords {
  clinicalTrial: AnyRecord[]
  podcastEpisode: AnyRecord[]
  provider: AnyRecord[]
  location: AnyRecord[]
  specialty: AnyRecord[]
  leader: AnyRecord[]
  policy: AnyRecord[]
  newsArticle: AnyRecord[]
  resourcePage: AnyRecord[]
  page: AnyRecord[]
  sharedContent: AnyRecord[]
  providerLocation: AnyRecord[]
  siteSettings: AnyRecord[]
}

export type RecordType = keyof ContentRecords

/** Folder under `content/` for each collection, and the field that names each file. */
export const collections: Record<Exclude<RecordType, 'siteSettings'>, {dir: string; id: (record: AnyRecord) => string}> = {
  clinicalTrial: {dir: 'clinical-trials', id: (r) => r.nctId || r.title},
  podcastEpisode: {dir: 'podcast-episodes', id: (r) => (r.episodeNumber ? `episode-${r.episodeNumber}` : r.title)},
  provider: {dir: 'providers', id: (r) => r.slug},
  location: {dir: 'locations', id: (r) => r.slug},
  specialty: {dir: 'specialties', id: (r) => r.slug},
  leader: {dir: 'leaders', id: (r) => r.slug},
  policy: {dir: 'policies', id: (r) => r.slug},
  newsArticle: {dir: 'news', id: (r) => r.slug},
  resourcePage: {dir: 'resources', id: (r) => r.slug},
  page: {dir: 'pages', id: (r) => pageFileName(r.path)},
  sharedContent: {dir: 'shared-content', id: (r) => r.key},
  providerLocation: {dir: 'provider-locations', id: (r) => r.key},
}

/** Lists that editors manage record by record are stored apart from their page. */
export const pageLists = {
  jobs: {dir: 'jobs', page: 'careers.html', id: (r: AnyRecord) => [r.title, r.location].filter(Boolean).join(' ')},
  events: {dir: 'events', page: 'events/index.html', id: (r: AnyRecord) => [r.date || r.startDate, r.title].filter(Boolean).join(' ')},
} as const

export const settingsFile = 'settings.json'

export function fileSlug(value: unknown): string {
  return String(value ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'untitled'
}

export function pageFileName(path: string): string {
  const name = path.replace(/\.html$/, '').replace(/(^|\/)index$/, '')
  return name ? fileSlug(name) : 'home'
}

const query = `*[_type in ["clinicalTrial", "podcastEpisode", "provider", "location", "specialty", "leader", "policy", "newsArticle", "resourcePage", "page", "sharedContent", "providerLocation", "siteSettings"]]{
  ...,
  "pdfAssetUrl": pdf.asset->url,
  "insurancePlansPdfUrl": insurancePlansPdf.asset->url,
  photo{..., "asset": asset{..., "asset": asset->{url}}},
  "image": select(image._type == "legacyImage" => image{..., "asset": asset{..., "asset": asset->{url}}}, image),
  directoryPhoto{..., "asset": asset{..., "asset": asset->{url}}},
  editorImages[]{..., image{..., "asset": asset{..., "asset": asset->{url}}}},
  featuredPhoto{..., "asset": asset{..., "asset": asset->{url}}},
  heroPhoto{..., "asset": asset{..., "asset": asset->{url}}},
  leadershipGroups[]{..., cards[]{..., "profile": profile->{"type": _type,slug}, photo{..., "asset": asset{..., "asset": asset->{url}}}}},
  mediaHighlights[]{..., photo{..., "asset": asset{..., "asset": asset->{url}}}},
  events[]{..., image{..., "asset": asset{..., "asset": asset->{url}}}, photos[]{..., "asset": asset->{url}}}
}`

const emptyRecords = (): ContentRecords => ({
  clinicalTrial: [], podcastEpisode: [], provider: [], location: [], specialty: [], leader: [], policy: [],
  newsArticle: [], resourcePage: [], page: [], sharedContent: [], providerLocation: [], siteSettings: [],
})

/** Published Sanity documents, read-only. Never writes to Sanity. */
export async function fetchSanityRecords(): Promise<ContentRecords> {
  const client = createClient({...sanityConfig, useCdn: false, perspective: 'published'})
  const docs = await client.fetch<AnyRecord[]>(query)
  if (!docs.length) throw new Error('Sanity returned no published content')
  const records = emptyRecords()
  for (const doc of docs) records[doc._type as RecordType]?.push(convert(doc))
  return records
}

const readJson = (file: string) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    throw new Error(`Could not read content file ${file}: ${(error as Error).message}`)
  }
}

/**
 * Read one collection folder, ordered by `order` and then by file name. Each record gets a
 * `contentId` ("jobs/patient-advocate-cancer-center") naming its file; templates render it
 * as `data-sa` so the site editor can map a clicked element back to the file to change.
 */
function readCollection(root: string, dir: string): AnyRecord[] {
  if (!existsSync(join(root, dir))) return []
  return readdirSync(join(root, dir))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => ({...readJson(join(root, dir, name)), contentId: `${dir}/${name.replace(/\.json$/, '')}`}))
    .map((record, index) => ({record, index}))
    .sort((a, b) => (a.record.order ?? Infinity) - (b.record.order ?? Infinity) || a.index - b.index)
    .map(({record}) => {
      const {order, ...rest} = record
      return rest
    })
}

/** Content stored in the repository under `content/`. */
export function readRepoRecords(root = resolve(process.cwd(), 'content')): ContentRecords {
  if (!existsSync(root)) throw new Error(`No content folder at ${root}. Run the Sanity export or set CONTENT_SOURCE=sanity.`)
  const records = emptyRecords()
  for (const [type, {dir}] of Object.entries(collections)) records[type as RecordType] = readCollection(root, dir)
  records.siteSettings = existsSync(join(root, settingsFile)) ? [readJson(join(root, settingsFile))] : []
  for (const [field, list] of Object.entries(pageLists)) {
    const page = records.page.find((record) => record.path === list.page)
    if (page && existsSync(join(root, list.dir))) page[field] = readCollection(root, list.dir)
  }
  return records
}
