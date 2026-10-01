import {useEffect} from 'react'
import {type ObjectInputProps} from 'sanity'
import {usePaneRouter} from 'sanity/structure'

/** A focused view of the existing Careers document, using Sanity's native form. */
export function JobListingsInput(props: ObjectInputProps) {
  const {routerPanesState} = usePaneRouter()
  const jobsOnly = props.value?._id?.replace(/^drafts\./, '') === 'page-careers-html'
    && routerPanesState.some(group => group.some(pane => pane.id === 'job-listings'))
  const jobsSelected = props.groups.some(group => group.name === 'jobs' && group.selected)
  const {onFieldGroupSelect} = props

  useEffect(() => {
    if (jobsOnly && !jobsSelected) onFieldGroupSelect('jobs')
  }, [jobsOnly, jobsSelected, onFieldGroupSelect])

  if (!jobsOnly) return props.renderDefault(props)

  return <div>
    <div className="ucs-editor">
      <h2>Job Listings</h2>
      <p>Click a listing to edit its description. Use <strong>Add item</strong> for a new opening, or a listing’s menu to remove it. Drag listings to change their order.</p>
      <p>Changes save as a draft. Click <strong>Publish</strong> when ready, then allow a few minutes for the website to update.</p>
      <p><a href="https://utahcancer.com/careers/" target="_blank" rel="noreferrer">View current jobs on the website ↗</a></p>
      <p className="ucs-note">These listings share the Careers page’s draft. Publishing also includes any other unpublished changes to that page.</p>
    </div>
    {props.renderDefault({...props, groups: [], members: props.members.filter(member => member.kind === 'field' && member.name === 'jobs')})}
  </div>
}
