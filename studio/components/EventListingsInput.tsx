import {useEffect} from 'react'
import {type ObjectInputProps} from 'sanity'
import {usePaneRouter} from 'sanity/structure'
import {JobListingsInput} from './JobListingsInput'

/** A focused view of the existing Events page document, using Sanity's native form. */
export function EventListingsInput(props: ObjectInputProps) {
  const {routerPanesState} = usePaneRouter()
  const eventsOnly = props.value?._id?.replace(/^drafts\./, '') === 'page-events-index-html'
    && routerPanesState.some(group => group.some(pane => pane.id === 'event-listings'))
  const eventsSelected = props.groups.some(group => group.name === 'events' && group.selected)
  const {onFieldGroupSelect} = props

  useEffect(() => {
    if (eventsOnly && !eventsSelected) onFieldGroupSelect('events')
  }, [eventsOnly, eventsSelected, onFieldGroupSelect])

  if (!eventsOnly) return <JobListingsInput {...props} />

  return <div>
    <div className="ucs-editor">
      <h2>Events</h2>
      <p>Click an event to edit it. Use <strong>Add item</strong> for a new event, or an event’s menu to remove it. The order here doesn’t matter: the website sorts events by date.</p>
      <p><strong>The date decides where an event appears.</strong> It shows under <em>Upcoming</em> through the end of its date (Utah time) and moves to <em>Past</em> automatically the next day. The homepage shows upcoming events only.</p>
      <p>After an event, open it and add real photos or a video link. They appear on its card in the <em>Past</em> tab.</p>
      <p>Changes save as a draft. Click <strong>Publish</strong> when ready, then allow a few minutes for the website to update.</p>
      <p><a href="https://utahcancer.com/events/" target="_blank" rel="noreferrer">View events on the website ↗</a></p>
      <p className="ucs-note">These events share the Events page’s draft. Publishing also includes any other unpublished changes to that page.</p>
    </div>
    {props.renderDefault({...props, groups: [], members: props.members.filter(member => member.kind === 'field' && member.name === 'events')})}
  </div>
}
