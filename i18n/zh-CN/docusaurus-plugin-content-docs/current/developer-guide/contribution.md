---
title: 参与贡献
---

# 参与贡献

## 欢迎贡献

OpenMAVCam 欢迎对代码、文档、翻译、产品集成、test coverage 和可复现 bug report 的改进。为了让全球项目可以 review 和维护，public content 和 discussion 必须使用 English。

贡献必须保持尊重、聚焦技术，并且只包含 contributor 有权分享的内容。不可包含 credential、private key、customer data、proprietary Qualcomm package 或其他不能再分发的材料。

## 开始前

1. 搜索现有 issue、discussion、documentation 和 open pull request，避免重复工作。
2. 对于 bug，记录 product、image/software revision、已连接 autopilot 或 GCS version、精确复现步骤、expected behavior、actual behavior 和已脱敏的相关 log。
3. 对于 feature 或 behavior change，在编写大 patch 前描述问题、proposed interface、affected module、compatibility impact 和 validation plan。
4. 一个 contribution 只解决一个问题。architectural change 在实现前先讨论。

## 选择 Owning Module

在拥有行为的 module 中修改：

| 修改内容 | Owning area |
| --- | --- |
| RGB sensor、capture、recording、stream pipeline | `qcom-cam` |
| Thermal camera、palette、FFC、temperature function | `ir-cam` |
| MAVLink camera、setting、FTP、tracking bridge | `mav-cam` |
| Composition、OSD、AI overlay、display backend | `render-bridge` |
| Media capacity、path 和 formatting | `storage-manager` |
| Detection 和 target association | `object-detection`、`object-tracking` |
| Gimbal service 和 control | `gimbal-server` |
| Image recipe、package dependency、deployment | 对应的 `poky/meta-*` layer |
| Website content 和 product information | `OpenMAVCam.github.io` |

除非修改明确需要，否则不要变更 generated file、vendored third-party code 或 product manifest revision。

## 准备 Branch

1. 从当前 target branch 开始，并更新本地 reference。
2. 创建描述性 branch，例如 `fix/camera-storage-status` 或 `docs/d64tr-deploy`。
3. 编写小而可 review 的 commit。一个 commit 代表一个 logical change，不能包含无关 formatting churn。
4. 适用时使用 Conventional Commit subject，例如 `fix(mav-cam): report unavailable storage` 或 `docs: clarify D64TR deployment`。

## 编写修改

### C/C++ 和 Runtime Module

- 遵循[编码风格](./coding-style.md)：OpenMAVCam 维护代码使用 Google C++ baseline 和 clang-format 15。
- 除非需要经过批准的 compatibility change，否则保持 public interface。
- 检查所有 result、callback 和 timeout path；hardware/service 缺失时必须安全失败。
- 添加或更新最近的 unit test、module test 或 demo。full payload integration 前先验证修改的 module。
- 不可在 callback 返回后保留 callback-owned camera frame memory。

### Documentation 和 Website

- 每个 Markdown 或 MDX page 都添加 `title` field。
- English documentation 放在 `docs/`；在 `i18n/zh-CN/docusaurus-plugin-content-docs/current/` 添加对应 Simplified Chinese page。
- translation 中保持 technical literal 不变：product identifier、command、MAVLink name、URL 和 image path。
- 保持 sidebar ID 有序。D64TR product value 存放在 `src/data/products/d64tr.ts`，不可在 page prose 中重复。
- 将 image 加入 repository；不可 hotlink product image 或 external asset。
- 变更值得发布时，创建 `blog/YYYY-MM-DD-<slug>.md` release note。

## Open Pull Request 前验证

运行能够证明修改行为的检查。至少运行 owning module 的 formatter 和 test/demo。对 website change：

```bash
npm ci
npm run validate
```

`npm run validate` 会运行 content test 并构建 English 和 Simplified Chinese static site。请求 review 前，修复 formatting、test、link、MDX 和 build failure。

对于 hardware-dependent change，说明 test environment 和精确 evidence：product、firmware/image revision、sensor/GCS/autopilot connection、command sequence、observed result 和相关 sanitized log excerpt。

## Open Pull Request

使用清晰 title，并包含：

1. 问题以及为何需要修改。
2. implementation summary 和 affected module。
3. compatibility、configuration、migration 或 hardware impact。
4. verification command 和 result，包括未测试的内容及原因。
5. 便于 review behavior 的 screenshot、video、log 或 protocol trace。
6. 存在时链接对应 issue 或 design discussion。

保持 pull request 窄范围。将 refactoring、formatting-only change、generated output、dependency upgrade 和 behavior change 分开，除非它们无法独立 review。

## Review 和 Follow-up

- 使用技术上下文回应 review comment，并更新 branch，而不是创建重复 pull request。
- 需要时 rebase 或解决 conflict，然后重新运行相关 validation。
- Maintainer 决定 contribution 何时可 merge，并且可能要求更小 scope、test、documentation 或 compatibility evidence。
- merge 后监控受影响 integration，并以 commit 或 release reference 报告 regression。

## Security 和 Sensitive Report

不可为 suspected security vulnerability、credential exposure、private data leak 或 proprietary-package distribution problem 创建 public issue。使用 private channel 联系 project maintainer，并提供 minimal reproduction、affected revision、impact 和安全的 mitigation detail。未与 maintainer 达成 disclosure 一致前，不发布 exploit code 或 sensitive artifact。
