import {createClient} from '@sanity/client'
import {convert} from './cms-records'
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
  newsPosts: localNewsPosts, resourcePages: localResourcePages, mainPhone: localMainPhone, mediaHighlights: localMedia,
}

async function loadContent() {
  if (import.meta.env.SANITY_USE_CMS === 'false') return fallback
  const client = createClient({...sanityConfig, useCdn: false, perspective: 'published'})
  try {
    const docs = await client.fetch<AnyRecord[]>(`*[_type in ["provider", "location", "specialty", "leader", "policy", "newsArticle", "resourcePage", "page", "sharedContent", "providerLocation", "siteSettings"]]{
      ...,
      photo{..., "asset": asset{..., "asset": asset->{url}}},
      "image": select(image._type == "legacyImage" => image{..., "asset": asset{..., "asset": asset->{url}}}, image),
      directoryPhoto{..., "asset": asset{..., "asset": asset->{url}}},
      editorImages[]{..., image{..., "asset": asset{..., "asset": asset->{url}}}},
      featuredPhoto{..., "asset": asset{..., "asset": asset->{url}}},
      heroPhoto{..., "asset": asset{..., "asset": asset->{url}}},
      leadershipGroups[]{..., cards[]{..., "profile": profile->{"type": _type,slug}, photo{..., "asset": asset{..., "asset": asset->{url}}}}},
      mediaHighlights[]{..., photo{..., "asset": asset{..., "asset": asset->{url}}}}
    }`)

    if (!docs.length) throw new Error('Sanity returned no published content')
    const type = (name: string) => docs.filter((doc) => doc._type === name).map(convert).map((doc) => ['provider','leader','location','specialty'].includes(name) ? {tabs: [], sections: [], actions: [], locationIds: [], ...doc} : doc)
    const keyed = (name: string, key: string, valueKey?: string) => Object.fromEntries(
      type(name).map((doc) => [doc[key], valueKey ? doc[valueKey] : Object.fromEntries(Object.entries(doc).filter(([field]) => field !== key))]),
    )
    const pageDocs = type('page')
    const pages = Object.fromEntries(pageDocs.map(({path, title, description, seoTitle, editorContent, editorImages, jobs, settings}) => [path, {title: seoTitle || title, description, editorContent, editorImages, jobs, ...settings}]))
    const newsPosts = type('newsArticle').map(({html, featuredPhoto, ...post}) => ({...post, featuredImage: featuredPhoto?.src || post.featuredImage, featuredAlt: featuredPhoto?.alt ?? post.featuredAlt, contentHtml: html}))
    const settings = type('siteSettings')[0]
    return {
      providers: type('provider').map((p) => ({...p, directory: {...p.directory, ...(p.photo?.src?.startsWith('https://cdn.sanity.io/') ? {photo: p.photo.src, alt: p.photo.alt} : {})}})), locations: type('location'), specialties: type('specialty').map(({heroPhoto, ...s}) => ({...s, image: heroPhoto?.src || s.image})), leaders: type('leader'),
      policies: type('policy'), newsPosts, resourcePages: type('resourcePage'), pages,
      defaults: localDefaults, sharedContent: keyed('sharedContent', 'key', 'html'),
      providerLocations: keyed('providerLocation', 'key'), leadershipGroups: settings?.leadershipGroups?.map((group: any) => ({...group, cards: (group.cards || []).map(({profile, ...card}: any) => ({...card, ...(profile ? {provider: profile.slug && profile.type === 'provider' ? profile.slug : undefined, leader: profile.slug && profile.type === 'leader' ? profile.slug : undefined} : {})}))})) || localLeadershipGroups,
      mediaHighlights: settings?.mediaHighlights || localMedia,
      mainPhone: settings ? {display: settings.mainPhoneDisplay, href: settings.mainPhoneDisplay ? `tel:${settings.mainPhoneDisplay.replace(/[^+\d]/g, '')}` : settings.mainPhoneHref} : localMainPhone,
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
export const policies = content.policies as Array<(typeof localPolicies)[number] & {seoTitle?: string}>
export const pages = content.pages as typeof localPages
export const pageDefaults = content.defaults
export const sharedContent = content.sharedContent as typeof localSharedContent
export const providerLocations = content.providerLocations as typeof localProviderLocations
export const leadershipGroups = content.leadershipGroups as typeof localLeadershipGroups
export const newsPosts = content.newsPosts as Array<(typeof localNewsPosts)[number] & {description?: string}>
export const resourcePages = content.resourcePages as typeof localResourcePages
export const mainPhone = content.mainPhone

export const mediaHighlights = content.mediaHighlights as (typeof localMedia[number] & {photo?: {src: string; alt: string}})[]
