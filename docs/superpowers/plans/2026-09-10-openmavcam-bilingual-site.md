# OpenMAVCam Chinese / English Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish complete Simplified Chinese documentation at `/zh-CN/`, retain English at the GitHub Pages root, and offer an in-site language selector.

**Architecture:** Docusaurus owns locale routing: English remains at `/`; Chinese is built at `/zh-CN/`. English Markdown/MDX remains in `docs/`; same-ID Chinese copies live in `i18n/zh-CN/docusaurus-plugin-content-docs/current/`. Docusaurus translation IDs localize configuration and React copy from `i18n/zh-CN/code.json`; static images remain shared below `static/img/`.

**Tech Stack:** Docusaurus Classic 3.10.2, TypeScript, React 19, Markdown/MDX, Node built-in test runner, npm, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-10-openmavcam-i18n-design.md`

## Global Constraints

- Keep `en` as the default locale at `https://openmavcam.github.io/`; serve `zh-CN` at `https://openmavcam.github.io/zh-CN/`. Do not add a domain, deployment, or localized asset tree.
- Translate all public docs/products/releases plus homepage, navigation, footer, buttons, metadata, and image alt text. Exclude `docs/superpowers/**`.
- Preserve document IDs/slugs, commands/code blocks, URLs, MAVLink and library names, product/model names, numeric specifications, and `/img/...` paths.
- Reuse bitmap/SVG assets. Do not translate or duplicate any image, including SVG diagrams.
- Start every behavior-changing task with a failing Node test. Before each commit, run its target tests, `npm run validate`, and `git diff --check`.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `docusaurus.config.ts` | Locale config, dropdown, translated navbar/footer. |
| `sidebars.ts` | Canonical English sidebar IDs/order. |
| `src/pages/index.tsx` | Translation-keyed homepage copy and alt text. |
| `test/i18n.test.mjs` | Locale, translation path, parity, and asset checks. |
| `i18n/zh-CN/code.json` | Chinese messages for configuration and homepage. |
| `i18n/zh-CN/docusaurus-plugin-content-docs/current.json` | Chinese sidebar category translations. |
| `i18n/zh-CN/docusaurus-plugin-content-docs/current/**` | Chinese pages at exact relative English paths. |
| `i18n/zh-CN/docusaurus-plugin-content-blog/**` | Chinese Releases metadata and post. |

### Task 1: Enable Docusaurus locale routing and selector

**Files:**
- Modify: `docusaurus.config.ts`
- Create: `test/i18n.test.mjs`

**Interfaces:** Produces English root routing, Chinese `/zh-CN/` routing, and a right-aligned native `localeDropdown`.

- [ ] **Step 1: Write the failing locale test**

Create `test/i18n.test.mjs` with this test:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run `node --test test/i18n.test.mjs`. Expected: FAIL because configuration only includes `en`.

- [ ] **Step 3: Add locale configuration**

Replace `i18n` in `docusaurus.config.ts` with:

```ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh-CN'],
  localeConfigs: {
    en: {label: 'English', htmlLang: 'en-US'},
    'zh-CN': {label: '简体中文', htmlLang: 'zh-CN'},
  },
},
```

Append `{type: 'localeDropdown', position: 'right'}` after the GitHub navbar item. Do not change URL, base URL, Pages workflow, docs route, releases route, or GitHub href. Then run `npm run write-translations -- --locale zh-CN` once to generate `i18n/zh-CN/docusaurus-plugin-content-docs/current.json` and the base translation directories before custom Chinese messages are added.

- [ ] **Step 4: Verify then commit**

Run `node --test test/i18n.test.mjs && npm run validate && git diff --check`. Expected: PASS and production output for `[en]` and `[zh-CN]`. Commit with `git add docusaurus.config.ts test/i18n.test.mjs && git commit -m "feat: enable Chinese locale routing"`.

### Task 2: Localize homepage and global chrome

**Files:**
- Modify: `docusaurus.config.ts`
- Modify: `src/pages/index.tsx`
- Modify: `test/i18n.test.mjs`
- Create: `i18n/zh-CN/code.json`

**Interfaces:** Uses `@docusaurus/Translate` message IDs: `site.*`, `navbar.*`, `footer.*`, and `homepage.*`. Internal Docusaurus `Link` destinations remain unprefixed and locale-aware.

- [ ] **Step 1: Write the failing chrome/homepage test**

Append this test:

```js
test('the homepage and global chrome use Chinese messages without duplicating image assets', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const code = await readFile('i18n/zh-CN/code.json', 'utf8');
  for (const id of ['navbar.docs', 'navbar.products', 'navbar.releases', 'footer.gettingStarted', 'homepage.hero.title', 'homepage.capability.autopilot.title', 'homepage.capability.gimbal.description', 'homepage.d64tr.imageAlt']) assert.match(code, new RegExp(`"${id}"`));
  assert.match(config, /translate\(\{/);
  assert.match(home, /@docusaurus\/Translate/);
  assert.match(home, /id:\s*'homepage\.hero\.title'/);
  assert.match(home, /d64tr-on-uav\.png/);
  assert.doesNotMatch(home, /\/zh-CN\/img\//);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `node --test test/i18n.test.mjs`. Expected: FAIL because source strings are not keyed and `code.json` is absent.

- [ ] **Step 3: Key configuration and homepage strings**

Import `translate` from `@docusaurus/Translate` in both files. In configuration key the tagline, Docs/Products/Releases labels, footer labels/items, and copyright with: `site.tagline`, `navbar.docs`, `navbar.products`, `navbar.releases`, `footer.gettingStarted`, `footer.documentation`, `footer.docs`, `footer.getStarted`, `footer.more`, `footer.releases`, `footer.copyright`. Keep OpenMAVCam, D64TR, GitHub, hrefs, and `to` paths unchanged.

In the homepage key all existing prose, `<Layout>` metadata, and alt text with: `homepage.meta.title`, `homepage.meta.description`, `homepage.kicker`, `homepage.hero.title`, `homepage.hero.description`, `homepage.hero.compatibility`, `homepage.actions.getStarted`, `homepage.actions.exploreD64TR`, `homepage.section.whyKicker`, `homepage.section.whyTitle`, `homepage.capability.{openSource,productionHardware,camera,ai,autopilot,gimbal}.{title,description}`, `homepage.d64tr.{kicker,title,description,viewSpecs,buildImage,deployImage,imageAlt}`, `homepage.path.{kicker,title,connect,build,deploy,integrate}.{title,description}`. Use current English text as each default message. Keep DOM order, CSS, icon names, sources, and Link values unchanged.

- [ ] **Step 4: Add Chinese catalog**

Create `i18n/zh-CN/code.json`; include every Step 3 ID with Chinese `message` and English `description`. Required wording: `navbar.docs` = `文档`; `navbar.products` = `产品`; `navbar.releases` = `发布说明`; `homepage.hero.title` = `为每一项自主任务提供开放视觉能力。`; `homepage.hero.compatibility` = `面向 PX4 和 ArduPilot 构建——无需修改飞控固件。`; `homepage.capability.autopilot.title` = `飞控兼容性`; `homepage.capability.gimbal.description` = `通过文档化控制接口提供三轴稳定与载荷指向，精度达 ±0.02°。`.

- [ ] **Step 5: Verify then commit**

Run `node --test test/i18n.test.mjs && npm run validate && git diff --check`. Expected: PASS; both locales use shared `/img/...` paths. Commit with `git add docusaurus.config.ts src/pages/index.tsx i18n/zh-CN/code.json test/i18n.test.mjs && git commit -m "feat: localize site chrome and homepage"`.

### Task 3: Translate Overview, Products, and Architecture

**Files:**
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/overview/{what-is-openmavcam,why-openmavcam,supported-platforms}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/products/d64tr.mdx`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/products/d64tr/{build,deploy}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/architecture/{camera,mavlink,video-streaming,gimbal,ai-tracking,ros2}.md`
- Modify: `test/i18n.test.mjs`

**Interfaces:** Produces translated copies at the same relative path and Docusaurus document ID.

- [ ] **Step 1: Write a failing localized-page test**

Add `access` to the fs import, then add:

```js
test('Chinese overview product and architecture pages mirror active English IDs', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = ['overview/what-is-openmavcam.md', 'overview/why-openmavcam.md', 'overview/supported-platforms.md', 'products/d64tr.mdx', 'products/d64tr/build.md', 'products/d64tr/deploy.md', 'architecture/camera.md', 'architecture/mavlink.md', 'architecture/video-streaming.md', 'architecture/gimbal.md', 'architecture/ai-tracking.md', 'architecture/ros2.md'];
  for (const page of pages) await access(`${root}/${page}`);
  assert.match(await readFile(`${root}/overview/what-is-openmavcam.md`, 'utf8'), /title: 什么是 OpenMAVCam？/);
  const camera = await readFile(`${root}/architecture/camera.md`, 'utf8');
  assert.match(camera, /MAVSDK/);
  assert.match(camera, /camera-call-flow\.svg/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `node --test test/i18n.test.mjs`. Expected: FAIL because localized pages do not exist.

- [ ] **Step 3: Create translated pages**

Copy each listed source from `docs/`, translate prose/headings/tables/captions/alt text, and preserve front-matter IDs/slugs, JSX, asset paths, commands, numeric data, URLs, code, and technical names. Use titles: `什么是 OpenMAVCam？`, `为什么选择 OpenMAVCam？`, `支持的平台`, `D64TR`, `构建 D64TR 镜像`, `部署 D64TR 镜像`, `相机`, `MAVLink`, `视频流`, `云台`, `AI 与目标跟踪`, `ROS 2`. Preserve `ProductSpecs`, `MAVSDK`, `CameraServer`, `CameraLocalClient`, `MavCamera`, `IRCamera`, `TrackingServer`, `RenderBridge`, `StorageManager`, codecs, gimbal protocol labels, and diagram filenames.

- [ ] **Step 4: Verify then commit**

Run `node --test test/i18n.test.mjs && npm run validate && git diff --check`. Expected: PASS with all shared assets resolved. Commit with `git add i18n/zh-CN/docusaurus-plugin-content-docs/current/{overview,products,architecture} test/i18n.test.mjs && git commit -m "docs: translate overview products and architecture"`.

### Task 4: Translate Getting Started and Protocol; translate sidebar categories

**Files:**
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/getting-started/{build,autopilot,qgroundcontrol}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/protocol/{mavlink-camera-protocol,camera-information,capture,zoom,tracking,status}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current.json`
- Modify: `test/i18n.test.mjs`

**Interfaces:** Preserves sidebar IDs/order and renders Chinese category labels.

- [ ] **Step 1: Write failing guide/sidebar test**

Add this test:

```js
test('Chinese guides preserve commands and Protocol preserves MAVLink identifiers', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = ['getting-started/build.md', 'getting-started/autopilot.md', 'getting-started/qgroundcontrol.md', 'protocol/mavlink-camera-protocol.md', 'protocol/camera-information.md', 'protocol/capture.md', 'protocol/zoom.md', 'protocol/tracking.md', 'protocol/status.md'];
  for (const page of pages) await access(`${root}/${page}`);
  assert.match(await readFile(`${root}/getting-started/qgroundcontrol.md`, 'utf8'), /make px4_sitl gz_x500/);
  assert.match(await readFile(`${root}/protocol/mavlink-camera-protocol.md`, 'utf8'), /CAMERA_INFORMATION/);
  const sidebar = await readFile(`${root}/current.json`, 'utf8');
  for (const label of ['概览', '快速开始', '协议']) assert.match(sidebar, new RegExp(label));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `node --test test/i18n.test.mjs`. Expected: FAIL because the localized source and sidebar JSON do not exist.

- [ ] **Step 3: Translate the guides and protocol**

Copy sources at the listed paths. Use guide titles `构建和部署`, `飞控`, `QGroundControl`; use protocol titles `MAVLink 相机协议`, `相机信息`, `拍照与录像`, `变焦`, `目标跟踪`, `状态`. Preserve all shell/ADB/fastboot commands, PX4/ArduPilot/QGC names/version, simulator limitation, message/command identifiers, code blocks, URLs, and SVG paths.

- [ ] **Step 4: Edit the generated sidebar catalog**

Keep the keys/descriptions produced by Task 1 in `current.json`; change existing category message values in order to `概览`, `产品`, `架构`, `快速开始`, `协议`, `硬件集成`, `API 参考`, `开发者指南`. Do not rerun `write-translations` after Task 2 because it may regenerate the hand-authored `code.json` catalog.

- [ ] **Step 5: Verify then commit**

Run `node --test test/i18n.test.mjs && npm run validate && git diff --check`. Expected: PASS and literal commands remain intact. Commit with `git add i18n/zh-CN/docusaurus-plugin-content-docs/current/{getting-started,protocol} i18n/zh-CN/docusaurus-plugin-content-docs/current.json test/i18n.test.mjs && git commit -m "docs: translate getting started and protocol"`.

### Task 5: Translate Hardware, API, Developer Guide, and Releases

**Files:**
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/hardware-integration/platforms.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/api-reference/{configuration-interfaces,cpp,mavlink-messages}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-docs/current/developer-guide/{repository-structure,coding-style,contribution,license}.md`
- Create: `i18n/zh-CN/docusaurus-plugin-content-blog/options.json`
- Create: `i18n/zh-CN/docusaurus-plugin-content-blog/2026-09-10-openmavcam-website-launch.md`
- Modify: `test/i18n.test.mjs`

**Interfaces:** Completes all active public source translations and Chinese Releases metadata/post.

- [ ] **Step 1: Write failing remaining-content test**

Add this test:

```js
test('Chinese locale contains remaining public docs and localized release content', async () => {
  const root = 'i18n/zh-CN/docusaurus-plugin-content-docs/current';
  const pages = ['hardware-integration/platforms.md', 'api-reference/configuration-interfaces.md', 'api-reference/cpp.md', 'api-reference/mavlink-messages.md', 'developer-guide/repository-structure.md', 'developer-guide/coding-style.md', 'developer-guide/contribution.md', 'developer-guide/license.md'];
  for (const page of pages) await access(`${root}/${page}`);
  const config = await readFile(`${root}/api-reference/configuration-interfaces.md`, 'utf8');
  assert.match(config, /adb shell/);
  assert.match(config, /persist\.video\.preview\.encoder/);
  assert.match(await readFile('i18n/zh-CN/docusaurus-plugin-content-blog/2026-09-10-openmavcam-website-launch.md', 'utf8'), /title: OpenMAVCam 网站发布/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `node --test test/i18n.test.mjs`. Expected: FAIL because localized sources are absent.

- [ ] **Step 3: Translate remaining docs and release**

Set titles to `自主平台`, `配置`, `C/C++`, `MAVLink 消息`, `仓库结构`, `编码风格`, `参与贡献`, `许可证`. Preserve all literal technical values. Configuration retains `adb shell`, all `setprop persist.video.preview.*`, `sync`, reboot requirement, and H.265/UVC warning. The post preserves slug/authors/tags/`/* truncate */`, uses title `OpenMAVCam 网站发布`, and retains tag identifiers `release`, `website`, `documentation`. `options.json` translates Releases title, description, and sidebar title.

- [ ] **Step 4: Verify then commit**

Run `node --test test/i18n.test.mjs && npm run validate && git diff --check`. Expected: PASS. Commit with `git add i18n/zh-CN/docusaurus-plugin-content-docs/current/{hardware-integration,api-reference,developer-guide} i18n/zh-CN/docusaurus-plugin-content-blog test/i18n.test.mjs && git commit -m "docs: complete Chinese site translation"`.

### Task 6: Protect exact-path parity and inspect generated output

**Files:**
- Modify: `test/i18n.test.mjs`

**Interfaces:** Produces a permanent guard requiring a Chinese copy for every active English public Markdown/MDX page.

- [ ] **Step 1: Write complete parity test**

Change fs imports to include `access`, `readFile`, `readdir`; import `path` from `node:path`; add:

```js
async function markdownFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  return (await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return /\.mdx?$/.test(entry.name) ? [target] : [];
  }))).flat();
}

test('every active English public document has a Chinese counterpart at the same relative path', async () => {
  const english = (await markdownFiles('docs')).filter((file) => !file.startsWith('docs/superpowers/')).map((file) => path.relative('docs', file));
  for (const relativePath of english) await access(path.join('i18n/zh-CN/docusaurus-plugin-content-docs/current', relativePath));
});
```

- [ ] **Step 2: Run parity test and fix each reported path**

Run `node --test test/i18n.test.mjs`. Expected: PASS only when each English public Markdown/MDX file has the same relative Chinese path. For a failure, copy/translate that source while preserving technical literals/assets; never add a `docs/superpowers` translation.

- [ ] **Step 3: Verify output paths and shared images**

Run `npm run validate`, then run `test -f build/index.html`, `test -f build/zh-CN/index.html`, `test -f build/zh-CN/docs/overview/what-is-openmavcam/index.html`, `rg -n '简体中文|English' build/index.html build/zh-CN/index.html`, `rg -n '为每一项自主任务提供开放视觉能力|飞控兼容性' build/zh-CN/index.html`, and `rg -n '/img/products/d64tr/d64tr-on-uav.png' build/index.html build/zh-CN/index.html`. Expected: all commands exit 0, both locales share the exact image path, and no asset path begins `/zh-CN/img/`.

- [ ] **Step 4: Final check, commit, and optional publication**

Run `git diff --check`; expected exit 0. Commit with `git add test/i18n.test.mjs i18n/zh-CN && git commit -m "test: verify bilingual documentation parity"`. Push only after an explicit user publication request using `git push origin main`; the existing Pages workflow must deploy English root and Chinese `/zh-CN/` from one site.
