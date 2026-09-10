import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

test('Docusaurus provides root English and prefixed Simplified Chinese locales', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');

  assert.match(config, /defaultLocale:\s*'en'/);
  assert.match(config, /locales:\s*\['en',\s*'zh-CN'\]/);
  assert.match(config, /'zh-CN':\s*\{[\s\S]*label:\s*'简体中文'/);
  assert.match(config, /type:\s*'localeDropdown'/);
  assert.match(config, /position:\s*'right'/);
});

test('the homepage and global chrome use Chinese messages without duplicating image assets', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const code = await readFile('i18n/zh-CN/code.json', 'utf8');
  const navbar = await readFile('i18n/zh-CN/docusaurus-theme-classic/navbar.json', 'utf8');
  const footer = await readFile('i18n/zh-CN/docusaurus-theme-classic/footer.json', 'utf8');

  for (const id of [
    'homepage.hero.title',
    'homepage.capability.autopilot.title',
    'homepage.capability.gimbal.description',
    'homepage.d64tr.imageAlt',
  ]) assert.match(code, new RegExp(`"${id}"`));

  assert.doesNotMatch(config, /@docusaurus\/Translate/);
  assert.match(home, /@docusaurus\/Translate/);
  assert.match(home, /id:\s*'homepage\.hero\.title'/);
  assert.match(home, /d64tr-on-uav\.png/);
  assert.doesNotMatch(home, /\/zh-CN\/img\//);
  assert.match(navbar, /"message": "文档"/);
  assert.match(navbar, /"message": "产品"/);
  assert.match(navbar, /"message": "发布说明"/);
  assert.match(footer, /"message": "快速开始"/);
});
