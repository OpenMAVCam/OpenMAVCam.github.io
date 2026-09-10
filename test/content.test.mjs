import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

test('Docusaurus is configured for the OpenMAVCam organization site', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  assert.match(config, /url:\s*'https:\/\/openmavcam\.github\.io'/);
  assert.match(config, /baseUrl:\s*'\/'/);
  assert.match(config, /organizationName:\s*'OpenMAVCam'/);
  assert.match(config, /projectName:\s*'OpenMAVCam\.github\.io'/);
});

test('the Docs navbar sidebar has the OpenMAVCam overview', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  assert.match(sidebar, /overview\/what-is-openmavcam/);
});

test('D64TR product page renders typed specifications', async () => {
  const page = await readFile('docs/products/d64tr.mdx', 'utf8');
  assert.match(page, /title: D64TR/);
  assert.match(page, /ProductSpecs/);
});

test('Pages deployment publishes the build artifact with least privilege', async () => {
  const workflow = await readFile('.github/workflows/deploy-pages.yml', 'utf8');
  for (const value of ['actions/configure-pages@v5', 'actions/upload-pages-artifact@v4', 'path: build', 'actions/deploy-pages@v4', 'pages: write', 'id-token: write']) {
    assert.match(workflow, new RegExp(value.replace(/[/.+]/g, '\\$&')));
  }
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /enablement: true/);
});

test('test command uses Node built-in test discovery', async () => {
  const packageJson = await readFile('package.json', 'utf8');
  assert.match(packageJson, /"test": "node --test"/);
  assert.doesNotMatch(packageJson, /"test": "node --test test"/);
  assert.doesNotMatch(packageJson, /test\/\*\*\/\*\.test\.mjs/);
});
