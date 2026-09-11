---
title: AI
---

# AI

## 目的

在 D64TR 载荷端运行视觉模型，并将检测和跟踪结果提供给渲染器及 MAVLink 相机服务。AI 服务与 `mav-cam` 分离，因此模型或推理变更不会改变 MAVLink 相机控制链路。

## 输入 / 前置条件

| 项目 | 要求值 |
| --- | --- |
| 目标平台 | D64TR / QRB5165 |
| SDK 版本 | SNPE 2.20.0 |
| SDK 权限 | Qualcomm ID、QPM 访问权限、已接受许可证 |
| 模型来源 | 已训练 ONNX 模型，具有明确输入/输出 tensor、标签及预处理 |
| 运行时资产 | DLC、标签、模型配置及匹配的目标端库 |

## 运行流程

```text
ONNX model → SNPE converter → DLC → target inference service
           → detection / tracking frame → renderer + MAVLink camera path
```

### Install SNPE

D64TR 使用 SNPE 2.20.0。不要因为 QPM 显示更高版本就替换它：转换工具和目标端运行时必须与产品镜像匹配。

```bash
qpm-cli --login <qualcomm-id>
qpm-cli --license-activate qualcomm_neural_processing_sdk
qpm-cli --extract /path/to/snpe-2.20.0-installer.qik
export SNPE_ROOT=/opt/qcom/aistack/snpe/<installed-2.20.0-directory>
source "$SNPE_ROOT/bin/envsetup.sh"
snpe-onnx-to-dlc --help
snpe-dlc-info --help
```

从 Qualcomm 账户可用的软件包中选择 SNPE 2.20.0 Linux 版本。OpenMAVCam 不重新分发 QPM、SNPE、Qualcomm 运行时或许可证。

### 使用 SNPE 移植模型

```bash
snpe-onnx-to-dlc --input_network model.onnx --output_path model.dlc
snpe-dlc-info --input_dlc model.dlc
snpe-dlc-quantize --input_dlc model.dlc --input_list calibration.txt --output_dlc model-quantized.dlc
snpe-net-run --container model.dlc --input_list input_list.txt
```

| 步骤 | 必须检查项 |
| --- | --- |
| 导出 | 记录 ONNX tensor 名称、形状、布局、色彩顺序、归一化、标签和输出解码方式。 |
| 转换 | 使用真实的输入尺寸、输出节点及模型专用转换参数。 |
| 检查 | 用 `snpe-dlc-info` 确认 DLC tensor。 |
| 量化 | 仅在产品集成需要时使用代表性校准数据。 |
| 部署 | 一并复制 DLC、标签和配置，并在 D64TR 目标端验证。 |

## 源码入口

| 职责 | 组件 |
| --- | --- |
| MAVLink 相机控制 | `mav-cam` |
| 检测集成 Demo | [object-detection](https://github.com/OpenMAVCam/object-detection) |
| 跟踪集成 Demo | [object-tracking](https://github.com/OpenMAVCam/object-tracking) |
| 跟踪控制 / 叠加层 | 本地 tracking service、`TrackingFrame`、renderer |

## 输出

| 输出 | 使用方 |
| --- | --- |
| 类别 ID、置信度、边界框 | renderer 和 detection client |
| 已选目标 / 跟踪更新 | 本地 tracking service 和 live preview |
| 跟踪控制状态 | MAVLink tracking response path |

## 状态和数据字段

- 启用 AI function 会启动所需 detection/tracking service。
- 禁用 AI 会停止服务、清除缓存的 tracking 数据，并移除渲染框。
- 模型输入/输出契约属于产品数据；变更时必须同步修改预处理和后处理。

## 失败条件

- ONNX 转 DLC 成功不代表目标端精度、时延或加速器兼容性已通过。
- SNPE 版本、运行时库、tensor 布局、标签或输出解码不匹配会导致集成无效。
- 已接受的 tracking 命令不保证模型已经获取目标。

## 验证

1. 运行 `snpe-dlc-info` 及目标端 `snpe-net-run` 冒烟测试。
2. 运行 [object-detection](https://github.com/OpenMAVCam/object-detection)，确认类别 ID、置信度、框和时延。
3. 运行 [object-tracking](https://github.com/OpenMAVCam/object-tracking)，确认获取、更新、丢失和 tracking-off 行为。
4. 发布前使用任务数据验证自训练模型。

## 参考

- [SNPE 安装指南](https://docs.qualcomm.com/bundle/publicresource/topics/80-70015-15B/snpe-download.html)
- [使用 SNPE 移植模型](https://docs.qualcomm.com/bundle/publicresource/topics/80-70014-15B/snpe-port-model.html)
- [目标跟踪](../protocol/tracking.md)
