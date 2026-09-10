# OpenMAVCam Official Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and automatically publish an English Docusaurus website for OpenMAVCam at `https://openmavcam.github.io/`.

**Architecture:** The site is a Docusaurus Classic TypeScript application. Markdown/MDX forms the documentation and release source of truth; a typed product-data module powers reusable specifications for D64TR and future products. GitHub Actions verifies pull requests and deploys the static `build/` artifact from `main` to GitHub Pages.

**Tech Stack:** Node.js 20, npm, Docusaurus Classic, TypeScript, React, CSS Modules, Node built-in test runner, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-10-openmavcam-website-design.md`

## Global Constraints

- The repository must be `OpenMAVCam/OpenMAVCam.github.io`; configure `url` as `https://openmavcam.github.io` and `baseUrl` as `/`.
- All public-facing copy and documentation must be English.
- Use Docusaurus Classic with TypeScript; preserve Markdown/MDX as the content source of truth.
- The first product is D64TR; represent its reusable specification data with TypeScript types.
- Use local product imagery only. Copy `/home/goerlab/Pictures/Screenshots/Screenshot from 2026-09-10 09-55-17.png` to `static/img/products/d64tr/d64tr-on-uav.png`; do not hotlink Aerora images.
- Use planned source links `https://github.com/OpenMAVCam/object-detection` and `https://github.com/OpenMAVCam/object-tracking`.
- Never claim long-term availability of the Open-Q 5165RB SOM. Link to the Lantronix specification page and label it as an external component reference.
- Use `main` as the source branch. GitHub Pages must be configured in repository settings with source **GitHub Actions**.
- Every code change must be preceded by a failing test or failing build assertion, then verified with the specified command before committing.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `package.json`, `package-lock.json` | Reproducible Docusaurus/TypeScript dependencies and local commands. |
| `docusaurus.config.ts` | Root-domain routing, metadata, navbar/footer, strict link handling, Prism themes. |
| `sidebars.ts` | Explicit docs information architecture and category order. |
| `src/data/products/types.ts` | Stable product-data interfaces. |
| `src/data/products/d64tr.ts` | D64TR product metadata and all confirmed specification groups. |
| `src/components/ProductSpecs/index.tsx` | Reusable accessible specification-table renderer. |
| `src/components/ProductSpecs/index.module.css` | Responsive styles scoped to the specification table. |
| `src/pages/index.tsx` | Custom developer-focused homepage. |
| `src/pages/index.module.css` | Homepage visual layout and responsive styles. |
| `docs/**` | English documentation hierarchy, including D64TR and developer guidance. |
| `blog/**` | Markdown release/changelog entries. |
| `static/img/products/d64tr/d64tr-on-uav.png` | User-provided D64TR render. |
| `static/.nojekyll` | Prevent Jekyll processing of published static output. |
| `scripts/validate-content.mjs` | Metadata/source-link validation that complements the Docusaurus build. |
| `test/products.test.mjs`, `test/content.test.mjs` | Node test-runner checks for typed product data and required site content. |
| `.github/workflows/ci.yml` | Pull-request production build validation. |
| `.github/workflows/deploy-pages.yml` | `main` build-and-deploy workflow using official Pages actions. |
| `CONTRIBUTING.md` | Local preview, content, style, PR, and release-note rules. |
| `README.md` | Project purpose and first-run commands. |

## Task 1: Bootstrap the Docusaurus project and root-site configuration

**Files:**
- Create: `package.json`, `package-lock.json`, `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`, `static/.nojekyll`, `README.md`
- Test: `test/content.test.mjs`

**Interfaces:**
- Produces: `npm run start`, `npm run build`, `npm test`, and a Docusaurus application with docs/blog support.
- Produces: root-site configuration consumed by all links and Pages workflows: `url = 'https://openmavcam.github.io'`, `baseUrl = '/'`.

- [ ] **Step 1: Create the failing root-site configuration test**

Create `test/content.test.mjs` with this initial assertion:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/content.test.mjs`  
Expected: FAIL because `docusaurus.config.ts` does not exist.

- [ ] **Step 3: Scaffold Docusaurus and configure the site**

The repository already contains the validated design and plan under `docs/superpowers/`, so scaffold in a temporary directory and merge the generated application files without deleting those documents:

```bash
npx create-docusaurus@latest /tmp/openmavcam-docusaurus classic --typescript --package-manager npm
rsync -a /tmp/openmavcam-docusaurus/ ./
```

Remove the generated tutorial docs, blog posts, and sample page before adding the project content in later tasks. Replace starter configuration with:

```ts
const config: Config = {
  title: 'OpenMAVCam',
  tagline: 'Open MAVLink camera platform for autonomous systems',
  favicon: 'img/favicon.ico',
  url: 'https://openmavcam.github.io',
  baseUrl: '/',
  organizationName: 'OpenMAVCam',
  projectName: 'OpenMAVCam.github.io',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
};
```

Configure the classic preset with docs at `/docs` and blog at `/releases`; add a navbar with `Docs`, `Products`, `Releases`, and a GitHub external link to `https://github.com/OpenMAVCam`. Add an English footer identifying OpenMAVCam as an open MAVLink camera platform. Create empty `static/.nojekyll`.

- [ ] **Step 4: Add package scripts and minimal README**

Ensure `package.json` contains these scripts:

```json
{
  "start": "docusaurus start",
  "build": "docusaurus build",
  "serve": "docusaurus serve",
  "test": "node --test test/**/*.test.mjs",
  "validate": "npm test && npm run build"
}
```

Write `README.md` with the exact quick-start commands:

```bash
npm ci
npm run start
npm run validate
```

- [ ] **Step 5: Run the configuration test and production build**

Run: `node --test test/content.test.mjs && npm run build`  
Expected: PASS; Docusaurus exits 0 and writes the static site to `build/`.

- [ ] **Step 6: Commit the bootstrap**

```bash
git add package.json package-lock.json docusaurus.config.ts sidebars.ts src/css static/.nojekyll README.md test/content.test.mjs
git commit -m "feat: bootstrap OpenMAVCam Docusaurus site"
```

## Task 2: Add typed D64TR product data and a reusable specifications renderer

**Files:**
- Create: `src/data/products/types.ts`, `src/data/products/d64tr.ts`, `src/components/ProductSpecs/index.tsx`, `src/components/ProductSpecs/index.module.css`
- Test: `test/products.test.mjs`

**Interfaces:**
- Produces: `Product`, `SpecificationGroup`, and `SpecificationRow` interfaces from `src/data/products/types.ts`.
- Produces: `d64tr: Product` from `src/data/products/d64tr.ts`.
- Produces: `<ProductSpecs groups={d64tr.specificationGroups} />`, where `groups` is `SpecificationGroup[]`.

- [ ] **Step 1: Write the failing D64TR data test**

Create `test/products.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

test('D64TR exposes required compute and imaging specifications', async () => {
  const data = await readFile('src/data/products/d64tr.ts', 'utf8');
  assert.match(data, /slug:\s*'d64tr'/);
  assert.match(data, /name:\s*'D64TR'/);
  assert.match(data, /dual-sensor/i);
  assert.match(data, /title:\s*'Compute Platform'/);
  assert.match(data, /8 GB LPDDR5/);
  assert.match(data, /FLIR Boson\+ 640 × 512/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/products.test.mjs`  
Expected: FAIL because the D64TR module does not exist.

- [ ] **Step 3: Define data contracts and D64TR specifications**

Define these exact contracts:

```ts
export interface SpecificationRow {
  label: string;
  value: string;
}

export interface SpecificationGroup {
  title: string;
  rows: SpecificationRow[];
}

export interface Product {
  slug: string;
  name: string;
  status: 'Available' | 'Preview' | 'Development';
  summary: string;
  heroImage: {src: string; alt: string};
  specificationGroups: SpecificationGroup[];
}
```

Populate D64TR groups named `Imaging`, `Video and Thermal Display`, `Compute Platform`, `Gimbal System`, `Connectivity`, and `Physical, Storage, and Environment`. Include every confirmed value from the design spec, including 64 MP RGB, FLIR Boson+ 640 × 512, 15 TOPS, QRB5165, Open-Q 5165RB SOM, 8 GB LPDDR5, 128 GB UFS, Gigabit Ethernet, 1080p HDMI output, other interfaces, gimbal ranges, storage, environmental limits, FCC, and IP44.

- [ ] **Step 4: Implement the renderer and responsive styles**

Implement a semantic renderer:

```tsx
export default function ProductSpecs({groups}: {groups: SpecificationGroup[]}) {
  return groups.map((group) => (
    <section key={group.title} aria-labelledby={`${group.title.toLowerCase().replaceAll(' ', '-')}-title`}>
      <h2 id={`${group.title.toLowerCase().replaceAll(' ', '-')}-title`}>{group.title}</h2>
      <table>
        <tbody>{group.rows.map(({label, value}) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
      </table>
    </section>
  ));
}
```

Use a CSS Module to give tables horizontal overflow on narrow displays, preserve high contrast, and prevent labels from wrapping into unreadable single-character columns.

- [ ] **Step 5: Run data validation and production build**

Run: `node --test test/products.test.mjs && npm run build`  
Expected: PASS; TypeScript accepts the contracts and Docusaurus build exits 0.

- [ ] **Step 6: Commit the product-data foundation**

```bash
git add src/data/products src/components/ProductSpecs test/products.test.mjs
git commit -m "feat: add typed D64TR product specifications"
```

## Task 3: Build the custom homepage and D64TR product page

**Files:**
- Create: `src/pages/index.tsx`, `src/pages/index.module.css`, `docs/products/d64tr.mdx`, `static/img/products/d64tr/d64tr-on-uav.png`
- Modify: `docusaurus.config.ts`, `sidebars.ts`
- Test: `test/content.test.mjs`

**Interfaces:**
- Consumes: `d64tr` and `<ProductSpecs>` from Task 2.
- Produces: `/` developer homepage and `/docs/products/d64tr` product page.

- [ ] **Step 1: Extend the failing content test for the product path and asset**

Append to `test/content.test.mjs`:

```js
import {access} from 'node:fs/promises';

test('D64TR page and local product render are present', async () => {
  const page = await readFile('docs/products/d64tr.mdx', 'utf8');
  assert.match(page, /title: D64TR/);
  assert.match(page, /<ProductSpecs groups=\{d64tr\.specificationGroups\} \/>/);
  await access('static/img/products/d64tr/d64tr-on-uav.png');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/content.test.mjs`  
Expected: FAIL because the product page and local image do not exist.

- [ ] **Step 3: Add the supplied render and page**

Copy the exact approved source file to `static/img/products/d64tr/d64tr-on-uav.png`. Create `docs/products/d64tr.mdx` with front matter `title: D64TR`, `sidebar_position: 1`, and content sections `Overview`, `Highlights`, `Specifications`, `Compute Platform`, `Integration`, and `External Component Reference`.

Use exact, defensible English copy:

```mdx
The D64TR is a dual-sensor EO/IR gimbal camera for MAVLink-enabled autonomous platforms. It combines a 64 MP RGB camera, a FLIR Boson+ 640 × 512 thermal camera, 3-axis stabilization, and on-device edge AI compute.
```

Render the local image with alt text `D64TR dual-sensor gimbal camera mounted below a multirotor UAV`. Add these exact imports, render its groups, link externally to `https://www.lantronix.com/products/open-q-5165rb-som/`, and state that this is an external component reference without availability claims:

```mdx
import ProductSpecs from '@site/src/components/ProductSpecs';
import {d64tr} from '@site/src/data/products/d64tr';
```

- [ ] **Step 4: Implement the homepage**

Create a custom homepage with:

- Hero title `Open MAVLink Camera Platform for Autonomous Systems` and two CTAs: `Run the minimum demo` (`/docs/getting-started/minimum-demo`) and `Explore D64TR` (`/docs/products/d64tr`).
- A local D64TR render beside the hero.
- Six concise capability cards: Camera Control, Video Streaming, Gimbal Control, Object Detection, Object Tracking, ROS 2.
- A three-step developer path: `Connect`, `Run`, `Integrate`, linking to the corresponding docs pages.
- A source panel linking to both planned OpenMAVCam demo repositories.

Use `@docusaurus/Link`, `useBaseUrl`, semantic headings, focus-visible link styles, and a CSS Module with a single-column mobile layout.

- [ ] **Step 5: Register navigation and build**

Add `Products` to the navbar and `products/d64tr` to the sidebar. Run: `node --test test/content.test.mjs && npm run build`  
Expected: PASS; the home page and D64TR page render without broken links.

- [ ] **Step 6: Commit product experience**

```bash
git add src/pages src/data/products docs/products static/img/products/d64tr docusaurus.config.ts sidebars.ts test/content.test.mjs
git commit -m "feat: add D64TR product experience"
```

## Task 4: Create the developer documentation hierarchy and content validation

**Files:**
- Create: `docs/overview/{what-is-openmavcam,why-openmavcam,supported-platforms}.md`, `docs/architecture/{camera,mavlink,video-streaming,gimbal,ai-tracking,ros2}.md`, `docs/getting-started/{build,deploy,minimum-demo,px4-ardupilot-qgc}.md`, `docs/protocol/{mavlink-camera-protocol,camera-information,capture,zoom,tracking,status}.md`, `docs/hardware-integration/{uav,ugv,robot-dog,other-autonomous-platforms}.md`, `docs/api-reference/{cpp,mavlink-messages,configuration-interfaces}.md`, `docs/developer-guide/{repository-structure,coding-style,contribution,license}.md`, `scripts/validate-content.mjs`
- Modify: `sidebars.ts`, `package.json`, `test/content.test.mjs`
- Test: `test/content.test.mjs`

**Interfaces:**
- Produces: stable documentation paths used by the homepage, navbar, sidebar, and future product guides.
- Produces: `npm run validate:content`, a Node validation command run before the Docusaurus build.

- [ ] **Step 1: Add failing assertions for every required top-level documentation section**

Add this to `test/content.test.mjs`:

```js
test('all first-release documentation sections are declared in the sidebar', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  for (const section of ['Overview', 'Products', 'Architecture', 'Getting Started', 'Protocol', 'Hardware Integration', 'API Reference', 'Developer Guide']) {
    assert.match(sidebar, new RegExp(`label: '${section}'`));
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/content.test.mjs`  
Expected: FAIL because the full sidebar hierarchy is absent.

- [ ] **Step 3: Write English Markdown pages and explicit sidebar ordering**

Create each listed file with `sidebar_position`, an English `title`, and an introductory paragraph. Use these required substantive inclusions:

- `what-is-openmavcam.md`: MAVLink-native camera platform, camera/gimbal/video/AI scope.
- `supported-platforms.md`: UAV, UGV, robot dog, and other autonomous platforms.
- `mavlink.md`: Camera Protocol as the control contract; link to Protocol details.
- `ai-tracking.md`: detection output, tracking lifecycle, and object-detection / object-tracking source links.
- `minimum-demo.md`: clone `https://github.com/OpenMAVCam/object-tracking.git`; then run `cmake -S . -B build`, `cmake --build build`, and `./build/object_tracking`; state prerequisites for SNPE and the camera shared-memory producer.
- `px4-ardupilot-qgc.md`: identify the integration sequence as MAVLink camera discovery, command/control, video setup, then tracking/status telemetry; do not promise unverified autopilot-specific behavior.
- `mavlink-messages.md`: document the six required topics—camera information, capture, zoom, tracking, status—and link to official MAVLink documentation rather than copying protocol definitions.
- `repository-structure.md`: show intended responsibilities for camera, MAVLink, streaming, AI, and tracking repositories.
- `contribution.md`: point to `CONTRIBUTING.md` as the authoritative workflow.

Define all categories and documents explicitly in `sidebars.ts`; do not rely on autogenerated sidebar ordering.

- [ ] **Step 4: Implement content validation**

Create `scripts/validate-content.mjs` that recursively reads `docs/`, checks each Markdown/MDX file for a `title:` front-matter field, and exits nonzero with `Missing title: <relative path>` for every invalid file. Add:

```json
"validate:content": "node scripts/validate-content.mjs"
```

to `package.json` and update `validate` to `npm test && npm run validate:content && npm run build`.

- [ ] **Step 5: Run focused and full validation**

Run: `node --test test/content.test.mjs && npm run validate`  
Expected: PASS; required sections, metadata, content validation, and production build all succeed.

- [ ] **Step 6: Commit the documentation system**

```bash
git add docs sidebars.ts scripts/validate-content.mjs package.json test/content.test.mjs
git commit -m "docs: add OpenMAVCam developer documentation"
```

## Task 5: Add release, contributor, and repository-maintenance content

**Files:**
- Create: `blog/2026-09-10-openmavcam-website-launch.md`, `CONTRIBUTING.md`
- Modify: `README.md`, `test/content.test.mjs`
- Test: `test/content.test.mjs`

**Interfaces:**
- Produces: `/releases/openmavcam-website-launch` as the first release/changelog post.
- Produces: contribution rules used by every future documentation or source pull request.

- [ ] **Step 1: Add failing assertions for release and contribution guidance**

Append:

```js
test('release and contribution guidance are present', async () => {
  const release = await readFile('blog/2026-09-10-openmavcam-website-launch.md', 'utf8');
  const contributing = await readFile('CONTRIBUTING.md', 'utf8');
  assert.match(release, /title: OpenMAVCam Website Launch/);
  assert.match(contributing, /npm run validate/);
  assert.match(contributing, /Pull Request/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/content.test.mjs`  
Expected: FAIL because the release entry and contributor guide do not exist.

- [ ] **Step 3: Write the release note and contributor guide**

Use this release post front matter:

```md
---
slug: openmavcam-website-launch
title: OpenMAVCam Website Launch
authors: [openmavcam]
tags: [release, website, documentation]
---
```

The post must state that it introduces the product overview, D64TR specifications, getting-started path, protocol map, hardware integration guide, and developer contribution guidance.

Write `CONTRIBUTING.md` with these concrete rules: use English, include a `title` in every Markdown/MDX document, keep sidebar IDs ordered, run `npm ci` then `npm run validate`, keep D64TR values in `src/data/products/d64tr.ts`, do not hotlink product images, create a dated `blog/YYYY-MM-DD-<slug>.md` file for a release, and use conventional commits.

- [ ] **Step 4: Run release and full-site verification**

Run: `node --test test/content.test.mjs && npm run validate`  
Expected: PASS; the release page appears in the blog build and all validation commands succeed.

- [ ] **Step 5: Commit maintenance materials**

```bash
git add blog CONTRIBUTING.md README.md test/content.test.mjs
git commit -m "docs: add contributor and release guidance"
```

## Task 6: Add pull-request validation and GitHub Pages deployment workflows

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Test: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: `npm ci` and `npm run validate` from Tasks 1–5.
- Produces: a build check on PRs to `main` and a production GitHub Pages deployment on pushes to `main`.

- [ ] **Step 1: Create a failing workflow-content test**

Add to `test/content.test.mjs`:

```js
test('Pages workflow deploys the Docusaurus build artifact', async () => {
  const workflow = await readFile('.github/workflows/deploy-pages.yml', 'utf8');
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path: build/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/content.test.mjs`  
Expected: FAIL because the deployment workflow does not exist.

- [ ] **Step 3: Implement pull-request build verification**

Create `.github/workflows/ci.yml` with `pull_request` targeting `main`. It must check out the repository, set up Node 20 with npm cache, execute `npm ci`, and execute `npm run validate`. Use `actions/checkout@v4` and `actions/setup-node@v4`.

- [ ] **Step 4: Implement artifact deployment**

Create `.github/workflows/deploy-pages.yml` with `push` to `main`, plus `workflow_dispatch`. Set top-level permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Set concurrency to group `pages` with `cancel-in-progress: false`. The build job must use checkout, Node 20 + npm cache, `npm ci`, `npm run validate`, `actions/configure-pages@v5`, and `actions/upload-pages-artifact@v4` with `path: build`. The deploy job must need `build`, use environment name `github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`, then run `actions/deploy-pages@v4` with id `deployment`.

- [ ] **Step 5: Verify workflow contract and local site**

Run: `node --test test/content.test.mjs && npm run validate`  
Expected: PASS. Inspect both YAML files to confirm their only write permission is `pages: write`; the PR workflow has no deployment action.

- [ ] **Step 6: Document the one-time GitHub setup and commit**

Add to `README.md`: GitHub repository Settings → Pages → Build and deployment → Source → GitHub Actions. Then run:

```bash
git add .github/workflows README.md test/content.test.mjs
git commit -m "ci: deploy site to GitHub Pages"
```

## Task 7: Run release-readiness verification and publish the initial branch

**Files:**
- Modify: any files corrected by verification
- Test: complete project

**Interfaces:**
- Consumes: all code, content, assets, and workflows from Tasks 1–6.
- Produces: a clean, reproducible initial site ready to push to `OpenMAVCam/OpenMAVCam.github.io`.

- [ ] **Step 1: Install from the lockfile in a clean dependency state**

Run: `npm ci`  
Expected: exit 0 with no package-lock changes.

- [ ] **Step 2: Run all verification commands**

Run: `npm test && npm run validate`  
Expected: all Node tests, document validation, and Docusaurus production build pass.

- [ ] **Step 3: Inspect generated routes and static asset output**

Run: `find build -maxdepth 3 -type f | sort`  
Expected: output includes generated home, docs, releases, D64TR route assets, and `.nojekyll`.

- [ ] **Step 4: Inspect the exact change set**

Run: `git status --short && git diff --check`  
Expected: no whitespace errors; only intentional website files are pending or committed.

- [ ] **Step 5: Push the complete initial branch**

Run:

```bash
git remote set-url origin https://github.com/OpenMAVCam/OpenMAVCam.github.io.git
git push -u origin main
```

Expected: the Actions deployment workflow starts, and after the Pages environment is configured, the site is served at `https://openmavcam.github.io/`.

- [ ] **Step 6: Verify the live deployment**

Open the Actions run and confirm its deployment step reports `https://openmavcam.github.io/`; then load the URL and confirm the homepage, D64TR page, Minimum Demo page, and Releases page return successfully.

## Plan Self-Review

- **Spec coverage:** Tasks 1 and 6 implement root-domain Docusaurus/GitHub Pages deployment. Tasks 2 and 3 implement extensible products and the full D64TR data/rendering requirements. Task 4 implements every requested documentation section. Task 5 adds release/changelog and contributor materials. Task 7 provides reproducible verification and push/live checks.
- **No-placeholder review:** The plan contains exact file paths, test commands, product interfaces, required copy, workflow action versions, permissions, and expected results. No deferred implementation markers remain.
- **Type consistency:** `SpecificationRow`, `SpecificationGroup`, and `Product` are defined in Task 2 and consumed under those exact names by `ProductSpecs` and the D64TR MDX page in Task 3.
- **Repository note:** The current workspace contains a read-only, empty `.git` placeholder. Execute this plan in a writable clone of `https://github.com/OpenMAVCam/OpenMAVCam.github.io.git` so the commits and final push in this plan can occur.
