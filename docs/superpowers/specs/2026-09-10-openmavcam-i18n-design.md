# OpenMAVCam Chinese / English Internationalization Design

**Date:** 2026-09-10

**Status:** Approved for implementation planning

## Goal

Serve English and Simplified Chinese from the same GitHub Pages site without separate domains. English remains the canonical source and default locale; Chinese is a complete visitor-facing translation at the `zh-CN` locale route.

| Locale | Entry URL | Content ownership |
| --- | --- | --- |
| English (`en`) | `https://openmavcam.github.io/` | Existing `docs/`, React source, and site configuration |
| Simplified Chinese (`zh-CN`) | `https://openmavcam.github.io/zh-CN/` | Docusaurus i18n translation directories |

## Scope

Translate all visitor-facing text: every active documentation and product page, the homepage, navbar, footer, sidebar labels, buttons, metadata, and release content. Do not translate or duplicate bitmap/SVG image assets; both locales use the same paths under `static/img/`.

Internal planning and skill artifacts under `docs/superpowers/` are excluded from the public translation scope.

## Docusaurus Architecture

1. Enable `['en', 'zh-CN']` in `docusaurus.config.ts`, retaining `en` as `defaultLocale`.
2. Add the built-in locale dropdown to the navbar. It renders `English` and `简体中文`, and Docusaurus maps equivalent docs between `/docs/...` and `/zh-CN/docs/...`.
3. Use Docusaurus-generated locale scaffolding under `i18n/zh-CN/`:
   - `docusaurus-plugin-content-docs/current/` for Chinese Markdown/MDX copies;
   - theme translation JSON for navbar/footer and generated UI strings;
   - code translation JSON for custom React page strings.
4. Replace hard-coded homepage and configuration labels with Docusaurus translation keys so English remains in source code and Chinese is supplied by the `zh-CN` locale catalog.
5. Keep document IDs, slugs, media URLs, code blocks, command lines, MAVLink message names, library names, and product model identifiers unchanged. Translate prose, headings, table labels, captions, alt text, and UI labels only.

## Content Workflow

English is edited first in its existing location. Any new or changed visitor-facing English page requires its corresponding `zh-CN` translation in the same change set. CI validates both locales with the normal Docusaurus build, preventing a successful English build from hiding a broken Chinese route.

The locale selector changes only text and route prefix. It does not switch domains, create a second deployment, or duplicate `static/` assets.

## Navigation and Links

The Chinese sidebar preserves the English information architecture and document IDs while translating category and page labels. Internal document links use Docusaurus document links or locale-aware URLs so the reader stays in the selected locale. External links remain unchanged.

When a localized counterpart does not exist during migration, the selector may fall back to the locale home page rather than link to a missing document. This state is temporary; release acceptance requires all public pages to have Chinese counterparts.

## Verification

Implementation is accepted only when:

1. English root routes and `zh-CN` routes both build successfully.
2. The locale dropdown appears in the navbar and changes routes without a domain change.
3. All active documentation IDs resolve in both locales.
4. The Chinese homepage, navigation, footer, and representative pages from every sidebar category render Chinese text.
5. Images are reused from identical `/img/...` paths in both locales.
6. `npm run validate` and `git diff --check` pass.
