import {useEffect, useMemo, useState} from 'react'
import {diffMatchPatch, set, useClient, type ArrayOfObjectsInputProps, type ArrayOfPrimitivesInputProps, type StringInputProps, type TextInputProps} from 'sanity'
import {makePatches, stringifyPatches} from '@sanity/diff-match-patch'
import './editor.css'

export function PageCopyInput(props: ArrayOfObjectsInputProps) {
  const {value = [], onChange, readOnly} = props
  const [search, setSearch] = useState('')
  const groups = new Map<string, any[]>()
  for (const item of value as any[]) {
    if (search && !`${item.section} ${item.label} ${item.value}`.toLowerCase().includes(search.toLowerCase())) continue
    const section = (item.section || 'Page content').replace(/([.!?])(?=[A-Z])/g, '$1 ').replace(/^Hero cards$/, 'Quick links').replace(/^Foundation section$/, 'Foundation')
    groups.set(section, [...(groups.get(section) || []), item])
  }
  return <div className="ucs-editor">
    <p>Sections follow the page from top to bottom. Edit the words or link destinations below; the page layout stays in place.</p>
    <input aria-label="Find text on this page" placeholder="Find text on this page…" value={search} onChange={e => setSearch(e.target.value)} />
    {[...groups].map(([section, items], index) => <details key={section} open={search ? true : undefined}>
      <summary>{section} <small>({items.length})</small></summary>
      {items.map(item => <label key={item._key} className="ucs-field"><span>{item.label}</span>
        {['link','number'].includes(item.kind) ? <input type={item.kind === 'number' ? 'number' : 'text'} min={item.kind === 'number' ? 0 : undefined} aria-label={item.label} readOnly={readOnly} value={item.value || ''} onChange={e => onChange(set(e.target.value, [{_key: item._key}, 'value']))} /> :
        <textarea aria-label={`${item.label}: ${item.value?.trim().slice(0,40) || 'Empty'}`} rows={item.value?.length > 130 ? 4 : 2} readOnly={readOnly} value={item.value || ''} onChange={e => onChange(set(e.target.value, [{_key: item._key}, 'value']))} />}
      </label>)}
    </details>)}
    {!value.length && <p>Page content fields have not been prepared for this page yet.</p>}
    {search && !groups.size && <p>No text matches your search.</p>}
  </div>
}

// Edit text nodes and links without asking editors to manipulate the layout's HTML.
// A string diff preserves other editors' changes better than replacing the entire field.
export function ReadableHtmlInput(props: TextInputProps | StringInputProps) {
  const {value = '', onChange, readOnly} = props
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const parsed = useMemo(() => {
    if (!ready) return null
    const doc = new DOMParser().parseFromString(value, 'text/html')
    for (const element of doc.body.querySelectorAll('p,h1,h2,h3,h4,h5,li,a')) {
      if (!element.childNodes.length) element.appendChild(doc.createTextNode(' '))
    }
    const nodes: {node: Text; label: string}[] = []
    const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
    while (walk.nextNode()) {
      const node = walk.currentNode as Text
      if ((!node.textContent?.trim() && node.parentElement?.childNodes.length !== 1) || node.parentElement?.closest('script,style,.material-symbols-rounded,[aria-hidden="true"]')) continue
      const parent = node.parentElement
      nodes.push({node, label: parent?.closest('h1,h2,h3,h4,h5') ? 'Heading' : parent?.closest('a') ? 'Link label' : parent?.closest('li') ? 'List item' : 'Text'})
    }
    return {doc, nodes, links: [...doc.body.querySelectorAll('a[href]')]}
  }, [value, ready])
  function save(next: string) {
    if (next !== value) onChange(value ? diffMatchPatch(stringifyPatches(makePatches(value, next))) : set(next))
  }
  if (!parsed) return <p>Loading content…</p>
  return <div className="ucs-editor">
    {parsed.nodes.map(({node, label}, index) => <label key={index} className="ucs-field"><span>{label} {parsed.nodes.length > 1 ? index + 1 : ''}</span>
      <textarea rows={(node.textContent?.length || 0) > 130 ? 4 : 2} aria-label={`${label} ${index + 1}`} readOnly={readOnly} value={node.textContent || ''} onChange={e => {
        node.textContent = e.target.value
        save(parsed.doc.body.innerHTML)
      }} />
    </label>)}
    {parsed.links.length > 0 && <details><summary>Link destinations</summary>{parsed.links.map((link, index) => <label key={index} className="ucs-field"><span>{link.textContent?.trim() || 'Link'}</span><input aria-label={`Destination ${index + 1}`} readOnly={readOnly} value={link.getAttribute('href') || ''} onChange={e => {
      const href=e.target.value
      if (/^\s*(javascript|data|vbscript):/i.test(href)) return
      link.setAttribute('href', href); save(parsed.doc.body.innerHTML)
    }} /></label>)}</details>}
    {!readOnly && ['Content', 'Page content'].includes(props.schemaType.title || '') && <button type="button" onClick={() => {
      const paragraph=parsed.doc.createElement('p');paragraph.className='provider-bio';paragraph.textContent='New paragraph';parsed.doc.body.append(paragraph);save(parsed.doc.body.innerHTML)
    }}>Add paragraph</button>}
    {!parsed.nodes.length && <label className="ucs-field"><span>Text</span><textarea aria-label="Text" rows={3} readOnly={readOnly} value="" onChange={e => {const container=parsed.doc.createElement('div');container.textContent=e.target.value;save(container.innerHTML)}} /></label>}
  </div>
}

export function LocationChoicesInput(props: ArrayOfPrimitivesInputProps) {
  const client = useClient({apiVersion: '2026-09-21'})
  const [choices, setChoices] = useState<any[]>([])
  useEffect(() => {let active=true;client.fetch('*[_type == "providerLocation"] | order(name asc){key,name,sublabel,addressHtml}').then(rows=>{if(active)setChoices(rows)});return()=>{active=false}}, [client])
  const selected=(props.value || []) as string[]
  return <div className="ucs-editor"><p>Select the clinics shown on this provider’s page.</p>{choices.map(choice=><label key={choice.key} className="ucs-choice"><input type="checkbox" checked={selected.includes(choice.key)} disabled={props.readOnly} onChange={e=>props.onChange(set(e.target.checked?[...selected,choice.key]:selected.filter(key=>key!==choice.key)))} /><span>{choice.name}{choice.sublabel ? ` — ${choice.sublabel}` : ''}{choice.addressHtml && <small style={{display:'block'}}>{choice.addressHtml.replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '')}</small>}</span></label>)}</div>
}

export function ExistingImageInput(props: import('sanity').ObjectInputProps) {
  const value=props.value as any
  const src=value?.src?.startsWith('/') ? `https://utahcancer.com${value.src}` : value?.src
  return <div className="ucs-editor">
    {!value?.asset && src && <div style={{marginBottom:16}}><img src={src} alt={value?.alt || 'Current image'} style={{display:'block',maxWidth:'100%',maxHeight:220,borderRadius:6,objectFit:'contain'}} /><p>Current website image. Upload a replacement below to change it.</p></div>}
    {props.renderDefault(props)}
  </div>
}
