import {createClient} from '@sanity/client'
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
import {mainPhone as localMainPhone} from '../data/contact'

export const sanityConfig = {
  projectId: 'spba0u9p',
  dataset: 'production',
  apiVersion: '2026-09-21',
}

type AnyRecord = Record<string, any>
const fallback = {
  providers: localProviders, locations: localLocations, specialties: localSpecialties, leaders: localLeaders,
  policies: localPolicies, pages: localPages, defaults: localDefaults, sharedContent: localSharedContent,
  providerLocations: localProviderLocations, leadershipGroups: localLeadershipGroups,
  newsPosts: localNewsPosts, resourcePages: localResourcePages, mainPhone: localMainPhone,
}

function convert(value: any): any {
  if (Array.isArray(value)) return value.map(convert)
  if (!value || typeof value !== 'object') return value
  if (value._type === 'slug') return value.current
  if (typeof value.href === 'string' && typeof value.html === 'string') {
    const {href, html, class: className, target, rel} = value
    return {html, attrs: Object.fromEntries(Object.entries({href, class: className, target, rel}).filter(([, item]) => item))}
  }
  const converted = Object.fromEntries(Object.entries(value)
    .filter(([key]) => !key.startsWith('_') && key !== 'asset')
    .map(([key, item]) => [key, convert(item)]))
  if (value._type === 'legacyImage') converted.src = value.asset?.url || converted.src
  return converted
}

async function loadContent() {
  if (import.meta.env.SANITY_USE_CMS === 'false') return fallback
  const client = createClient({...sanityConfig, useCdn: false, perspective: 'published'})
  try {
    const docs = await client.fetch<AnyRecord[]>(`*[_type in ["provider", "location", "specialty", "leader", "policy", "newsArticle", "resourcePage", "page", "sharedContent", "providerLocation", "siteSettings"]]{..., photo{..., "asset": asset->{url}}, "image": select(defined(image.asset) => image{..., "asset": asset->{url}}, image), directoryPhoto{..., "asset": asset->{url}}}`)
    if (!docs.length) return fallback
    const type = (name: string) => docs.filter((doc) => doc._type === name).map(convert)
    const keyed = (name: string, key: string, valueKey?: string) => Object.fromEntries(
      type(name).map((doc) => [doc[key], valueKey ? doc[valueKey] : Object.fromEntries(Object.entries(doc).filter(([field]) => field !== key))]),
    )
    const pageDocs = type('page')
    const pages = Object.fromEntries(pageDocs.map(({path, title, description, settings}) => [path, {title, description, ...settings}]))
    const newsPosts = type('newsArticle').map(({html, ...post}) => ({...post, contentHtml: html}))
    const settings = type('siteSettings')[0]
    return {
      providers: type('provider'), locations: type('location'), specialties: type('specialty'), leaders: type('leader'),
      policies: type('policy'), newsPosts, resourcePages: type('resourcePage'), pages,
      defaults: localDefaults, sharedContent: keyed('sharedContent', 'key', 'html'),
      providerLocations: keyed('providerLocation', 'key'), leadershipGroups: localLeadershipGroups,
      mainPhone: settings ? {display: settings.mainPhoneDisplay, href: settings.mainPhoneHref} : localMainPhone,
    }
  } catch (error) {
    if (import.meta.env.CI || import.meta.env.SANITY_REQUIRED === 'true') throw error
    console.warn('Sanity was unavailable; using repository content for this local build.', error)
    return fallback
  }
}

const content = await loadContent()
export const providers = content.providers as typeof localProviders
export const locations = content.locations as typeof localLocations
export const specialties = content.specialties as typeof localSpecialties
export const leaders = content.leaders as typeof localLeaders
export const policies = content.policies as typeof localPolicies
export const pages = content.pages as typeof localPages
export const pageDefaults = content.defaults
export const sharedContent = content.sharedContent as typeof localSharedContent
export const providerLocations = content.providerLocations as typeof localProviderLocations
export const leadershipGroups = content.leadershipGroups as typeof localLeadershipGroups
export const newsPosts = content.newsPosts as typeof localNewsPosts
export const resourcePages = content.resourcePages as typeof localResourcePages
export const mainPhone = content.mainPhone
