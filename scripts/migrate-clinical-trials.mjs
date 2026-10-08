/** Split current Sanity page copy into independent trials. Dry run by default.
 * --apply creates missing records; --cleanup removes migrated page fields after deployment.
 */
import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const token=process.env.SANITY_WRITE_TOKEN || JSON.parse(readFileSync(`${process.env.HOME}/.config/sanity/config.json`,'utf8')).authToken;
const client=createClient({projectId:'spba0u9p',dataset:'production',apiVersion:'2026-09-21',token,useCdn:false,perspective:'raw'});
const mapping=JSON.parse(readFileSync(new URL('./migrations/clinical-trial-fields.json',import.meta.url),'utf8'));
const docs=await client.fetch('*[_type == "clinicalTrial" || _id in ["page-late-phase-trials-html", "drafts.page-late-phase-trials-html"]]');
const page=docs.find(d=>d._id==='page-late-phase-trials-html');
const draft=docs.find(d=>d._id==='drafts.page-late-phase-trials-html');
if(!page)throw Error('Published trials page not found');
const values=d=>new Map((d.editorContent||[]).map(i=>[i.key||i._key,i.value]));
const published=values(page);const draftValues=draft&&values(draft);
const legacyKeys=new Set([...mapping.flatMap(m=>Object.values(m.keys)),'text-441ef24964']);
if(draft && ([...legacyKeys].some(k=>draftValues.get(k)!==published.get(k)) || JSON.stringify(draft.retiredTrials)!==JSON.stringify(page.retiredTrials)))throw Error('Draft edits affect trial fields. Resolve those edits before migrating.');
const records=mapping.filter(m=>!(page.retiredTrials||[]).includes(m.nctId)).map((m,index)=>{
 const fields=Object.fromEntries(Object.entries(m.keys).map(([name,key])=>{if(!published.has(key))throw Error(`Missing live CMS value ${key}`);return [name,published.get(key).trim()];}));
 const {phoneHref,emailHref,protocol,...content}=fields;
 if(phoneHref.replace(/^tel:/,'').replace(/[^+\d]/g,'')!==content.phone.replace(/[^+\d]/g,''))throw Error(`Phone label differs from destination: ${m.nctId}`);
 if(emailHref!==`mailto:${content.email}`)throw Error(`Email label differs from destination: ${m.nctId}`);
 if(protocol!==`Protocol: ${m.nctId}`)throw Error(`Protocol changed: ${m.nctId}`);
 return {_id:`clinicalTrial-${m.nctId.toLowerCase()}`,_type:'clinicalTrial',nctId:m.nctId,...content,sortOrder:index};
});
const missing=records.filter(record=>!docs.some(d=>d._type==='clinicalTrial' && (d.nctId===record.nctId||d._id.replace(/^drafts\./,'')===record._id)));
for(const record of records){const existing=docs.find(d=>d._id===record._id);if(existing && Object.keys(record).some(k=>JSON.stringify(existing[k])!==JSON.stringify(record[k])))throw Error(`Existing trial differs: ${record.nctId}; preserve and review it before cleanup.`);if(docs.some(d=>d._id===`drafts.${record._id}`))throw Error(`Existing trial draft: ${record.nctId}`);}
console.log(JSON.stringify({mode:process.argv.includes('--apply')?'apply':process.argv.includes('--cleanup')?'cleanup':'dry run',draftPresent:Boolean(draft),create:missing.map(d=>({id:d._id,title:d.title,cancerType:d.cancerType})),remaining:records.length,legacyFields:page.editorContent.filter(i=>legacyKeys.has(i.key||i._key)).length},null,2));
if(process.argv.includes('--apply')||process.argv.includes('--cleanup')){
 const folder=`${process.env.HOME}/.codex/backups/utah-cancer`;mkdirSync(folder,{recursive:true,mode:0o700});
 const backup=await client.fetch('*[!(_id in path("_.**"))]');writeFileSync(`${folder}/before-trial-records-${Date.now()}.json`,JSON.stringify(backup,null,2),{mode:0o600});
 let tx=client.transaction();
 if(process.argv.includes('--apply')){tx=tx.patch(page._id,p=>p.ifRevisionId(page._rev).set({trialRecordsMigrated:true}));for(const record of missing)tx=tx.create(record);}
 else {
  if(missing.length)throw Error('Create trial records before cleanup');
  for(const source of [page,draft].filter(Boolean)){
   const paths=source.editorContent.filter(i=>legacyKeys.has(i.key||i._key)).map(i=>`editorContent[_key==${JSON.stringify(i._key)}]`);
   tx=tx.patch(source._id,p=>p.ifRevisionId(source._rev).unset([...paths,'retiredTrials']));
  }
 }
 await tx.commit();
 if(process.argv.includes('--cleanup')){
  for(const source of [page,draft].filter(Boolean)){
   const cleaned=await client.getDocument(source._id);
   const expected=source.editorContent.filter(i=>!legacyKeys.has(i.key||i._key));
   if(cleaned.retiredTrials!==undefined||JSON.stringify(cleaned.editorContent)!==JSON.stringify(expected))throw Error(`Page cleanup verification failed: ${source._id}`);
  }
  const fallbackPath=new URL('../src/data/page-content.json',import.meta.url);
  const fallback=JSON.parse(readFileSync(fallbackPath,'utf8'));
  fallback['late-phase-trials'].editorContent=fallback['late-phase-trials'].editorContent.filter(i=>!legacyKeys.has(i.key||i._key));
  writeFileSync(fallbackPath,JSON.stringify(fallback,null,2)+'\n');
 }
 const confirmed=await client.fetch('*[_type=="clinicalTrial" && !(_id in path("drafts.**"))]');
 for(const record of records){const actual=confirmed.find(d=>d._id===record._id);if(!actual||Object.keys(record).some(k=>JSON.stringify(record[k])!==JSON.stringify(actual[k])))throw Error(`Verification failed for ${record.nctId}`);}
 writeFileSync(new URL('../src/data/clinical-trials.json',import.meta.url),JSON.stringify(confirmed.map(({_id,_rev,_type,_createdAt,_updatedAt,...r})=>r),null,2)+'\n');
 console.log(`Confirmed ${confirmed.length} published trial records; saved development fallback from live CMS.`);
}
