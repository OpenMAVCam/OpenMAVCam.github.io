---
title: 许可证
---

# 许可证

## OpenMAVCam 代码

OpenMAVCam 编写的代码采用 **Apache License, Version 2.0**（Apache-2.0）。除非文件包含不同的 license notice，contributor 必须以 Apache-2.0 添加新的 OpenMAVCam 代码，并保留既有 copyright 和 license header。

Apache-2.0 仅适用于 OpenMAVCam 代码。它不会替换、重新授权或移除 source tree 或 product image 中 third-party、vendor、binary、model、firmware 或 SDK dependency 的义务。

## Third-Party License List

以下条目由 D64TR source workspace 中的 license file 或 build metadata 确认。这是 component index，不替代特定 product image 随附的完整 notice。

| Component | License / terms | D64TR workspace 中的证据 |
| --- | --- | --- |
| MAVSDK | BSD 3-Clause | `src/vendor/aeroratech/MAVSDK/LICENSE.md` |
| Adobe XMP Toolkit SDK | BSD 3-Clause | `src/vendor/aeroratech/XMP-Toolkit-SDK/LICENSE` |
| 用于 DeepSORT 的 ONNX Runtime | MIT | `src/vendor/aeroratech/object-tracking/deepsort/3rdParty/onnxruntime-linux-aarch64-1.12.1/LICENSE` |
| Qualcomm proprietary camera、BSP、graphics 和 related package | Qualcomm Technologies proprietary terms | `poky/meta-qti-camera-prop/` 及相关 `meta-qti-*-prop` recipe metadata 声明 `Qualcomm-Technologies-Inc.-Proprietary` 或 `QTI-Proprietary`。 |

D64TR build 还通过 Yocto recipe 和 component-specific third-party tree 引入 dependency。适用的 license text、notice、source-offer requirement 和 redistribution term 以实际构建到 image 的版本为准。

## Distribution 规则

1. 保留 OpenMAVCam-authored code 的 Apache-2.0 notice。
2. 保留所有 shipped component 要求的 third-party copyright notice、license text、NOTICE file、attribution 和 source-disclosure obligation。
3. 除非适用 vendor agreement 明确允许，不可分发 Qualcomm proprietary package、SNPE、firmware、binary blob、SDK installer、model asset 或其他 restricted material。
4. 添加或升级 dependency 时，在 release 前记录其 exact version、license、notice location、build inclusion path 和 redistribution requirement。
5. 在 release approval 中生成并 review product-image license/notice inventory；source checkout 不一定代表 image 中交付的所有 binary。

## Contributor 规则

- 仅提交你有权以 Apache-2.0 贡献的 code 和 asset。
- 未保留其 license 且未取得 compatibility 和 distribution obligation review 前，不可将 third-party code 复制到 OpenMAVCam module。
- 将 vendor-proprietary code 和 credential 保持在 public repository 与 pull request 之外。
- 文件已有不同 license notice 时，应保留它；修改或移动前询问 maintainer。

## Legal Review 说明

本页描述项目 engineering policy 和 D64TR workspace 中可用的 license evidence，不构成 legal advice。发布 product 的组织必须对所发布 image 的 exact bill of materials、component license、notice 和 commercial agreement 进行 review。
