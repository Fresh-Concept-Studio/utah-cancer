/** One-time, revision-guarded CMS correction based on the September 17 legacy archive. Dry run by default. */
import {createClient} from '@sanity/client'
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'

const phoneByKey = {
  'intermountain-medical-center': '8012633416',
  'timpanogos-regional-hospital': '3852412293',
  'salt-lake-clinic': '3853475500',
  'bountiful-clinic': '8012966665',
  'lakeview-hospital-campus': '8012966665',
  'jordan-valley-cancer-center': '8015628732',
  'holy-cross-hospital': '8015628732',
  'timpanogos-clinic': '3852412293',
  'utah-valley-hospital': '3853752700',
  'layton-clinic': '8015253022',
  'davis-hospital-campus': '8015253022',
  'cancer-center': '8012690231',
  'granger-fairbourne-station-clinic': '8015909900',
  'radiation-oncology': '8012816860',
  'ucs-cancer-center': '8012690231',
  'intermountain-medical-center-bldg-3': '8012633416',
  'intermountain-medical-center-campus': '8012633416',
  'south-jordan-clinic': null,
  'bountiful-clinic-2': '8012966665',
  'ogden-clinic': '3854232855',
  'timpanogos-regional-hospital-2': '8018520210',
  'st-mark-s-hospital': '8014568401',
  'holy-cross-davis-hospital': '8018077777',
  'start-at-granger-faibourne-station': '8019074750',
  'start-mountain-region-clinical-trials': '8019074750',
  'ucs-at-granger-fairbourne-station': '8019074750',
  'pleasant-grove-clinic': '8014929934',
  'jordan-valley-cancer-center-2': '8016012260',
  'murray-clinic': '8012633416',
  'tooele-clinic': '4358822365',
  'salt-lake-clinic-2': '3853475500',
}

const remoteClinics = {
  'bingham-healthcare': ['Bingham Healthcare', '978 Poplar Street, 3rd Floor<br>Blackfoot, ID 83221', '2087853800'],
  'eastern-idaho-regional-medical-center': ['Eastern Idaho Regional Medical Center', '3245 Channing Way<br>Idaho Falls, ID 83404', '2082272790'],
  'madison-health': ['Madison Health', '450 East Main Street<br>Rexburg, ID 83440', '2083599848'],
  'steel-memorial': ['Steele Memorial Medical Center', '805 Main St<br>Salmon, ID 83467', '2087565762'],
  'teton-valley-health-care': ['Teton Valley Health Care', '120 East Howard Avenue<br>Driggs, ID 83422', '2083546354'],
}

const providerLocations = {
  'benjamin-solomon': ['jordan-valley-cancer-center'],
  'brighton-loveday': ['timpanogos-regional-hospital', 'utah-valley-hospital'],
  'brittany-weed': ['layton-clinic'],
  'daniel-miller': ['eastern-idaho-regional-medical-center'],
  'deborah-hatch': ['cancer-center', 'bountiful-clinic-2'],
  'douglas-holt': ['eastern-idaho-regional-medical-center', 'st-mark-s-hospital', 'timpanogos-regional-hospital-2'],
  'greg-litton': ['intermountain-medical-center-campus', 'eastern-idaho-regional-medical-center'],
  'gregory-chipman': ['pleasant-grove-clinic', 'timpanogos-regional-hospital'],
  'hyrum-prestwich': ['eastern-idaho-regional-medical-center'],
  'hyatt-reed': ['jordan-valley-cancer-center'],
  'james-shortridge': ['jordan-valley-cancer-center'],
  'jason-stinnett': ['layton-clinic'],
  'makaylie-crowther': ['bingham-healthcare'],
  'robert-isaak': ['eastern-idaho-regional-medical-center'],
  'sunita-sigdel': ['eastern-idaho-regional-medical-center'],
  'tylan-magnusson': ['eastern-idaho-regional-medical-center'],
  'wayne-ormsby': ['bountiful-clinic-2', 'salt-lake-clinic-2'],
  'william-nibley': ['bingham-healthcare', 'madison-health', 'teton-valley-health-care', 'steel-memorial', 'eastern-idaho-regional-medical-center'],
}

const display = digits => `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
const phoneHtml = digits => `<span class="material-symbols-rounded">phone</span> ${display(digits)}`
const token = process.env.SANITY_WRITE_TOKEN || JSON.parse(readFileSync(`${process.env.HOME}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: 'spba0u9p', dataset: 'production', apiVersion: '2026-09-21', token, useCdn: false, perspective: 'raw'})
const docs = await client.fetch('*[_type in ["provider", "providerLocation"]]')
const byId = new Map(docs.map(doc => [doc._id, doc]))
const drafts = docs.filter(doc => doc._id.startsWith('drafts.'))
if (drafts.length) throw Error(`Review ${drafts.length} provider or clinic drafts before editing`)

const changes = []
for (const [key, phone] of Object.entries(phoneByKey)) {
  const doc = byId.get(`providerLocation-${key}`)
  if (!doc) throw Error(`Missing clinic ${key}`)
  const action = doc.actions?.find(item => item.href?.startsWith('tel:'))
  if (!action) throw Error(`Missing phone action for ${key}`)
  const old = action.href.replace(/^tel:/, '')
  if (old !== phone || (phone && action.html !== phoneHtml(phone))) changes.push({kind: 'phone', doc, key, action, old, phone})
}
for (const [slug, ids] of Object.entries(providerLocations)) {
  const doc = byId.get(`provider-${slug}`)
  if (!doc) throw Error(`Missing provider ${slug}`)
  if (JSON.stringify(doc.locationIds || []) !== JSON.stringify(ids)) changes.push({kind: 'provider', doc, slug, old: doc.locationIds || [], ids})
}
for (const [key, [name, addressHtml, phone]] of Object.entries(remoteClinics)) {
  if (byId.has(`providerLocation-${key}`)) throw Error(`Clinic ${key} already exists; review before retrying`)
  changes.push({kind: 'create', key, name, addressHtml, phone})
}
const allKeys = new Set([...Object.keys(phoneByKey), ...Object.keys(remoteClinics)])
for (const change of changes.filter(item => item.kind === 'provider')) {
  for (const key of change.ids) if (!allKeys.has(key)) throw Error(`Unknown clinic ${key}`)
}
console.log(JSON.stringify({mode: process.argv.includes('--apply') ? 'apply' : 'dry run', changes: changes.map(({kind, key, slug, old, phone, ids}) => ({kind, key: key || slug, old, phone, ids}))}, null, 2))

if (process.argv.includes('--apply')) {
  const folder = `${process.env.HOME}/.codex/backups/utah-cancer`
  mkdirSync(folder, {recursive: true, mode: 0o700})
  writeFileSync(`${folder}/before-provider-calls-${Date.now()}.json`, JSON.stringify(changes.filter(item => item.doc).map(item => item.doc), null, 2), {mode: 0o600})
  let transaction = client.transaction()
  for (const change of changes) {
    if (change.kind === 'phone') {
      const path = `actions[_key=="${change.action._key}"]`
      transaction = transaction.patch(change.doc._id, patch => {
        patch = patch.ifRevisionId(change.doc._rev)
        return change.phone === null ? patch.unset([path]) : patch.set({[`${path}.href`]: `tel:${change.phone}`, [`${path}.html`]: phoneHtml(change.phone)})
      })
    } else if (change.kind === 'provider') {
      transaction = transaction.patch(change.doc._id, patch => patch.ifRevisionId(change.doc._rev).set({locationIds: change.ids}))
    } else {
      transaction = transaction.createIfNotExists({
        _id: `providerLocation-${change.key}`, _type: 'providerLocation', key: change.key,
        name: change.name, sublabel: '', addressHtml: change.addressHtml,
        actions: [{_key: 'phone', _type: 'contentLink', class: 'location-card-link', href: `tel:${change.phone}`, html: phoneHtml(change.phone)}],
      })
    }
  }
  if (changes.length) await transaction.commit()
  const confirmed = await client.fetch('*[_type in ["provider", "providerLocation"]]{_id,_type,_rev,key,locationIds,actions,name,addressHtml,sublabel}')
  for (const change of changes) {
    const doc = confirmed.find(item => item._id === (change.doc?._id || `providerLocation-${change.key}`))
    if (!doc) throw Error(`Could not confirm ${change.key || change.slug}`)
    if (change.kind === 'provider' && JSON.stringify(doc.locationIds) !== JSON.stringify(change.ids)) throw Error(`Provider confirmation failed: ${change.slug}`)
    if (change.kind === 'phone' && change.phone && !doc.actions.some(item => item.href === `tel:${change.phone}`)) throw Error(`Phone confirmation failed: ${change.key}`)
    if (change.kind === 'phone' && change.phone === null && doc.actions.some(item => item.href?.startsWith('tel:'))) throw Error(`Phone removal failed: ${change.key}`)
    if (change.kind === 'create' && !doc.actions.some(item => item.href === `tel:${change.phone}`)) throw Error(`Clinic creation failed: ${change.key}`)
  }
  console.log(`Confirmed ${changes.length} CMS changes`)
}
