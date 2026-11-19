/**
 * One-time migration: copy the published Sanity content into `content/` as JSON files.
 *
 * Reads Sanity only (published perspective); it never writes to or deletes from Sanity.
 * After the migration, `content/` is the source of truth, so this script refuses to run
 * when `content/` already exists. Re-running it would replace newer edits with Sanity's
 * older copy. Use `--out <dir>` to export somewhere else for comparison.
 *
 *   npx tsx scripts/export-sanity-to-repo.ts [--out <dir>]
 */
import {existsSync, mkdirSync, writeFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {collections, fetchSanityRecords, fileSlug, pageLists, settingsFile, type RecordType} from '../src/lib/content-sources'

const outIndex = process.argv.indexOf('--out')
const root = resolve(outIndex > -1 ? process.argv[outIndex + 1] : resolve(import.meta.dirname, '..', 'content'))
if (existsSync(root)) {
  console.error(`${root} already exists. Content there may be newer than Sanity; refusing to overwrite it.`)
  process.exit(1)
}

const records = await fetchSanityRecords()
const write = (file: string, value: unknown) => {
  mkdirSync(join(file, '..'), {recursive: true})
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

/** Write records one per file. Keep the Sanity order with an `order` field. */
function writeCollection(dir: string, items: any[], id: (record: any) => string) {
  const used = new Set<string>()
  items.forEach((record, index) => {
    if ('order' in record) throw new Error(`A ${dir} record already has an "order" field; choose another name for the sort field.`)
    let name = fileSlug(id(record))
    for (let n = 2; used.has(name); n++) name = `${fileSlug(id(record))}-${n}`
    used.add(name)
    write(join(root, dir, `${name}.json`), {order: index + 1, ...record})
  })
  return items.length
}

const counts: Record<string, number> = {}
for (const [field, list] of Object.entries(pageLists)) {
  const page = records.page.find((record) => record.path === list.page)
  if (!page) throw new Error(`No page at ${list.page} for ${field}`)
  counts[list.dir] = writeCollection(list.dir, page[field] || [], list.id)
  delete page[field]
}
for (const [type, {dir, id}] of Object.entries(collections)) counts[dir] = writeCollection(dir, records[type as RecordType], id)
if (records.siteSettings.length !== 1) throw new Error(`Expected one siteSettings document, found ${records.siteSettings.length}`)
write(join(root, settingsFile), records.siteSettings[0])

console.log(`Exported published Sanity content to ${root}`)
console.table(counts)
