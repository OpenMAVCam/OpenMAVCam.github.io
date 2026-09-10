import assert from 'node:assert/strict';
import test from 'node:test';
import {access, readFile} from 'node:fs/promises';

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

test('Chinese overview product and architecture pages mirror active English IDs', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = [
    'overview/what-is-openmavcam.md',
    'overview/why-openmavcam.md',
    'overview/supported-platforms.md',
    'products/d64tr.mdx',
    'products/d64tr/build.md',
    'products/d64tr/deploy.md',
    'architecture/camera.md',
    'architecture/mavlink.md',
    'architecture/video-streaming.md',
    'architecture/gimbal.md',
    'architecture/ai-tracking.md',
    'architecture/ros2.md',
  ];

  for (const page of pages) await access(`${root}/${page}`);

  assert.match(
    await readFile(`${root}/overview/what-is-openmavcam.md`, 'utf8'),
    /title: 什么是 OpenMAVCam？/,
  );
  const camera = await readFile(`${root}/architecture/camera.md`, 'utf8');
  assert.match(camera, /MAVSDK/);
  assert.match(camera, /camera-call-flow\.svg/);
});

test('Chinese guides preserve commands and Protocol preserves MAVLink identifiers', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = [
    'getting-started/build.md', 'getting-started/autopilot.md', 'getting-started/qgroundcontrol.md',
    'protocol/mavlink-camera-protocol.md', 'protocol/camera-information.md', 'protocol/capture.md',
    'protocol/zoom.md', 'protocol/tracking.md', 'protocol/status.md',
  ];
  for (const page of pages) await access(`${root}/${page}`);
  assert.match(await readFile(`${root}/getting-started/qgroundcontrol.md`, 'utf8'), /make px4_sitl gz_x500/);
  assert.match(await readFile(`${root}/protocol/mavlink-camera-protocol.md`, 'utf8'), /CAMERA_INFORMATION/);
  const sidebar = await readFile('i18n/zh-CN/docusaurus-plugin-content-docs/current.json', 'utf8');
  for (const label of ['概览', '快速开始', '协议']) assert.match(sidebar, new RegExp(label));
});

test('Chinese locale contains remaining public docs and localized release content', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = ['hardware-integration/platforms.md', 'api-reference/configuration-interfaces.md', 'api-reference/cpp.md', 'api-reference/mavlink-messages.md', 'developer-guide/repository-structure.md', 'developer-guide/coding-style.md', 'developer-guide/contribution.md', 'developer-guide/license.md'];
  for (const page of pages) await access(`${root}/${page}`);
  const configuration = await readFile(`${root}/api-reference/configuration-interfaces.md`, 'utf8');
  assert.match(configuration, /adb shell/);
  assert.match(configuration, /persist\.video\.preview\.encoder/);
  assert.match(await readFile('i18n/zh-CN/docusaurus-plugin-content-blog/2026-09-10-openmavcam-website-launch.md', 'utf8'), /title: OpenMAVCam 网站发布/);
});
