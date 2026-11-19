import localClinicalTrials from '../data/clinical-trials.json'
import localPodcastEpisodes from '../data/podcast-episodes.json'
import type {ClinicalTrial} from './clinical-trials'
import {fetchSanityRecords, readRepoRecords, type ContentRecords} from './content-sources'
import localProviders from '../data/providers.json'
import localLocations from '../data/locations.json'
import localSpecialties from '../data/specialties.json'
import localLeaders from '../data/leaders.json'
import localPolicies from '../data/policies.json'
import localPages from '../data/pages.json'
import localDefaults from '../data/page-defaults.json'
import localSharedContent from '../data/shared-content.json'
import localProviderLocations from '../data/provider-locations.json'
import localLeadershipGroups from '../data/leadership-groups.json'
import {newsPosts as localNewsPosts} from '../data/news'
import {resourcePages as localResourcePages} from '../data/resources'
import {mediaHighlights as localMedia} from '../data/media'
import {mainPhone as localMainPhone} from '../data/contact'

export {sanityConfig} from './content-sources'

type AnyRecord = Record<string, any>
const fallback = {
  clinicalTrials: localClinicalTrials, podcastEpisodes: localPodcastEpisodes, providers: localProviders, locations: localLocations, specialties: localSpecialties, leaders: localLeaders,
  policies: localPolicies, pages: localPages, defaults: localDefaults, sharedContent: localSharedContent,
  providerLocations: localProviderLocations, leadershipGroups: localLeadershipGroups,
  newsPosts: localNewsPosts, resourcePages: localResourcePages, mainPhone: localMainPhone, mediaHighlights: localMedia,
}

/**
 * CONTENT_SOURCE selects where site content comes from:
 * - `repo` (default): JSON files under `content/`, edited by the site editor.
 * - `sanity`: the published Sanity dataset, kept as a read-only fallback.
 * - `local`: the old development snapshot in `src/data/` (also `SANITY_USE_CMS=false`).
 */
export function contentSource(): 'repo' | 'sanity' | 'local' {
  const env = {...process.env, ...import.meta.env} as Record<string, string | undefined>
  if (env.SANITY_USE_CMS === 'false') return 'local'
  const source = (env.CONTENT_SOURCE || 'repo').toLowerCase()
  if (source === 'repo' || source === 'sanity' || source === 'local') return source
  throw new Error(`Unknown CONTENT_SOURCE "${env.CONTENT_SOURCE}". Use repo, sanity, or local.`)
}

/** Turn content records into the values templates use. Same for every source. */
export function assembleContent(records: ContentRecords) {
  const withDefaults = (name: keyof ContentRecords) => records[name].map((doc) => ['provider','leader','location','specialty'].includes(name) ? {tabs: [], sections: [], actions: [], locationIds: [], ...doc} : doc)
  const keyed = (name: keyof ContentRecords, key: string, valueKey?: string) => Object.fromEntries(
    withDefaults(name).map((doc) => [doc[key], valueKey ? doc[valueKey] : Object.fromEntries(Object.entries(doc).filter(([field]) => field !== key))]),
  )
  const pages = Object.fromEntries(withDefaults('page').map(({path, title, description, seoTitle, editorContent, editorImages, jobs, events, insurancePlansPdfUrl, settings}) => [path, {title: seoTitle || title, description, editorContent, editorImages, jobs, events, insurancePlansPdfUrl, ...settings}]))
  const newsPosts = withDefaults('newsArticle').map(({html, featuredPhoto, ...post}) => ({...post, featuredImage: featuredPhoto?.src || post.featuredImage, featuredAlt: featuredPhoto?.alt ?? post.featuredAlt, contentHtml: html}))
  const settings = records.siteSettings[0]
  return {
    clinicalTrials: withDefaults('clinicalTrial'),
    podcastEpisodes: withDefaults('podcastEpisode'),
    // An uploaded profile photo also becomes the card image, unless the card already has its own uploaded image (e.g. original photo on the card, cutout on the profile).
    providers: withDefaults('provider').map((p) => ({...p, directory: {...p.directory, ...(p.photo?.src?.startsWith('https://cdn.sanity.io/') && !p.directory?.photo?.startsWith('https://cdn.sanity.io/') ? {photo: p.photo.src, alt: p.photo.alt} : {})}})), locations: withDefaults('location'), specialties: withDefaults('specialty').map(({heroPhoto, ...s}) => ({...s, image: heroPhoto?.src || s.image})), leaders: withDefaults('leader'),
    policies: withDefaults('policy'), newsPosts, resourcePages: withDefaults('resourcePage'), pages,
    defaults: localDefaults, sharedContent: keyed('sharedContent', 'key', 'html'),
    providerLocations: keyed('providerLocation', 'key'), leadershipGroups: settings?.leadershipGroups?.map((group: any) => ({...group, cards: (group.cards || []).map(({profile, ...card}: any) => ({...card, ...(profile ? {provider: profile.slug && profile.type === 'provider' ? profile.slug : undefined, leader: profile.slug && profile.type === 'leader' ? profile.slug : undefined} : {})}))})) || localLeadershipGroups,
    mediaHighlights: settings?.mediaHighlights || localMedia,
    mainPhone: settings ? {display: settings.mainPhoneDisplay, href: settings.mainPhoneDisplay ? `tel:${settings.mainPhoneDisplay.replace(/[^+\d]/g, '')}` : settings.mainPhoneHref} : localMainPhone,
  }
}

async function loadContent() {
  const source = contentSource()
  if (source === 'local') return fallback
  if (source === 'repo') return assembleContent(readRepoRecords())
  try {
    return assembleContent(await fetchSanityRecords())
  } catch (error) {
    if (import.meta.env.CI || import.meta.env.SANITY_REQUIRED === 'true') throw error
    console.warn('Sanity was unavailable; using repository content for this local build.', error)
    return fallback
  }
}

const content = await loadContent()
/** Records read from `content/` carry the file they came from, rendered as `data-sa`. */
export type WithContentId<T extends readonly unknown[]> = Array<T[number] & {contentId?: string}>

export const providers = content.providers as WithContentId<typeof localProviders>
export const locations = content.locations as WithContentId<typeof localLocations>
export const specialties = content.specialties as WithContentId<typeof localSpecialties>
export const leaders = content.leaders as WithContentId<typeof localLeaders>
export const policies = content.policies as Array<(typeof localPolicies)[number] & {seoTitle?: string}>
export const pages = content.pages as typeof localPages
export const pageDefaults = content.defaults
export const sharedContent = content.sharedContent as typeof localSharedContent
export const providerLocations = content.providerLocations as typeof localProviderLocations
export const leadershipGroups = content.leadershipGroups as typeof localLeadershipGroups
export const newsPosts = content.newsPosts as Array<(typeof localNewsPosts)[number] & {description?: string; contentId?: string}>
export const resourcePages = content.resourcePages as typeof localResourcePages
export const mainPhone = content.mainPhone

export const mediaHighlights = content.mediaHighlights as (typeof localMedia[number] & {photo?: {src: string; alt: string}})[]

export const clinicalTrials = content.clinicalTrials as ClinicalTrial[]

export interface PodcastEpisode {
  contentId?: string;
  title: string;
  guest?: string;
  episodeNumber?: number;
  publishedDate: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
}
/** Published episodes, newest first. */
export const podcastEpisodes = [...(content.podcastEpisodes as PodcastEpisode[])].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
