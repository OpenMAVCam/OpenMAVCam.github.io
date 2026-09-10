---
title: 视频流
---

OpenMAVCam 在编码并发送至地面站前，将可见光、热成像、AI 叠加和 OSD 合成为**一路预览流**。操作员只需打开、解码和录制一个视频流。

## 单码流视频架构

<figure>
  <img src="/img/architecture/video-streaming-pipeline.svg" alt="OpenMAVCam 将 RGB、热成像、AI 边界框和 OSD 合成为一条供 QGroundControl 使用的 RTSP 视频流" />
  <figcaption>合成只在相机端进行一次。QGroundControl 接收一条低延迟预览流，相机控制仍通过 MAVLink。</figcaption>
</figure>

### 在相机端合成

相机端渲染器使用 **Weston composition**，在同一输出表面中保持输入层对齐：

- **RGB** 可见光帧和**热成像**帧按所选布局放置；
- 启用 AI 时，在传感器图像上绘制 **AI bounding boxes**；
- 在图像和 AI 图层上绘制 **OSD** 文字与状态。

这与 Weston 实现一致：独立的视频、红外、边界框和 OSD surface 按固定 z-order 合成，然后交付至推流路径。

| 模式 | 合成输出 |
| --- | --- |
| RGB / thermal | 全屏可见光或热成像预览 |
| Side-by-side | 左侧 RGB、右侧热成像 |
| Picture-in-Picture | 一个传感器全屏，另一个作为小窗 |
| Superimpose | 用选定渲染模式叠加传感器图像 |
| Mix | 融合可见光与热成像 |

## 一路编码流，一个地面站视图

合成后，预览使用 **H.264 或 H.265** 编码，并以单个 RTSP endpoint 暴露，例如 `rtsp://<camera-ip>/live`。相机通过 **MAVLink Camera Protocol** 发布 endpoint、分辨率、帧率、码率和流状态。

QGroundControl 只接收一个流描述并打开一个视频源，不需要同步独立的 RGB、热成像、OSD 和 AI 流，也不必在地面端重建布局。这为支持的 QGroundControl 配置提供直接、完整兼容的预览路径，而相机控制、拍照、变焦、跟踪和状态仍走 MAVLink。

## 为什么集成更快、延迟更低

1. 相机在靠近源的位置一次性合成传感器帧和叠加层。
2. 编码器只处理一张最终帧，而不是多个独立解码源。
3. 地面站使用**一个解码器**和一个显示时钟。
4. MAVLink 与视频负载分离，只承载紧凑的控制和状态消息。

避免客户端多流合成后，操作员应用无需同步独立网络流、安排图层或对齐叠加时间戳，从而减少缓冲和集成工作，支持**低延迟**视图以及与 QGroundControl 和其他 MAVLink 应用的**快速集成**。

## QGroundControl 集成

OpenMAVCam 通过 MAVLink Camera Protocol 宣告运行中的流，并经以太网直接提供视频。正常流程是连接相机网络，将 MAVLink 接至飞行器或模拟器，再由 QGroundControl 发现相机和流信息。

已验证的桌面流程和 QGroundControl 版本请参见 [QGroundControl](/docs/getting-started/qgroundcontrol)。预览分辨率、码率和 H.264/H.265 选择等设置请参阅[配置](/docs/api-reference/configuration-interfaces)。

## 实现边界

Weston 是合成阶段，负责创建并叠放 RGB、红外、AI 和 OSD surface；视频编码器和 RTSP 发布器位于合成预览下游。职责分离使传输或编码设置可独立调整，而无需修改面向相机的合成 API 或 MAVLink 控制接口。
