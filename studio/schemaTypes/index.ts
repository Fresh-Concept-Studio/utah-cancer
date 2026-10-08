import {clinicalTrial} from './clinicalTrial'
import {PageCopyInput, ReadableHtmlInput, LocationChoicesInput, ExistingImageInput} from '../components/ContentInputs'
import {EditorNotice} from '../components/EditorGuide'
import {JobListingsInput} from '../components/JobListingsInput'
import {pageAddress} from '../page-address'
import {defineArrayMember, defineField, defineType} from 'sanity'

const required = (rule: any) => rule.required()
const slugField = defineField({name: 'slug', title: 'Page address', type: 'slug', description: 'Set when creating a page. Existing addresses are locked to preserve links.', readOnly: ({document}) => Boolean(document?._createdAt), options: {source: (doc: any) => doc.name || doc.title}, validation: required})
const legacyImage = defineType({
  name: 'legacyImage', title: 'Image', type: 'object', components: {input: ExistingImageInput}, validation: r => r.custom((value: any) => !value || value.src || value.asset?.asset?._ref ? true : 'Upload an image before publishing.'),
  fields: [
    defineField({name: 'asset', title: 'Upload or replace image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'src', title: 'Existing site image path', type: 'string', description: 'Used until an uploaded image replaces it.', hidden: true}),
    defineField({name: 'alt', title: 'Image description', type: 'string', description: 'Briefly describe the image for people using screen readers.'}),
    defineField({name: 'class', title: 'CSS class', type: 'string', hidden: true}),
  ],
  preview: {select: {title: 'alt', subtitle: 'src', media: 'asset'}},
})
const contentSection = defineType({
  name: 'contentSection', title: 'Content section', type: 'object',
  fields: [
    defineField({name: 'id', title: 'Anchor ID', type: 'string', hidden: true}),
    defineField({name: 'title', title: 'Heading', type: 'string', validation: required}),
    defineField({name: 'html', title: 'Content', type: 'text', rows: 14, components: {input: ReadableHtmlInput}, description: 'Edit the words below. Formatting and layout are preserved.', validation: required}),
  ],
  preview: {select: {title: 'title', subtitle: 'id'}},
})
const tab = defineType({
  name: 'tab', title: 'Page tab', type: 'object',
  fields: [defineField({name: 'href', title: 'Anchor', type: 'string'}), defineField({name: 'label', title: 'Label', type: 'string'})],
})
const contentLink = defineType({
  name: 'contentLink', title: 'Link or button', type: 'object',
  fields: [
    defineField({name: 'href', title: 'Destination', type: 'string', validation: required}),
    defineField({name: 'html', title: 'Button label', type: 'string', components: {input: ReadableHtmlInput}}),
    defineField({name: 'class', title: 'Style class', type: 'string', hidden: true}),
    defineField({name: 'target', title: 'Open in', type: 'string', options: {list: [{title: 'Same window', value: ''}, {title: 'New window', value: '_blank'}]}}),
    defineField({name: 'rel', title: 'Link relationship', type: 'string', hidden: true}),
  ],
  preview: {select: {title: 'html', subtitle: 'href'}},
})
const cta = defineType({
  name: 'callToAction', title: 'Call to action', type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'image', title: 'Background image path', type: 'string'}),
    defineField({name: 'links', title: 'Buttons', type: 'array', of: [defineArrayMember({type: 'contentLink'})]}),
    defineField({name: 'actionsClass', title: 'Style class', type: 'string', hidden: true}),
  ],
})
const seoFields = [
  defineField({name: 'seoTitle', title: 'Search title', type: 'string', validation: (r) => r.max(65).warning()}),
  defineField({name: 'description', title: 'Search description', type: 'text', rows: 3, validation: (r) => r.max(180).warning()}),
]
const pageSettings = defineType({
  name: 'pageSettings', title: 'Page settings', type: 'object',
  fields: [
    defineField({name: 'bodyClass', title: 'Body class', type: 'string', hidden: true}),
    defineField({name: 'styles', title: 'Stylesheets', type: 'array', of: [{type: 'string'}], hidden: true}),
    defineField({name: 'scripts', title: 'Scripts', type: 'array', of: [{type: 'string'}], hidden: true}),
    defineField({name: 'marquee', title: 'Show marquee', type: 'boolean'}),
    defineField({name: 'component', title: 'Page template', type: 'string', hidden: true}),
    defineField({name: 'cta', title: 'Call to action', type: 'callToAction'}),
  ],
})

const provider = defineType({
  name: 'provider', title: 'Providers', type: 'document', initialValue: {tabs: [], sections: [], locationIds: [], directory: {order: 100, category: 'medical-oncology'}},
  groups: [{name: 'main', title: 'Profile', default: true}, {name: 'directory', title: 'Directory'}, {name: 'seo', title: 'Search appearance'}],
  fields: [
    defineField({name: 'editorNotice', title: 'Editing this page', type: 'string', group: 'main', components: {input: EditorNotice}, readOnly: true}),
    defineField({name: 'name', title: 'Name and credentials', type: 'string', group: 'main', validation: required}), slugField,
    defineField({name: 'specialty', title: 'Specialty', type: 'string', group: 'main'}),
    defineField({name: 'languages', title: 'Languages', type: 'string', group: 'main'}),
    defineField({name: 'photo', title: 'Profile photo', type: 'legacyImage', validation: required, group: 'main'}),
    defineField({name: 'tabs', title: 'Tabs', hidden: true, type: 'array', of: [{type: 'tab'}], group: 'main'}),
    defineField({name: 'sections', title: 'Profile sections', type: 'array', of: [{type: 'contentSection'}], group: 'main'}),
    defineField({name: 'sidebar', title: 'Sidebar content key', type: 'string', hidden: true, group: 'main'}),
    defineField({name: 'locationIds', title: 'Locations shown on this profile', type: 'array', components: {input: LocationChoicesInput}, of: [{type: 'string'}], group: 'main'}),
    defineField({name: 'directory', title: 'Directory settings', type: 'object', group: 'directory', fields: [
      defineField({name: 'photo', title: 'Card image path', type: 'string', hidden: true}), defineField({name: 'alt', title: 'Card image alt text', type: 'string', hidden: true}),
      defineField({name: 'category', title: 'Provider category', type: 'string', options: {list: [{title: 'Medical Oncology & Hematology', value: 'medical-oncology'}, {title: 'Radiation Oncology', value: 'radiation-oncology'}, {title: 'Advanced Practitioners', value: 'advanced-practitioners'}, {title: 'Supportive and Rehabilitative Care', value: 'supportive-care'}]}}), defineField({name: 'priority', title: 'Priority', type: 'number'}), defineField({name: 'order', title: 'Order', type: 'number'}),
    ]}),
    defineField({name: 'page', title: 'Page settings', type: 'pageSettings', group: 'seo'}),
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  orderings: [{title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'specialty', media: 'photo.asset'}},
})

const location = defineType({
  name: 'location', title: 'Locations', type: 'document', initialValue: {actions: [], sections: [], directory: {order: 100}},
  groups: [{name: 'main', title: 'Clinic', default: true}, {name: 'directory', title: 'Directory & map'}, {name: 'seo', title: 'Search appearance'}],
  fields: [
    defineField({name: 'editorNotice', title: 'Editing this page', type: 'string', group: 'main', components: {input: EditorNotice}, readOnly: true}),
    defineField({name: 'title', group: 'main', title: 'Clinic name', type: 'string', validation: required}), slugField,
    defineField({name: 'tag', group: 'main', title: 'Service label', type: 'string'}), defineField({name: 'subtitle', group: 'main', title: 'Campus label', type: 'string'}),
    defineField({name: 'image', group: 'main', title: 'Clinic image', type: 'legacyImage', validation: required}),
    defineField({name: 'metaHtml', group: 'main', title: 'Address and phone at top of page', type: 'text', rows: 4, components: {input: ReadableHtmlInput}}),
    defineField({name: 'actions', group: 'main', title: 'Hero buttons', type: 'array', of: [{type: 'contentLink'}]}),
    defineField({name: 'sections', group: 'main', title: 'Clinic sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'sidebarHtml', group: 'main', title: 'Contact details beside clinic description', type: 'text', rows: 14, components: {input: ReadableHtmlInput}}),
    defineField({name: 'mapPlaceholder', title: 'Map placeholder', type: 'boolean', hidden: true}),
    defineField({name: 'cta', group: 'main', title: 'Call to action', type: 'callToAction'}),
    defineField({name: 'directory', title: 'Directory card', type: 'object', group: 'directory', fields: [
      defineField({name: 'order', title: 'Order', type: 'number'}), defineField({name: 'county', title: 'County filter', type: 'string'}),
      defineField({name: 'addressHtml', title: 'Address', type: 'text', rows: 3, components: {input: ReadableHtmlInput}}), defineField({name: 'hoursHtml', title: 'Hours', type: 'string', components: {input: ReadableHtmlInput}}),
      defineField({name: 'phone', title: 'Phone', type: 'string'}), defineField({name: 'badge', title: 'Badge', type: 'string'}),
    ]}),
    defineField({name: 'map', title: 'Map coordinates', type: 'object', group: 'directory', fields: [defineField({name: 'lat', title: 'Latitude', type: 'number'}), defineField({name: 'lng', title: 'Longitude', type: 'number'})]}),
    defineField({name: 'page', title: 'Page settings', type: 'pageSettings', group: 'seo'}),
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  preview: {select: {title: 'title', subtitle: 'subtitle', media: 'image.asset'}},
})

const specialty = defineType({
  name: 'specialty', title: 'Cancer types & specialties', type: 'document',
  fields: [
    defineField({name: 'editorNotice', title: 'Editing this page', type: 'string', components: {input: EditorNotice}, readOnly: true}),
    defineField({name: 'title', title: 'Name', type: 'string', validation: required}), slugField,
    defineField({name: 'description', title: 'Summary', type: 'text', rows: 3}), defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'heroPhoto', title: 'Page image', type: 'legacyImage'}), defineField({name: 'image', title: 'Hero image path', type: 'string', hidden: true}), defineField({name: 'actions', title: 'Hero buttons', type: 'array', of: [{type: 'contentLink'}]}),
    defineField({name: 'tabs', title: 'Tabs', hidden: true, type: 'array', of: [{type: 'tab'}]}), defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'sidebar', title: 'Sidebar content key', type: 'string', hidden: true}),
    defineField({name: 'relatedHtml', title: 'Related content', type: 'text', rows: 10, components: {input: ReadableHtmlInput}}),
    defineField({name: 'directory', title: 'Directory settings', type: 'object', fields: [
      defineField({name: 'category', title: 'Category', type: 'string'}), defineField({name: 'order', title: 'Order', type: 'number'}),
      defineField({name: 'searchName', title: 'Search name', type: 'string'}), defineField({name: 'description', title: 'Card description', type: 'text', rows: 3}),
      defineField({name: 'icon', title: 'Icon name', type: 'string'}),
    ]}),
    defineField({name: 'page', title: 'Page settings', type: 'pageSettings'}),
    defineField({name: 'seoTitle', title: 'Search title', type: 'string', validation: (r) => r.max(65).warning()}),
    defineField({name: 'seoDescription', title: 'Search description', type: 'text', rows: 3, description: 'Optional. Leave blank to use a summary of this specialty.'}),
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})

const leader = defineType({
  name: 'leader', title: 'Leadership profiles', type: 'document', initialValue: {sections: []},
  fields: [
    defineField({name: 'editorNotice', title: 'Editing this page', type: 'string', components: {input: EditorNotice}, readOnly: true}),defineField({name: 'name', title: 'Name', type: 'string', validation: required}), slugField, defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'photo', title: 'Profile photo', type: 'legacyImage'}), defineField({name: 'sections', title: 'Profile sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'directoryPhoto', title: 'Directory photo', type: 'legacyImage'}), defineField({name: 'page', title: 'Page settings', type: 'pageSettings'}), ...seoFields],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo.asset'}},
})

const htmlDocument = (name: string, title: string) => defineType({
  name, title, type: 'document',
  groups: [{name:'main',title:'Page content',default:true},{name:'seo',title:'Search appearance'}],
  fields: [
    defineField({name:'editorNotice',title:'Editing this page',type:'string',group:'main',components:{input:EditorNotice},readOnly:true}),
    {...slugField, group:'seo'},
    defineField({name:'title',title:name==='policy'?'Browser title':'Page title',type:'string',group:'main',validation:required}),
    ...seoFields.map(field=>({...field,group:'seo'})),
    defineField({name:'heading',title:'Page heading',type:'string',group:'main',hidden:()=>name!=='policy'}),
    defineField({name:'eyebrow',title:'Small label above the heading',type:'string',group:'main',hidden:()=>name==='newsArticle'}),
    defineField({name:'intro',title:'Introduction',type:'text',rows:4,group:'main',hidden:()=>name!=='resourcePage'}),
    defineField({name:'html',title:'Page content',type:'text',group:'main',components:{input:ReadableHtmlInput}}),
    defineField({name:'sourceUrl',title:'Original source URL',type:'url',hidden:true}),
    defineField({name:'publishedDate',title:'Article date',type:'date',group:'main',hidden:()=>name!=='newsArticle'}),
    defineField({name:'dateLabel',title:'Displayed date',type:'string',group:'main',hidden:()=>name!=='newsArticle'}),
    defineField({name:'excerpt',title:'Summary on the News page',type:'text',rows:3,group:'main',hidden:()=>name!=='newsArticle'}),
    defineField({name:'featuredPhoto',title:'Article image',type:'legacyImage',group:'main',hidden:()=>name!=='newsArticle'}),
    defineField({name:'featuredImage',type:'string',hidden:true}), defineField({name:'featuredAlt',type:'string',hidden:true}),
    defineField({name:'icon',type:'string',hidden:true}),
    defineField({name:'relatedLinks',title:'Related resource links',type:'array',group:'main',hidden:()=>name!=='resourcePage',of:[{type:'object',fields:[defineField({name:'href',title:'Destination',type:'string'}),defineField({name:'label',title:'Label',type:'string'})]}]}),
  ],
  preview:{select:{title:'title',slug:'slug.current'},prepare:({title,slug})=>({title:title?.replace(/\s*[-|]\s*Utah Cancer Specialists$/,''),subtitle:`/${slug}/`})},
})

const jobOpening = defineType({
  name: 'jobOpening', title: 'Job opening', type: 'object',
  fields: [
    defineField({name: 'title', title: 'Job title', type: 'string', validation: required}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'schedule', title: 'Schedule', type: 'string'}),
    defineField({name: 'status', title: 'Employment classification', type: 'string'}),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4}),
    defineField({name: 'responsibilities', title: 'Responsibilities', type: 'array', of: [{type: 'string'}], initialValue: []}),
    defineField({name: 'qualifications', title: 'Qualifications', type: 'array', of: [{type: 'string'}], initialValue: []}),
  ],
  initialValue: {responsibilities: [], qualifications: []},
  preview: {select: {title: 'title', subtitle: 'location'}},
})
const leadershipMember = defineType({
  name: 'leadershipMember', title: 'Leadership directory member', type: 'object', validation: r => r.custom((value: any) => !value || value.profile?._ref || (value.name && (value.photo?.src || value.photo?.asset?.asset?._ref)) ? true : 'Choose a profile, or enter a name and photo.'),
  fields: [
    defineField({name: 'profile', title: 'Linked profile', type: 'reference', to: [{type: 'provider'}, {type: 'leader'}], description: 'Choose a profile to use its current name and photo.'}),
    defineField({name: 'name', title: 'Name override', type: 'string', description: 'For a person without a profile, or a different display name.'}),
    defineField({name: 'role', title: 'Role on this directory', type: 'string'}),
    defineField({name: 'photo', title: 'Directory photo override', type: 'legacyImage'}),
    defineField({name: 'provider', type: 'string', hidden: true}), defineField({name: 'leader', type: 'string', hidden: true}),
  ],
  preview: {select: {name: 'name', linked: 'profile.name', role: 'role', media: 'photo.asset'}, prepare: ({name,linked,role,media})=>({title:name||linked||'Choose a profile',subtitle:role,media})},
})
const leadershipGroup = defineType({
  name: 'leadershipGroup', title: 'Leadership group', type: 'object', initialValue: {cards: []},
  fields: [defineField({name: 'title', title: 'Group name', type: 'string', validation: required}), defineField({name: 'cards', title: 'People in this group', description: 'The Leadership group displays alphabetically by last name on the website. Executive Leadership and Physician Executive Committee use the order shown here.', type: 'array', of: [{type: 'leadershipMember'}]})],
  preview: {select: {title: 'title'}},
})
const mediaVideo = defineType({
  name: 'mediaVideo', title: 'Media appearance', type: 'object',
  fields: [
    defineField({name: 'label', title: 'Short label on homepage', type: 'string', validation: required}),
    defineField({name: 'title', title: 'Video title', type: 'string', validation: required}),
    defineField({name: 'source', title: 'Source or broadcaster', type: 'string'}),
    defineField({name: 'badge', title: 'Category label', type: 'string'}),
    defineField({name: 'href', title: 'Video link', type: 'url', validation: required}),
    defineField({name: 'instagram', title: 'Instagram link (optional)', type: 'url'}),
    defineField({name: 'photo', title: 'Video thumbnail', type: 'legacyImage', validation: required}),
    defineField({name: 'id', type: 'string', hidden: true}),
  ],
  preview: {select: {title: 'label', subtitle: 'source', media: 'photo.asset'}},
})
const pageCopy = defineType({
  name: 'pageCopy', title: 'Page text', type: 'object',
  fields: [defineField({name: 'key', type: 'string', hidden: true}), defineField({name: 'section', type: 'string', readOnly: true}), defineField({name: 'label', type: 'string', readOnly: true}), defineField({name: 'kind', type: 'string', hidden: true}), defineField({name: 'value', title: 'Text or destination', type: 'text', validation: r => r.custom((v, context) => (context.parent as any)?.kind === 'number' && (!String(v || '').trim() || !Number.isFinite(Number(v)) || Number(v) < 0) ? 'Enter a number of zero or greater.' : (context.parent as any)?.kind === 'link' && /^\s*(javascript|data|vbscript):/i.test(v || '') ? 'Use a website address, an internal path, a phone link, or an email link.' : true)})],
  preview: {select: {title: 'label', subtitle: 'value'}},
})
const pageImage = defineType({
  name: 'pageImage', title: 'Page image', type: 'object',
  fields: [defineField({name: 'key', type: 'string', hidden: true}), defineField({name: 'label', type: 'string', hidden: true}), defineField({name: 'section', type: 'string', hidden: true}), defineField({name: 'image', title: 'Image', type: 'legacyImage'})],
  preview: {select: {title: 'label', subtitle: 'section', media: 'image.asset'}, prepare: ({title,subtitle,media}) => ({title: title === 'Hero bg' ? 'Page header background' : title, subtitle, media})},
})
const page = defineType({
  name: 'page', title: 'Website page', type: 'document',
  components: {input: JobListingsInput},
  groups: [{name: 'content', title: 'Page content', default: true}, {name: 'images', title: 'Images'}, {name: 'seo', title: 'Search appearance'}, {name: 'settings', title: 'Page options'}, {name: 'jobs', title: 'Job openings', hidden: ({document}: any) => document?.settings?.component !== 'careers'}],
  fields: [
    defineField({name: 'editorNotice', title: 'Editing this page', type: 'string', group: 'content', components: {input: EditorNotice}, readOnly: true}),
    defineField({name: 'path', title: 'Site path', type: 'string', validation: required, hidden: true}),
    defineField({name: 'title', title: 'Page name', type: 'string', hidden: true}),
    defineField({name: 'editorContent', title: 'Text & links', type: 'array', group: 'content', components: {input: PageCopyInput}, of: [{type: 'pageCopy'}]}),
    defineField({name: 'retiredTrials', type: 'array', of: [{type: 'string'}], hidden: true, readOnly: true}),
    defineField({name: 'trialRecordsMigrated', type: 'boolean', hidden: true, readOnly: true}),
    defineField({name: 'jobs', title: 'Current job openings', type: 'array', group: 'jobs', hidden: ({document}: any) => document?.settings?.component !== 'careers', of: [{type: 'jobOpening'}], description: 'Add, edit, reorder, or remove listings here. Changes go live when this page is published.'}),
    defineField({name: 'editorImages', title: 'Images on this page', type: 'array', group: 'images', options: {disableActions: ['add','remove','duplicate']}, of: [{type: 'pageImage'}]}),
    defineField({name: 'seoTitle', title: 'Search title', type: 'string', group: 'seo', description: 'Shown in browser tabs and search results.'}),
    defineField({name: 'description', title: 'Search description', type: 'text', rows: 3, group: 'seo', description: 'A short summary for search results.'}),
    defineField({name: 'settings', title: 'Page options', type: 'pageSettings', group: 'settings'}),
  ],
  preview: {select: {title: 'title', path: 'path'}, prepare: ({title, path}) => ({title: path === 'index.html' ? 'Home' : (title || path).replace(/\s*[-|]\s*Utah Cancer Specialists$/, ''), subtitle: pageAddress({_type: 'page', path})})},
})
const keyedHtml = defineType({
  name: 'sharedContent', title: 'Shared sidebars', type: 'document',
  fields: [defineField({name: 'key', title: 'Internal key', type: 'string', readOnly: true}), defineField({name: 'title', title: 'Editor label', type: 'string'}), defineField({name: 'html', title: 'Content', type: 'text', rows: 18, components: {input: ReadableHtmlInput}})],
  preview: {select: {title: 'title', subtitle: 'key'}},
})
const providerLocation = defineType({
  name: 'providerLocation', title: 'Provider location cards', type: 'document',
  fields: [defineField({name: 'key', title: 'Internal key', type: 'string', readOnly: true}), defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'sublabel', title: 'Sublabel', type: 'string'}), defineField({name: 'addressHtml', title: 'Address', type: 'text', rows: 3, components: {input: ReadableHtmlInput}}),
    defineField({name: 'actions', title: 'Actions', type: 'array', of: [{type: 'contentLink'}]})],
  preview: {select: {title: 'name', subtitle: 'key'}},
})
const siteSettings = defineType({
  name: 'siteSettings', title: 'Website-wide content', type: 'document', groups: [{name:'contact',title:'Contact',default:true},{name:'leadership',title:'Leadership directory'},{name:'media',title:'Media & videos'}],
  fields: [
    defineField({name: 'siteName', group: 'contact', title: 'Site name', type: 'string', readOnly: true}),
    defineField({name: 'mainPhoneDisplay', group: 'contact', title: 'Default appointment phone number', type: 'string', description: 'Used for general contact links. Provider pages use the phone numbers on their clinic cards.'}),
    defineField({name: 'mainPhoneHref', title: 'Main phone link', type: 'string', hidden: true}),
    defineField({name:'leadershipGroups',title:'Groups on the Leadership page',type:'array',group:'leadership',of:[{type:'leadershipGroup'}]}),
    defineField({name:'mediaHighlights',title:'Media appearances',type:'array',group:'media',of:[{type:'mediaVideo'}],description:'Used on the homepage and provider pages. Edit a video once to update both.'}),
    defineField({name: 'cmsVerification', title: 'CMS verification note', type: 'string', hidden: true}),
  ],
})

export const schemaTypes = [clinicalTrial, jobOpening, leadershipMember, leadershipGroup, mediaVideo, pageCopy, pageImage, legacyImage, contentSection, tab, contentLink, cta, pageSettings, provider, location, specialty, leader,
  htmlDocument('policy', 'Legal policies'), htmlDocument('newsArticle', 'News articles'), htmlDocument('resourcePage', 'Resource pages'),
  page, keyedHtml, providerLocation, siteSettings]
