/** Add editor fields without replacing existing documents. Dry run unless --apply is passed. */
import {createClient} from '@sanity/client';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {load} from 'cheerio';
import {runInNewContext} from 'node:vm';
const normalize=(value,index=0)=>Array.isArray(value)?value.map((item,i)=>typeof item==='object'&&item?{_key:`item-${i}`,...normalize(item,i)}:item):value&&typeof value==='object'?{...Object.fromEntries(Object.entries(value).map(([key,item])=>[key,normalize(item)])),...(value.src!==undefined&&value.alt!==undefined?{_type:'legacyImage'}:{})}:value;
const root=resolve(import.meta.dirname,'..');
const token=process.env.SANITY_WRITE_TOKEN || JSON.parse(readFileSync(`${process.env.HOME}/.config/sanity/config.json`,'utf8')).authToken;
const client=createClient({projectId:'spba0u9p',dataset:'production',apiVersion:'2026-09-21',token,useCdn:false,perspective:'raw'});
const defaults=JSON.parse(readFileSync(resolve(root,'src/data/page-content.json'),'utf8'));
const all=await client.fetch('*[!(_id in path("_.**"))]');
const docs=all.filter(d=>d._type==='page');
const additions=[
 {_id:'page-articles-index-html',_type:'page',path:'articles/index.html',title:'News | Utah Cancer Specialists',settings:{_type:'pageSettings',component:'news-index',bodyClass:'news-page',styles:['/styles.css','/page-styles/news.css'],scripts:[],marquee:false}},
 {_id:'page-supportive-resources-index-html',_type:'page',path:'supportive-resources/index.html',title:'Supportive Resources for Cancer Patients | Utah Cancer Specialists',settings:{_type:'pageSettings',component:'supportive-resources',bodyClass:'resource-page',styles:['/styles.css','/provider.css','/page-styles/resource-detail.css'],scripts:[],marquee:false}},
].filter(d=>!docs.some(existing=>existing.path===d.path));
const operations=[];
for(const doc of [...docs,...additions]){
 const content=defaults[doc.settings?.component];if(!content)continue;
 const path=doc.path==='index.html'?'':doc.path.replace(/index\.html$/,'').replace(/\.html$/,'/');
 const response=await fetch(`https://utahcancer.com/${path}`);if(!response.ok)throw Error(`Cannot read live metadata for ${path}`);
 const $=load(await response.text());
 const fields={...content,...(doc.settings?.component==='careers'?{jobs:normalize(JSON.parse(readFileSync(resolve(root,'src/data/jobs.json'),'utf8'))).map(job=>({...job,_type:'jobOpening'}))}:{}),seoTitle:$('title').text(),description:$('meta[name="description"]').attr('content')};
 const missing=Object.fromEntries(Object.entries(fields).filter(([key,value])=>doc[key]===undefined && value!==undefined));
 const append=Object.fromEntries(['editorContent','editorImages'].filter(key=>Array.isArray(doc[key])).map(key=>[key,content[key].filter(item=>!doc[key].some(existing=>(existing.key||existing._key)===item.key))]).filter(([,items])=>items.length));
 if(Object.keys(missing).length||Object.keys(append).length)operations.push({doc,missing,append,isNew:!doc._rev});
}
const settings=all.find(doc=>doc._id==='siteSettings');
const groups=normalize(JSON.parse(readFileSync(resolve(root,'src/data/leadership-groups.json'),'utf8'))).map(group=>({...group,_type:'leadershipGroup',cards:group.cards.map(({provider,leader,...card})=>({...card,_type:'leadershipMember',...(provider||leader?{profile:{_type:'reference',_ref:`${provider?'provider':'leader'}-${provider||leader}`}}:{})}))}));
const mediaSource=readFileSync(resolve(root,'src/data/media.ts'),'utf8').replace('export const mediaHighlights =','').trim().replace(/;$/,'');
const media=normalize(runInNewContext(`(${mediaSource})`)).map(video=>({...video,_type:'mediaVideo',photo:{_type:'legacyImage',src:`/images/media/${video.id}.jpg`,alt:video.title}}));
if(settings){const missing=Object.fromEntries(Object.entries({leadershipGroups:groups,mediaHighlights:media}).filter(([key])=>settings[key]===undefined));if(Object.keys(missing).length)operations.push({doc:settings,missing,append:{},isNew:false});}
console.log(JSON.stringify({mode:process.argv.includes('--apply')?'apply':'dry run',documents:operations.map(({doc,missing,append,isNew})=>({id:doc._id,isNew,fields:Object.keys(missing),append:Object.fromEntries(Object.entries(append).map(([key,items])=>[key,items.length])),textFields:missing.editorContent?.length,images:missing.editorImages?.length}))},null,2));
if(process.argv.includes('--apply')){
 const folder=`${process.env.HOME}/.codex/backups/utah-cancer`;mkdirSync(folder,{recursive:true,mode:0o700});
 const file=`${folder}/before-page-editor-${Date.now()}.json`;writeFileSync(file,JSON.stringify(all,null,2),{mode:0o600});
 let transaction=client.transaction();
 for(const {doc,missing,append,isNew} of operations){
  if(isNew)transaction=transaction.createIfNotExists({...doc,...missing});
  else transaction=transaction.patch(doc._id,p=>{let patch=p.ifRevisionId(doc._rev);if(Object.keys(missing).length)patch=patch.setIfMissing(missing);for(const [field,items] of Object.entries(append))patch=patch.insert('after',`${field}[-1]`,items);return patch;});
 }
 if(operations.length)await transaction.commit();
 console.log(`Added missing editor fields to ${operations.length} records. Backup: ${file}`);
}
