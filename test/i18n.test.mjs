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
