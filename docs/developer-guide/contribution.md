---
title: Contribution
---

# Contribution

## Welcome

OpenMAVCam welcomes improvements to code, documentation, translations, product integrations, test coverage, and reproducible bug reports. Public content and discussion must be in English so the global project can review and maintain it.

Contributions must be respectful, technically focused, and limited to work the contributor is authorized to share. Do not include credentials, private keys, customer data, proprietary Qualcomm packages, or other material that cannot be redistributed.

## Before You Start

1. Search existing issues, discussions, documentation, and open pull requests to avoid duplicate work.
2. For a bug, record the product, image/software revision, connected autopilot or GCS version, exact reproduction steps, expected behavior, actual behavior, and relevant sanitized logs.
3. For a feature or behavior change, describe the problem, proposed interface, affected modules, compatibility impact, and validation plan before writing a large patch.
4. Keep a contribution focused on one problem. Discuss architectural changes before implementation.

## Choose the Owning Module

Make the change in the module that owns the behavior:

| Change | Owning area |
| --- | --- |
| RGB sensor, capture, recording, stream pipeline | `qcom-cam` |
| Thermal camera, palette, FFC, temperature functions | `ir-cam` |
| MAVLink camera, settings, FTP, tracking bridge | `mav-cam` |
| Composition, OSD, AI overlay, display backend | `render-bridge` |
| Media capacity, paths, and formatting | `storage-manager` |
| Detection and target association | `object-detection`, `object-tracking` |
| Gimbal service and control | `gimbal-server` |
| Image recipes, package dependencies, deployment | relevant `poky/meta-*` layer |
| Website content and product information | `OpenMAVCam.github.io` |

Do not change generated files, vendored third-party code, or a product manifest revision unless the change explicitly requires it.

## Prepare Your Branch

1. Start from the current target branch and update local references.
2. Create a descriptive branch, for example `fix/camera-storage-status` or `docs/d64tr-deploy`.
3. Make small, reviewable commits. One commit should represent one logical change and must not contain unrelated formatting churn.
4. Use Conventional Commit subjects where applicable, such as `fix(mav-cam): report unavailable storage` or `docs: clarify D64TR deployment`.

## Write the Change

### C/C++ and Runtime Modules

- Follow the [Coding Style](./coding-style.md): Google C++ baseline and clang-format 15 for OpenMAVCam-maintained code.
- Preserve public interfaces unless an approved compatibility change is required.
- Check all result, callback, and timeout paths; hardware/service absence must fail safely.
- Add or update the closest unit test, module test, or demo. Validate the changed module before full payload integration.
- Do not retain callback-owned camera frame memory after the callback returns.

### Documentation and Website

- Add a `title` field to every Markdown or MDX page.
- Keep English documentation under `docs/` and add the matching Simplified Chinese page under `i18n/zh-CN/docusaurus-plugin-content-docs/current/`.
- Keep technical literals unchanged in translation: product identifiers, commands, MAVLink names, URLs, and image paths.
- Keep sidebar IDs ordered. Store D64TR product values in `src/data/products/d64tr.ts`, not duplicated in page prose.
- Add images to the repository; do not hotlink product images or external assets.
- Create a release note as `blog/YYYY-MM-DD-<slug>.md` when the change is release-worthy.

## Verify Before Opening a Pull Request

Run the checks that prove the changed behavior. At minimum, run the owning module’s formatter and test/demo. For website changes:

```bash
npm ci
npm run validate
```

`npm run validate` runs the content tests and builds both English and Simplified Chinese static sites. Fix formatting, test, link, MDX, and build failures before requesting review.

For hardware-dependent changes, state the test environment and exact evidence: product, firmware/image revision, sensor/GCS/autopilot connection, command sequence, observed result, and relevant sanitized log excerpt.

## Open a Pull Request

Use a clear title and include:

1. The problem and why the change is needed.
2. The implementation summary and affected modules.
3. Any compatibility, configuration, migration, or hardware impact.
4. Verification commands and results, including what was not tested and why.
5. Screenshots, video, logs, or protocol traces when they make behavior reviewable.
6. Linked issue or design discussion when one exists.

Keep the pull request narrow. Separate refactoring, formatting-only changes, generated output, dependency upgrades, and behavioral changes unless they cannot be reviewed independently.

## Review and Follow-up

- Respond to review comments with technical context and update the branch rather than opening duplicate pull requests.
- Rebase or resolve conflicts when requested, then rerun relevant validation.
- Maintainers decide when a contribution is ready to merge and may request a smaller scope, tests, documentation, or compatibility evidence.
- After merge, monitor the affected integration and report regressions with the commit or release reference.

## Security and Sensitive Reports

Do not create a public issue for a suspected security vulnerability, credential exposure, private data leak, or proprietary-package distribution problem. Contact the project maintainers privately with a minimal reproduction, affected revision, impact, and safe mitigation details. Do not publish exploit code or sensitive artifacts until maintainers agree on disclosure.
