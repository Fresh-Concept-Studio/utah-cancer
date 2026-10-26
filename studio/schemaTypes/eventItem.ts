import {defineArrayMember, defineField, defineType} from 'sanity'
import {formatEventDate, isEventPast, todayKey} from '../../src/lib/event-dates'

/** Same categories as the website's Events filters (src/lib/events.ts). */
export const EVENT_CATEGORY_OPTIONS = [
  {title: 'Patient Resources', value: 'support'},
  {title: 'Community', value: 'community'},
  {title: 'Fundraiser', value: 'fundraiser'},
]

const webAddress = (rule: any) => rule.uri({scheme: ['http', 'https']})

/** One event in the Events page's list. Its date alone decides Upcoming vs Past on the website. */
export const eventItem = defineType({
  name: 'eventItem', title: 'Event', type: 'object',
  fieldsets: [{name: 'after', title: 'After the event', description: 'Add real photos or a video. They are shown on this event’s card in the Past tab.', options: {collapsible: true, collapsed: false}}],
  fields: [
    defineField({name: 'title', title: 'Event name', type: 'string', validation: r => r.required()}),
    defineField({name: 'date', title: 'Date', type: 'date', options: {dateFormat: 'MMMM D, YYYY'}, description: 'Decides where the event appears: Upcoming through the end of this day (Utah time), then Past.', validation: r => r.required()}),
    defineField({name: 'timeText', title: 'Time (optional)', type: 'string', description: 'For example, 10:00 AM–1:30 PM or Half starts 8:00 AM.'}),
    defineField({name: 'location', title: 'Location', type: 'string', description: 'For example, Sugar House Park, Salt Lake City.'}),
    defineField({name: 'category', title: 'Category', type: 'string', options: {list: EVENT_CATEGORY_OPTIONS, layout: 'radio', direction: 'horizontal'}, description: 'Used by the category filters on the Events page.', validation: r => r.required()}),
    defineField({name: 'categoryLabel', title: 'Category label (optional)', type: 'string', description: 'Shown on the card instead of the category name, for example “Run / Walk”.'}),
    defineField({name: 'description', title: 'Short description', type: 'text', rows: 3}),
    defineField({name: 'link', title: 'Event website or registration link (optional)', type: 'url', validation: webAddress}),
    defineField({name: 'linkLabel', title: 'Button label (optional)', type: 'string', description: 'Defaults to “Event Details”.'}),
    defineField({name: 'image', title: 'Event image', type: 'legacyImage', description: 'Shown on the event’s card. Includes the image description for screen readers.'}),
    defineField({name: 'featured', title: 'Feature on the Events page', type: 'boolean', initialValue: false, description: 'Feature at the top of the Events page while it’s upcoming. If no upcoming event is featured, the next upcoming event is shown there.'}),
    defineField({
      name: 'photos', title: 'Photos from the event', type: 'array', fieldset: 'after', options: {layout: 'grid'},
      of: [defineArrayMember({
        type: 'image', options: {hotspot: true},
        fields: [
          defineField({name: 'alt', title: 'Image description', type: 'string', description: 'Briefly describe the photo for people using screen readers.'}),
          defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
        ],
      })],
    }),
    defineField({name: 'videoUrl', title: 'Video link (optional)', type: 'url', fieldset: 'after', description: 'A YouTube or Vimeo link plays on the page; other links open in a new tab.', validation: webAddress}),
  ],
  initialValue: {featured: false},
  preview: {
    select: {title: 'title', date: 'date', media: 'image.asset', photo: 'photos.0', featured: 'featured'},
    prepare: ({title, date, media, photo, featured}) => {
      const status = !date ? 'No date' : isEventPast(date, todayKey()) ? 'Past' : 'Upcoming'
      return {
        title: title || 'Untitled event',
        subtitle: [date ? formatEventDate(date) : null, status, featured ? 'Featured' : null].filter(Boolean).join(' · '),
        media: media || photo,
      }
    },
  },
})
