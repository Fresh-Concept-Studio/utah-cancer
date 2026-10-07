import {defineConfig} from 'sanity'
import {structureTool, type StructureResolver, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {StartHere, PublishedPage, RelatedContent, PageDirectory} from './components/EditorGuide'

const fixedTypes = new Set(['siteSettings', 'page', 'sharedContent', 'providerLocation'])
const pageTypes=['page','provider','location','specialty','leader','policy','newsArticle','resourcePage']
const structure: StructureResolver = S => S.list().title('Website editor').items([
  S.listItem().title('Start Here').id('start').child(S.component().id('guide').title('Editing guide').component(StartHere)),
  S.listItem().title('Website Pages').id('pages').child(S.component().id('all-pages').title('Website pages').component(PageDirectory)),
  S.listItem().title('Main Pages').id('main-pages').child(S.documentTypeList('page').title('Main pages').filter('_type == "page" && !defined(settings.redirect)').initialValueTemplates([])),
  S.documentTypeListItem('provider').title('Providers'),
  S.documentTypeListItem('location').title('Locations'),
  S.documentTypeListItem('specialty').title('Cancers'),
  S.documentTypeListItem('leader').title('Leadership'),
  S.documentTypeListItem('newsArticle').title('News Articles'),
  S.documentTypeListItem('resourcePage').title('Resource Pages'),
  S.listItem().title('Job Listings').id('job-listings').child(
    S.document().schemaType('page').documentId('page-careers-html').title('Job Listings').views([
      S.view.form().title('Edit jobs'),
      S.view.component(PublishedPage).title('Published website'),
    ]),
  ),
  S.divider(),
  S.listItem().title('Clinical Trials').id('clinical-trials').child(
    S.document().schemaType('page').documentId('page-late-phase-trials-html').title('Clinical Trials').views([
      S.view.form().title('Edit trials'),
      S.view.component(PublishedPage).title('Published website'),
    ]),
  ),
  S.listItem().title('Shared content & contact cards').id('shared').child(S.list().title('Shared content').items([
    S.listItem().title('Leadership directory & media').id('shared-settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    S.documentTypeListItem('sharedContent').title('Shared contact panels'),
    S.documentTypeListItem('providerLocation').title('Clinic cards on provider pages'),
    S.documentTypeListItem('policy').title('Legal & privacy pages'),
  ])),
  S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
])
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => S.document().views([
  S.view.form().title('Edit'),
  ...(schemaType !== 'siteSettings' ? [S.view.component(RelatedContent).title('Related content')] : []),
  ...(pageTypes.includes(schemaType) ? [S.view.component(PublishedPage).title('Published website')] : []),
])
export default defineConfig({
  name: 'default', title: 'Utah Cancer Specialists', projectId: 'spba0u9p', dataset: 'production',
  plugins: [structureTool({title: 'Website editor', structure, defaultDocumentNode})],
  schema: {types: schemaTypes, templates: templates => templates.filter(({schemaType}) => !fixedTypes.has(schemaType))},
  document: {
    newDocumentOptions: prev => prev.filter(({templateId}) => !fixedTypes.has(templateId)),
    actions: (prev, context) => fixedTypes.has(context.schemaType) ? prev.filter(({action}) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish') : prev,
  },
})
