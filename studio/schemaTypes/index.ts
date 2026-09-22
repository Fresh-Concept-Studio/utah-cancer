import {defineArrayMember, defineField, defineType} from 'sanity'

const required = (rule: any) => rule.required()
const slugField = defineField({name: 'slug', title: 'URL slug', type: 'slug', validation: required})
const legacyImage = defineType({
  name: 'legacyImage', title: 'Image', type: 'object',
  fields: [
    defineField({name: 'asset', title: 'Uploaded image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'src', title: 'Existing site image path', type: 'string', description: 'Used until an uploaded image replaces it.'}),
    defineField({name: 'alt', title: 'Alternative text', type: 'string'}),
    defineField({name: 'class', title: 'CSS class', type: 'string', hidden: true}),
  ],
  preview: {select: {title: 'alt', subtitle: 'src', media: 'asset'}},
})
const contentSection = defineType({
  name: 'contentSection', title: 'Content section', type: 'object',
  fields: [
    defineField({name: 'id', title: 'Anchor ID', type: 'string'}),
    defineField({name: 'title', title: 'Heading', type: 'string', validation: required}),
    defineField({name: 'html', title: 'Content', type: 'text', rows: 14, description: 'HTML is supported to preserve the website’s designed layouts.', validation: required}),
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
    defineField({name: 'html', title: 'Label', type: 'string', description: 'May contain an icon span.'}),
    defineField({name: 'class', title: 'Style class', type: 'string'}),
    defineField({name: 'target', title: 'Open in', type: 'string', options: {list: [{title: 'Same window', value: ''}, {title: 'New window', value: '_blank'}]}}),
    defineField({name: 'rel', title: 'Link relationship', type: 'string'}),
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
  defineField({name: 'seoTitle', title: 'Search title', type: 'string', validation: (r) => r.max(65)}),
  defineField({name: 'description', title: 'Search description', type: 'text', rows: 3, validation: (r) => r.max(180)}),
]
const pageSettings = defineType({
  name: 'pageSettings', title: 'Page settings', type: 'object',
  fields: [
    defineField({name: 'bodyClass', title: 'Body class', type: 'string', hidden: true}),
    defineField({name: 'styles', title: 'Stylesheets', type: 'array', of: [{type: 'string'}], hidden: true}),
    defineField({name: 'scripts', title: 'Scripts', type: 'array', of: [{type: 'string'}], hidden: true}),
    defineField({name: 'marquee', title: 'Show marquee', type: 'boolean'}),
    defineField({name: 'component', title: 'Page template', type: 'string', readOnly: true}),
    defineField({name: 'cta', title: 'Call to action', type: 'callToAction'}),
  ],
})

const provider = defineType({
  name: 'provider', title: 'Providers', type: 'document',
  groups: [{name: 'main', title: 'Profile', default: true}, {name: 'directory', title: 'Directory'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'name', title: 'Name and credentials', type: 'string', group: 'main', validation: required}), slugField,
    defineField({name: 'specialty', title: 'Specialty', type: 'string', group: 'main'}),
    defineField({name: 'languages', title: 'Languages', type: 'string', group: 'main'}),
    defineField({name: 'photo', title: 'Profile photo', type: 'legacyImage', group: 'main'}),
    defineField({name: 'tabs', title: 'Tabs', type: 'array', of: [{type: 'tab'}], group: 'main'}),
    defineField({name: 'sections', title: 'Profile sections', type: 'array', of: [{type: 'contentSection'}], group: 'main'}),
    defineField({name: 'sidebar', title: 'Sidebar content key', type: 'string', group: 'main'}),
    defineField({name: 'locationIds', title: 'Locations', type: 'array', of: [{type: 'string'}], group: 'main'}),
    defineField({name: 'directory', title: 'Directory settings', type: 'object', group: 'directory', fields: [
      defineField({name: 'photo', title: 'Card image path', type: 'string'}), defineField({name: 'alt', title: 'Card image alt text', type: 'string'}),
      defineField({name: 'category', title: 'Category', type: 'string'}), defineField({name: 'priority', title: 'Priority', type: 'number'}), defineField({name: 'order', title: 'Order', type: 'number'}),
    ]}),
    defineField({name: 'page', title: 'Page settings', type: 'pageSettings', group: 'seo'}),
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  orderings: [{title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'specialty', media: 'photo.asset'}},
})

const location = defineType({
  name: 'location', title: 'Locations', type: 'document',
  groups: [{name: 'main', title: 'Clinic', default: true}, {name: 'directory', title: 'Directory & map'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'title', title: 'Clinic name', type: 'string', validation: required}), slugField,
    defineField({name: 'tag', title: 'Service label', type: 'string'}), defineField({name: 'subtitle', title: 'Campus label', type: 'string'}),
    defineField({name: 'image', title: 'Clinic image', type: 'legacyImage'}),
    defineField({name: 'metaHtml', title: 'Address and phone line', type: 'text', rows: 4}),
    defineField({name: 'actions', title: 'Hero buttons', type: 'array', of: [{type: 'contentLink'}]}),
    defineField({name: 'sections', title: 'Clinic sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'sidebarHtml', title: 'Sidebar', type: 'text', rows: 14}),
    defineField({name: 'mapPlaceholder', title: 'Map placeholder', type: 'string', hidden: true}),
    defineField({name: 'cta', title: 'Call to action', type: 'callToAction'}),
    defineField({name: 'directory', title: 'Directory card', type: 'object', group: 'directory', fields: [
      defineField({name: 'order', title: 'Order', type: 'number'}), defineField({name: 'county', title: 'County filter', type: 'string'}),
      defineField({name: 'addressHtml', title: 'Address', type: 'text', rows: 3}), defineField({name: 'hoursHtml', title: 'Hours', type: 'string'}),
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
    defineField({name: 'title', title: 'Name', type: 'string', validation: required}), slugField,
    defineField({name: 'description', title: 'Summary', type: 'text', rows: 3}), defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'image', title: 'Hero image path', type: 'string'}), defineField({name: 'actions', title: 'Hero buttons', type: 'array', of: [{type: 'contentLink'}]}),
    defineField({name: 'tabs', title: 'Tabs', type: 'array', of: [{type: 'tab'}]}), defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'sidebar', title: 'Sidebar content key', type: 'string'}),
    defineField({name: 'relatedHtml', title: 'Related content', type: 'text', rows: 10}),
    defineField({name: 'directory', title: 'Directory settings', type: 'object', fields: [
      defineField({name: 'category', title: 'Category', type: 'string'}), defineField({name: 'order', title: 'Order', type: 'number'}),
      defineField({name: 'searchName', title: 'Search name', type: 'string'}), defineField({name: 'description', title: 'Card description', type: 'text', rows: 3}),
      defineField({name: 'icon', title: 'Icon name', type: 'string'}),
    ]}),
    defineField({name: 'page', title: 'Page settings', type: 'pageSettings'}),
    defineField({name: 'seoTitle', title: 'Search title', type: 'string', validation: (r) => r.max(65)}),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image.asset'}},
})

const leader = defineType({
  name: 'leader', title: 'Leadership profiles', type: 'document',
  fields: [defineField({name: 'name', title: 'Name', type: 'string', validation: required}), slugField, defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'photo', title: 'Profile photo', type: 'legacyImage'}), defineField({name: 'sections', title: 'Profile sections', type: 'array', of: [{type: 'contentSection'}]}),
    defineField({name: 'directoryPhoto', title: 'Directory photo', type: 'legacyImage'}), defineField({name: 'page', title: 'Page settings', type: 'pageSettings'}), ...seoFields],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo.asset'}},
})

const htmlDocument = (name: string, title: string) => defineType({
  name, title, type: 'document',
  fields: [slugField, defineField({name: 'title', title: 'Title', type: 'string', validation: required}), ...seoFields,
    defineField({name: 'heading', title: 'Page heading', type: 'string'}), defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 4}), defineField({name: 'html', title: 'Page content', type: 'text', rows: 20}),
    defineField({name: 'sourceUrl', title: 'Source URL', type: 'url'}),
    defineField({name: 'publishedDate', title: 'Published date', type: 'date'}), defineField({name: 'dateLabel', title: 'Displayed date', type: 'string'}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3}), defineField({name: 'featuredImage', title: 'Featured image path', type: 'string'}),
    defineField({name: 'featuredAlt', title: 'Featured image alt text', type: 'string'}),
    defineField({name: 'icon', title: 'Icon name', type: 'string'}),
    defineField({name: 'relatedLinks', title: 'Related links', type: 'array', of: [{type: 'object', fields: [defineField({name: 'href', title: 'Destination', type: 'string'}), defineField({name: 'label', title: 'Label', type: 'string'})]}]}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})

const page = defineType({
  name: 'page', title: 'Page settings & SEO', type: 'document',
  fields: [defineField({name: 'path', title: 'Site path', type: 'string', validation: required, readOnly: true}), defineField({name: 'title', title: 'Browser title', type: 'string'}),
    defineField({name: 'description', title: 'Search description', type: 'text', rows: 3}), defineField({name: 'settings', title: 'Page settings', type: 'pageSettings'})],
  preview: {select: {title: 'title', subtitle: 'path'}},
})
const keyedHtml = defineType({
  name: 'sharedContent', title: 'Shared sidebars', type: 'document',
  fields: [defineField({name: 'key', title: 'Internal key', type: 'string', readOnly: true}), defineField({name: 'title', title: 'Editor label', type: 'string'}), defineField({name: 'html', title: 'Content', type: 'text', rows: 18})],
  preview: {select: {title: 'title', subtitle: 'key'}},
})
const providerLocation = defineType({
  name: 'providerLocation', title: 'Provider location cards', type: 'document',
  fields: [defineField({name: 'key', title: 'Internal key', type: 'string', readOnly: true}), defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'sublabel', title: 'Sublabel', type: 'string'}), defineField({name: 'addressHtml', title: 'Address', type: 'text', rows: 3}),
    defineField({name: 'actions', title: 'Actions', type: 'array', of: [{type: 'contentLink'}]})],
  preview: {select: {title: 'name', subtitle: 'key'}},
})
const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Site name', type: 'string'}),
    defineField({name: 'mainPhoneDisplay', title: 'Main phone number', type: 'string'}),
    defineField({name: 'mainPhoneHref', title: 'Main phone link', type: 'string'}),
    defineField({name: 'cmsVerification', title: 'CMS verification note', type: 'string', description: 'Safe, non-public field used to confirm publishing and deployments.'}),
  ],
})

export const schemaTypes = [legacyImage, contentSection, tab, contentLink, cta, pageSettings, provider, location, specialty, leader,
  htmlDocument('policy', 'Legal policies'), htmlDocument('newsArticle', 'News articles'), htmlDocument('resourcePage', 'Resource pages'),
  page, keyedHtml, providerLocation, siteSettings]
