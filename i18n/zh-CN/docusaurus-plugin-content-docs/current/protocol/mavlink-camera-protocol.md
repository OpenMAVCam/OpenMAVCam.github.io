---
title: MAVLink 相机协议
---

OpenMAVCam 将 [MAVLink Camera Protocol v2](https://mavlink.io/en/services/camera.html) 实现为通用载荷控制面。协议涵盖相机发现、能力、设置、拍摄、存储、视频流元数据和跟踪；`mav-cam` 使用 MAVSDK server 插件实现该契约，并将操作转发给 `CameraLocalClient`。

## Camera Protocol v2 实现

<figure>
  <img src="/img/protocol/mavlink-camera-protocol-flow.svg" alt="QGroundControl 通过 MAVLink Camera Protocol v2 发现 OpenMAVCam 相机，MavClient CameraServer 将命令路由至 CameraLocalClient 并发布相机信息、视频流信息和状态" />
  <figcaption>协议消息和确认使用 MAVLink；实时视频使用已发布的 RTSP endpoint。</figcaption>
</figure>

## 发现与能力发布

GCS 通过相机 MAVLink component heartbeat 发现相机，并用 `MAV_CMD_REQUEST_MESSAGE` 请求 `CAMERA_INFORMATION`。在 `mav-cam` 中，`MavClient` 创建 MAVSDK `CameraServer`，请求 `CameraLocalClient` 填充相机信息，再调用 `set_information()` 激活并发布相机能力模型。

`CAMERA_INFORMATION` 宣告拍摄、视频、推流、变焦、设置、存储和跟踪能力，也可携带 **Camera Definition File** URI。当前本地实现会在定义文件存在时发布 `mftp://definition/...` URI；MAVSDK `FtpServer` 提供配置的载荷文件根目录供兼容 GCS 获取。

## `mav-cam` 协议映射

| Camera Protocol v2 功能 | `mav-cam` 实现 |
| --- | --- |
| 发现和能力 | `CameraServer` + `CameraLocalClient::fill_information()` + `set_information()` → `CAMERA_INFORMATION` |
| 流发现 | `fill_video_stream_info()` + `set_video_stream_info()` → `VIDEO_STREAM_INFORMATION`，URI 为 `rtsp://<camera-ip>/live` |
| 相机模式、变焦、拍摄、录像、推流启停 | `CameraServer.subscribe_*` 回调将命令转给 `CameraLocalClient`，再返回等效 `COMMAND_ACK` 的 MAVSDK 反馈 |
| 设置和定义驱动 UI | `CameraServer` 设置回调返回 `CAMERA_SETTINGS`；`ParamServer` 将 UI 变更映射到本地相机设置 |
| SD 卡状态和格式化 | 存储回调返回 `STORAGE_INFORMATION`；格式化请求委派给本地存储管理器 |
| 拍摄状态 | `fill_capture_status()` 返回 `CAMERA_CAPTURE_STATUS` |
| 指点跟踪 | `TrackingServer` 将跟踪点/关闭命令映射至本地 AI/跟踪服务 |

## 命令、结果和状态

CameraServer 订阅相机时间、变焦、拍照、录像启停、推流启停、模式、存储信息/格式化、拍摄状态、设置和重置设置请求。每个回调将工作转发给 `CameraLocalClient`，并通过正常 MAVLink `COMMAND_ACK` 流程报告成功或失败。

交互拍摄时，客户端会收到命令结果和 `CAMERA_CAPTURE_STATUS`；成功拍照后 `mav-cam` 还报告拍摄反馈。存储方面，服务会在接受媒体操作前从 SD 卡管理器返回容量和状态。

## 视频流元数据

协议发布视频配置，而不是编码图像负载。`VIDEO_STREAM_INFORMATION` 携带 stream ID、URI、分辨率、帧率、码率、旋转、频谱和状态。`mav-cam` 当前发布一条运行中的预览流，`stream_id = 1`，URI 为 `rtsp://<camera-ip>/live`。

**视频帧不通过 MAVLink 传输。** MAVLink 告诉 QGroundControl 如何发现和控制流；以太网上的 RTSP 承载 H.264/H.265 预览。合成单码流管线请见[视频流](/docs/architecture/video-streaming)。

## 设置和 Camera Definition

Camera Protocol v2 的 definition-file 机制让 GCS 根据相机提供的元数据构建设置 UI。`mav-cam` 在 `CameraLocalClient` 中维护面向协议的设置列表；`ParamServer` 接收参数变更并转换为本地设置操作。它覆盖模式、图像/视频格式、3A 控制、变焦、热成像 palette/FFC 及 AI 功能选择，而无需厂商专属地面站 UI。

## 跟踪扩展与实现边界

相机跟踪通过 MAVSDK `TrackingServer` 集成公开。指点跟踪请求会交给[相机](/docs/architecture/camera)所述基于 socket 的本地跟踪服务；检测结果作为叠加层渲染，并可按选定客户端和 GCS 实现通过标准跟踪状态路径返回。

OpenMAVCam 优先遵循标准 Camera Protocol v2 语义，将硬件特定行为保留在 `CameraLocalClient` 之下，因此 GCS 和飞控可使用标准发现与命令，而可见光、红外、AI、渲染和存储实现可独立演进。详情参阅[官方 Camera Protocol v2 指南](https://mavlink.io/en/services/camera.html)。
