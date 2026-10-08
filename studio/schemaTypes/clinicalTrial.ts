import {defineField, defineType} from 'sanity'

export const clinicalTrial = defineType({
  name: 'clinicalTrial', title: 'Clinical trial', type: 'document',
  description: 'Each published record appears on the active clinical trials page. Unpublish or delete a record to remove it from the website.',
  fields: [
    defineField({name: 'title', title: 'Study title', type: 'string', validation: r => r.required()}),
    defineField({name: 'nctId', title: 'NCT ID', type: 'string', description: 'The study identifier, for example NCT07085767.', validation: r => r.required().regex(/^NCT\d{8}$/, {name: 'NCT ID'}).custom(async (value, context) => {
      if (!value) return true
      const id = context.document?._id.replace(/^drafts\./, '')
      const duplicate = await context.getClient({apiVersion: '2026-09-21'}).withConfig({useCdn: false, perspective: 'raw'}).fetch('count(*[_type == "clinicalTrial" && nctId == $nctId && !(_id in [$id, $draftId])])', {nctId: value, id: id || '', draftId: `drafts.${id}`})
      return duplicate ? 'A trial with this NCT ID already exists.' : true
    })}),
    defineField({name: 'cancerType', title: 'Cancer type / category', type: 'string', description: 'Trials with the same category are grouped together. Use an existing category name, or enter a new one.', validation: r => r.required()}),
    defineField({name: 'description', title: 'Study description', type: 'text', rows: 5, validation: r => r.required()}),
    defineField({name: 'studyUrl', title: 'Study details link', type: 'url', description: 'Optional. Defaults to the ClinicalTrials.gov page for the NCT ID.', validation: r => r.uri({scheme: ['https', 'http']})}),
    defineField({name: 'statusLabel', title: 'Enrollment label', type: 'string', description: 'The label shown on the study card, such as Open or Recruiting. To remove a trial from the website, use Unpublish or Delete.', initialValue: 'Open', validation: r => r.required()}),
    defineField({name: 'contactName', title: 'Research contact name', type: 'string'}),
    defineField({name: 'phone', title: 'Research phone number', type: 'string'}),
    defineField({name: 'email', title: 'Research email', type: 'string', validation: r => r.email()}),
    defineField({name: 'pdf', title: 'Study PDF', type: 'file', options: {accept: 'application/pdf'}, description: 'Upload an optional information sheet. An upload takes precedence over the PDF link below.'}),
    defineField({name: 'pdfUrl', title: 'Existing PDF link', type: 'url', validation: r => r.uri({scheme: ['https', 'http']})}),
    defineField({name: 'pdfLabel', title: 'PDF link label', type: 'string', initialValue: 'View PDF'}),
    defineField({name: 'sortOrder', title: 'Order within category', type: 'number', initialValue: 0, validation: r => r.integer().min(0)}),
  ],
  orderings: [{title: 'Cancer type, then title', name: 'category', by: [{field: 'cancerType', direction: 'asc'}, {field: 'title', direction: 'asc'}]}],
  preview: {select: {title: 'title', category: 'cancerType', nctId: 'nctId'}, prepare: ({title, category, nctId}) => ({title, subtitle: [nctId, category].filter(Boolean).join(' · ')})},
})
