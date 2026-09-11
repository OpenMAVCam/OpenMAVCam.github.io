# OpenMAVCam Website

The official OpenMAVCam documentation and product website, built with Docusaurus.

It introduces the OpenMAVCam MAVLink camera platform, current and future products, architecture, integration guides, protocol behavior, module APIs, and developer guidance. English is the source locale; Simplified Chinese is published under `/zh-CN/`.

Published site: [openmavcam.github.io](https://openmavcam.github.io/)

## Local Development

Install dependencies and start the development server:

```bash
npm ci
npm run start
```

The development server prints a local URL, normally `http://localhost:3000/`.

## Build and Verify

Build the production site for English and Simplified Chinese:

```bash
npm run build
```

Run the complete content and production-build validation before committing:

```bash
npm run validate
```

Preview the generated production site locally:

```bash
npm run serve -- --host 0.0.0.0 --port 3000 --no-open
```

## Content Layout

```text
docs/                         English documentation source
i18n/zh-CN/                  Simplified Chinese documentation mirror
src/                          Docusaurus pages, components, and product data
static/                       Local images and static assets
blog/                         Release notes and announcements
test/                         Content, product, and locale validation
sidebars.ts                   Documentation navigation
```

Every public page in `docs/` requires a matching page under `i18n/zh-CN/docusaurus-plugin-content-docs/current/`. Keep product identifiers, commands, MAVLink names, URLs, and image paths unchanged when translating.

## Publish

GitHub Pages serves this repository at `https://openmavcam.github.io/`.

1. Enable **Settings → Pages → Source → GitHub Actions** for `OpenMAVCam/OpenMAVCam.github.io`.
2. Pull requests run validation.
3. Pushes to `main` build and deploy the static site through GitHub Actions.

For contribution rules, see [Contribution](https://openmavcam.github.io/docs/developer-guide/contribution).
