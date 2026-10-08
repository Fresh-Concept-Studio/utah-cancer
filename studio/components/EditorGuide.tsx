import {useEffect, useState} from 'react'
import {useClient, useFormValue, type StringInputProps} from 'sanity'
import {IntentLink} from 'sanity/router'
import {pageAddress} from '../page-address'
import './editor.css'

const sharedForPage: Record<string,string[]>={
  'index': [],
  'providers-index': ['provider'], 'locations-index': ['location'], 'specialties-index': ['specialty'],
  leadership: ['leader'], about: ['leader'], 'news-index': ['newsArticle'],
  'supportive-resources': ['resourcePage'], 'patient-resources': ['resourcePage'],
}
export function EditorNotice(_props: StringInputProps) {
  const doc=useFormValue([]) as any
  const path=pageAddress(doc)
  const type=doc?._type
  return <div className="ucs-editor"><p>
    {path && <><a href={`https://utahcancer.com${path}`} target="_blank" rel="noreferrer">Open this page on the website ↗</a><br /></>}
    {type==='page' ? 'Edit the sections below. For profiles or other shared items shown on this page, open “Related content” above.' : 'Changes here update this profile and the directories that use it. Open “Related content” for shared contact cards.'}
    <br />Changes save as a draft. Click <strong>Publish</strong> when ready. Allow a few minutes for the website to rebuild, then refresh the public page.
  </p></div>
}
export function StartHere() {
  return <article className="ucs-guide">
    <h1>Edit your website</h1>
    <p>Start with the page you want to change.</p>
    <ol><li>Open <strong>Website pages</strong> and find the page by name. Use the search button at the top to find a provider, clinic, or phrase.</li><li>Open the page and edit its text, images, or contact information. Main pages organize text into sections in website order.</li><li>Your changes save as a <strong>draft</strong>. Click <strong>Publish</strong> when the changes are ready for everyone to see.</li><li>Wait a few minutes, then use <strong>Open this page on the website</strong> and refresh to check the result.</li></ol>
    <div className="ucs-note"><strong>One record can appear in several places.</strong> A provider profile or clinic may also appear in a directory. Edit its record once. The <strong>Related content</strong> tab shows the records connected to a page.</div>
    <h2>Common edits</h2>
    <ul><li><strong>Homepage or About text:</strong> Website Pages → the page → Page content.</li><li><strong>Provider bio or headshot:</strong> Providers → the person → Profile.</li><li><strong>Job postings:</strong> Job Listings → add, edit, or remove an opening → Publish.</li><li><strong>Clinical trials:</strong> Clinical Trials → create or open a study → edit its fields → Publish. Use Unpublish or Delete in the document menu to remove a study from the website.</li><li><strong>Clinic photo:</strong> Locations → the clinic → Clinic image.</li><li><strong>Search result text:</strong> Open the page → Search appearance.</li><li><strong>Clinic contact information:</strong> Edit the location’s page details and directory card. Check Related content for provider contact cards that also show that clinic.</li></ul>
    <h2>Images</h2><p>Open an image, upload a replacement, and add a short image description. The replacement is published with the rest of that page.</p>
    <h2>Drafts and the public website</h2><p>The Published website tab shows what visitors can see now. It does not preview unpublished changes. Publishing starts the website rebuild; it is not immediate. If an update has not appeared after several minutes, contact Fresh Concept so we can check publishing.</p>
    <h2>When to contact Fresh Concept</h2><p>For new page layouts, navigation changes, new form fields, or removing a page, contact Fresh Concept. Page addresses stay locked to protect existing links. Enter public website content only; never enter patient information or form submissions.</p>
    <p><a href="https://utahcancer.com" target="_blank" rel="noreferrer">Open the website ↗</a></p>
  </article>
}
export function PublishedPage({document}: any) {
  const path=pageAddress(document.displayed)
  if(!path)return <div className="ucs-guide">This shared record appears on other pages. Use Related content to find where it is used.</div>
  return <div style={{height:'100%',display:'flex',flexDirection:'column'}}><div className="ucs-guide" style={{padding:16,margin:0}}><p>This is the <strong>published website</strong>, not a draft preview. Publishing may take a few minutes. <a href={`https://utahcancer.com${path}`} target="_blank" rel="noreferrer">Open in a new tab ↗</a></p></div><iframe title="Published website" src={`https://utahcancer.com${path}`} style={{border:0,flex:1,minHeight:550,width:'100%'}} /></div>
}
export function RelatedContent({document}: any) {
  const doc=document.displayed
  const client=useClient({apiVersion:'2026-09-21'})
  const [rows,setRows]=useState<any[]>([])
  const [error,setError]=useState('')
  useEffect(()=>{
    let active=true
    const types=sharedForPage[doc?.settings?.component] || []
    const key=doc?.key || doc?.slug?.current || ''
    const ids=(doc?.locationIds||[]).map((id:string)=>`providerLocation-${id}`)
    if(doc?.sidebar)ids.push(`sharedContent-${doc.sidebar}`)
    if(['index','leadership','about'].includes(doc?.settings?.component)||doc?._type==='provider')ids.push('siteSettings')
    client.fetch(`*[_type in $types || _id in $ids || (_type == "provider" && ($key in locationIds || sidebar == $key)) || (_type == "providerLocation" && (key == $key || name == $name)) || (_type == "location" && (slug.current == $key || title == $name))] | order(name asc, title asc){_id,_type,name,title,key,slug,path}`,{types,ids,key,name:doc?.title || doc?.name || ''}).then(result=>{if(active){setRows(result.filter((r:any)=>r._id!==doc?._id));setError('')}}).catch(()=>{if(active)setError('Related content could not be loaded. Use the main navigation to find it.')})
    return()=>{active=false}
  },[client,doc?._id,doc?.settings?.component,doc?.sidebar,JSON.stringify(doc?.locationIds),doc?.title,doc?.name,doc?.key,doc?.slug?.current])
  return <article className="ucs-guide"><h1>Related content</h1><p>These records supply content to this page or use the same clinic or shared contact information. Each record has its own draft and Publish button.</p>
    {doc?._type==='location'&&<p className="ucs-note">The clinic page, its directory card, and provider contact cards have separate contact fields. Review each linked card when an address or phone number changes.</p>}
    {error && <p role="alert">{error}</p>}
    {rows.map(row=><IntentLink className="ucs-related" key={row._id} intent="edit" params={{id:row._id,type:row._type}}>{row._type === 'siteSettings' ? 'Leadership directory, media & shared contact settings' : row.name || row.title || row.key}<small>{pageAddress(row) || (row._type==='providerLocation'?'Contact card on provider pages':'Shared page content')}</small></IntentLink>)}
    {!error&&!rows.length&&<p>This page has no linked profile records. Its own text and images are in the Edit tab.</p>}
  </article>
}

export function PageDirectory() {
  const client=useClient({apiVersion:'2026-09-21'})
  const [rows,setRows]=useState<any[]>([])
  const [query,setQuery]=useState('')
  const [kind,setKind]=useState('all')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const labels: Record<string,string>={page:'Main page', provider:'Provider', location:'Location', specialty:'Cancer type', leader:'Leadership', policy:'Legal & privacy', newsArticle:'News', resourcePage:'Resource'}
  useEffect(()=>{let active=true;client.fetch('*[_type in ["page","provider","location","specialty","leader","policy","newsArticle","resourcePage"] && !defined(settings.redirect)]{_id,_type,title,name,path,slug,settings{redirect}}').then(result=>{
    if(!active)return
    const unique=new Map<string,any>();for(const row of result){const id=row._id.replace(/^drafts\./,'');if(!unique.has(id)||row._id.startsWith('drafts.'))unique.set(id,{...row,_id:id})}
    setRows([...unique.values()].map(row=>({...row,label:row.path==='index.html'?'Home':(row.name || row.title || row.path || '').replace(/\s*[-|]\s*Utah Cancer Specialists$/,'')})).sort((a,b)=>a.path==='index.html'?-1:b.path==='index.html'?1:a.label.localeCompare(b.label)))
    setLoading(false)
  }).catch(()=>{if(active){setError('Could not load the page directory. Refresh or use the lists in the left navigation.');setLoading(false)}});return()=>{active=false}},[client])
  const visible=rows.filter(row=>(kind==='all'||row._type===kind)&&`${row.label} ${pageAddress(row)||''}`.toLowerCase().includes(query.toLowerCase()))
  return <article className="ucs-guide ucs-editor" style={{maxWidth:960}}><h1>Website pages</h1><p>Find the page you want to change, then click its name. Text, images, and search settings are inside each page.</p>
    <label className="ucs-field"><span>Find a page</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Page name, provider, clinic, or website address…" /></label>
    <label className="ucs-field"><span>Show</span><select aria-label="Page type" value={kind} onChange={e=>setKind(e.target.value)} style={{font:'inherit',padding:10,background:'transparent',color:'inherit',border:'1px solid #89949d66',borderRadius:5}}><option value="all">All website pages</option>{Object.entries(labels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    {loading?<p>Loading website pages…</p>:error?<p role="alert">{error}</p>:<><p>{visible.length} pages</p>{visible.map(row=><IntentLink className="ucs-related" key={row._id} intent="edit" params={{id:row._id,type:row._type}}><strong>{row.label}</strong><small>{labels[row._type]} · {pageAddress(row)}</small></IntentLink>)}{!visible.length&&<p>No pages match that search.</p>}</>}
  </article>
}
