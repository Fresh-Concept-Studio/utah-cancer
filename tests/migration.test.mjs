import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { files, fingerprints, hash } from './helpers.mjs';
const baseline = JSON.parse(fs.readFileSync('tests/published-baseline.json','utf8'));

test('Astro preserves every published URL, page text, metadata, structure, and destination', () => {
  assert.deepEqual(files('dist').filter(p=>p.endsWith('.html')),Object.keys(baseline.pages).sort());
  const differences=[];
  for (const [file,expected] of Object.entries(baseline.pages)) {
    const actual=fingerprints(fs.readFileSync('dist/'+file,'utf8'),file);
    for (const key of Object.keys(expected)) if(actual[key]!==expected[key]) differences.push(`${file}: ${key}`);
  }
  assert.deepEqual(differences,[]);
});

test('published image assets and global styles are unchanged', () => {
  const differences=[];
  for (const [file,expected] of Object.entries(baseline.assets)) {
    if(!fs.existsSync('public/'+file)||hash(fs.readFileSync('public/'+file))!==expected) differences.push(file);
  }
  assert.deepEqual(differences,[]);
});
