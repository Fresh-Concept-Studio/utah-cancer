import test from 'node:test';
import assert from 'node:assert/strict';
import {convert} from '../src/lib/cms-records.ts';
import {imageVariant, uploadedImageUrl} from '../src/lib/images.ts';
import {pageEditor} from '../src/lib/page-content.ts';
import {pageAddress} from '../studio/page-address.ts';

const imageUrl='https://cdn.sanity.io/images/spba0u9p/production/example-1020x1020.jpg';
test('uploaded images override repository paths through nested Sanity image fields', () => {
  const image=convert({_type:'legacyImage',src:'/images/location-tooele.jpg',alt:'Building C',asset:{_type:'image',asset:{url:imageUrl}}});
  assert.equal(image.src,imageUrl);
  assert.equal(image.alt,'Building C');
  const hero=new URL(imageVariant(image.src,1280,800));
  assert.equal(hero.pathname,'/images/spba0u9p/production/example-1020x1020.jpg');
  assert.equal(hero.searchParams.get('w'),'1280');
  assert.equal(hero.searchParams.get('h'),'800');
  assert.equal(imageVariant('/images/location-tooele.jpg',640,480),'/images/location-tooele-640.webp');
  assert.equal(imageVariant('https://example.com/photo.jpg',640),'https://example.com/photo.jpg');
});
test('a page edit overrides its field while other text and responsive image defaults survive', () => {
  const page=convert({component:'index',editorContent:[{_key:'test',key:'heading',value:'Updated heading'}],editorImages:[{_key:'photo',key:'hero',image:{_type:'legacyImage',src:'/images/hero-bg.webp',alt:'New image',asset:{asset:{url:imageUrl}}}}]});
  const editor=pageEditor(page);
  assert.equal(editor.text('heading','Original heading'),'Updated heading');
  assert.equal(editor.text('unrelated','Original paragraph'),'Original paragraph');
  assert.equal(editor.image('hero','/images/hero-bg.webp'),imageUrl);
  assert.equal(editor.imageAlt('hero',''),'New image');
  assert.equal(editor.imageChanged('hero','/images/hero-bg.webp'),true);
  assert.equal(editor.imageChanged('other','/images/other.webp'),false);
});
test('Studio links resolve to public pages and omit retired redirects', () => {
  assert.equal(pageAddress({_type:'page',path:'index.html'}),'/');
  assert.equal(pageAddress({_type:'page',path:'locations/index.html'}),'/locations/');
  assert.equal(pageAddress({_type:'provider',slug:{current:'test-provider'}}),'/providers/test-provider/');
  assert.equal(pageAddress({_type:'resourcePage',slug:{current:'housing'}}),'/housing/');
  assert.equal(pageAddress({_type:'page',path:'old.html',settings:{redirect:'/providers/'}}),undefined);
});

test('Studio crop and focal point survive responsive image sizing', () => {
  const original=uploadedImageUrl({asset:{url:imageUrl},crop:{left:0.1,right:0.1,top:0,bottom:0},hotspot:{x:0.6,y:0.4}})!;
  const sized=new URL(imageVariant(original,640,480));
  assert.equal(sized.searchParams.get('rect'),'102,0,816,1020');
  assert.equal(sized.searchParams.get('crop'),'focalpoint');
  assert.equal(sized.searchParams.get('fp-x'),'0.625');
  assert.equal(sized.searchParams.get('fp-y'),'0.4');
});
