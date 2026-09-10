import assert from 'node:assert/strict';
import test from 'node:test';
import {access, readFile} from 'node:fs/promises';

test('Docusaurus is configured for the OpenMAVCam organization site', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  assert.match(config, /url:\s*'https:\/\/openmavcam\.github\.io'/);
  assert.match(config, /baseUrl:\s*'\/'/);
  assert.match(config, /organizationName:\s*'OpenMAVCam'/);
  assert.match(config, /projectName:\s*'OpenMAVCam\.github\.io'/);
  assert.match(config, /favicon:\s*'img\/open_cam\.png'/);
  assert.match(config, /src:\s*'img\/open_cam\.png'/);
});

test('the Docs navbar sidebar has the OpenMAVCam overview', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  assert.match(sidebar, /overview\/what-is-openmavcam/);
});

test('D64TR product page renders typed specifications', async () => {
  const page = await readFile('docs/products/d64tr.mdx', 'utf8');
  const home = await readFile('src/pages/index.tsx', 'utf8');
  assert.match(page, /title: D64TR/);
  assert.match(page, /ProductSpecs/);
  assert.match(page, /d64tr-on-uav\.png/);
  assert.match(home, /d64tr-on-uav\.png/);
});

test('homepage presents the light developer path', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const styles = await readFile('src/pages/index.module.css', 'utf8');
  for (const feature of ['Open Source', 'Camera', 'AI Function', 'Gimbal Control', 'Autopilot Compatibility', 'PX4', 'ArduPilot', 'FEATURED PRODUCT', 'D64TR']) assert.match(home, new RegExp(feature));
  assert.match(home, /From camera to mission in four steps\./);
  for (const step of ['Connect', 'Build', 'Deploy', 'Integrate']) assert.match(home, new RegExp(step));
  assert.match(styles, /d64tr-payload-hero\.png/);
  await access('static/img/home/d64tr-payload-hero.png');
});

test('homepage banner integrates a compact D64TR-equipped aircraft without a product card', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const styles = await readFile('src/pages/index.module.css', 'utf8');

  assert.doesNotMatch(home, /styles\.heroProduct/);
  assert.match(styles, /d64tr-payload-hero\.png/);
  await access('static/img/home/d64tr-payload-hero.png');
});

test('homepage prioritizes autopilot compatibility and explains camera and gimbal control', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const openSource = home.indexOf("'Open Source'");
  const hardware = home.indexOf("'Production Hardware'");
  const autopilot = home.indexOf("'Autopilot Compatibility'");
  const gimbal = home.indexOf("'Gimbal Control'");

  assert.ok(hardware > openSource, 'production hardware follows open source');
  assert.ok(autopilot > -1, 'autopilot compatibility capability is present');
  assert.ok(gimbal > autopilot, 'gimbal control follows autopilot compatibility');
  assert.match(home, /validated through extensive testing/);
  assert.match(home, /not a demo platform/);
  assert.match(home, /3A settings/);
  assert.match(home, /photos and video/);
  assert.match(home, /Three-axis stabilization/);
  assert.match(home, /±0\.02° precision/);
  assert.match(home, /OpenMAVCam software stack is open source and freely available on GitHub/);
  assert.match(home, /free to use, inspect, and easy to adapt/);
});

test('homepage feature cards include local capability icons', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  assert.match(home, /styles\.featureIcon/);

  for (const icon of ['open-source', 'production-hardware', 'camera-control', 'ai-function', 'autopilot-compatibility', 'gimbal-control']) {
    await access(`static/img/icons/${icon}.svg`);
  }
});

test('D64TR build and deployment docs contain the supported image workflow', async () => {
  const build = await readFile('docs/products/d64tr/build.md', 'utf8');
  const deploy = await readFile('docs/products/d64tr/deploy.md', 'utf8');
  assert.match(build, /bitbake qti-ubuntu-robotics-image/);
  assert.match(build, /32 GB RAM/);
  assert.match(build, /200 GB/);
  assert.match(deploy, /qrb5165-rb5/);
  assert.match(deploy, /fastboot --slot all flash boot/);
  assert.match(deploy, /fastboot --slot all flash system/);
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
