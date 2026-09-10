---
title: 相机
---

OpenMAVCam 将物理成像载荷呈现为标准 MAVLink 相机组件。`mav-cam` 服务是本地编排层：它使用 MAVSDK 接收相机请求，调度可见光、热成像、AI、渲染和存储服务，再把结果报告给飞行器与地面站。

## 相机架构

<figure>
  <img src="/img/architecture/camera-call-flow.svg" alt="OpenMAVCam 相机调用流程：QGroundControl 和飞控通过 MAVSDK、MavClient、CameraLocalClient、双相机驱动、socket AI 服务、渲染和 SD 卡存储协作" />
  <figcaption>MAVSDK 提供面向 MAVLink 的组件；CameraLocalClient 通过稳定接口协调相机能力和本地服务。</figcaption>
</figure>

## MAVSDK：面向 MAVLink 的相机组件

[MAVSDK](https://mavsdk.mavlink.io/) 是 `mav-cam` 将载荷公开为相机组件时使用的 MAVLink SDK。`MavClient` 创建 MAVSDK server 插件并将回调连接到本地相机实现，因此各相机驱动无需重复实现 MAVLink 消息解析和命令响应。

| MAVSDK 接口 | 在 `mav-cam` 中的作用 |
| --- | --- |
| `CameraServer` | 相机信息、拍摄、录像、变焦、设置、存储、拍摄状态和视频流信息 |
| `ParamServer` | 相机设置变更和参数发布 |
| `TrackingServer` | 指点跟踪、关闭跟踪及对应命令响应 |
| `FtpServer` | 访问配置的载荷文件根目录 |

这使 QGroundControl、PX4、ArduPilot 和其他 MAVLink 客户端获得标准相机契约，同时将传感器特定实现隐藏在本地 C++ 接口后。

## `mav-cam` 调用流程

1. `MavClient` 打开 MAVLink 连接并创建 MAVSDK Camera 组件。
2. 它注册 `CameraServer`、`ParamServer`、`TrackingServer` 回调，并为设备端硬件选择 `CameraLocalClient`（或选定 RPC 后端时选择 RPC 客户端）。
3. `CameraLocalClient` 动态加载本地服务库、初始化接口，并通过 MAVSDK 发布相机信息和 RTSP 流描述。
4. 拍照、录像、变焦、3A 设置、存储查询和指点跟踪等 MAVLink 请求被转发至对应的本地服务。
5. 相机帧和 AI 结果经回调返回；渲染器生成合成预览，存储和操作状态通过 MAVSDK server 插件回报。

## 可见光相机抽象

可见光后端实现 `qcom-cam/interface/mav_camera.h` 中的 `mav_camera::MavCamera` 接口。`CameraLocalClient` 加载 `libqcom_camera.so` 并经工厂创建实现，因此 MAVLink 层不依赖具体 Qualcomm 传感器驱动。

`MavCamera` 提供 `prepare`、`open`、`close` 和 `MAVFrame` 回调，以及拍照、录像、实时流、时间戳、预览/照片/视频分辨率、H.264/H.265 编码选择、白平衡、自动/手动曝光、曝光补偿、ISO、快门、测光、锐化、AE 锁、变焦、JPEG/DNG 格式和 JPEG 质量控制。`Options` 还支持共享 NV12 预览帧；本地客户端在打开相机前注册 RGB 回调并将帧交给渲染路径。

## 热成像相机抽象

热成像后端实现 `ir-cam/interface/ir_camera.h` 中的 `ir_camera::IRCamera`，作为 `libir_camera.so` 加载，并与 RGB 回调并行提供 `IRFrame` 捕获回调。它支持红外采集启停、调色板/颜色模式、FFC 模式和手动 FFC、矩形测温、热成像拍照、录像、实时流和编码选择。

本地客户端先初始化 RGB 服务，将热成像初始化视为可选项；因此红外模块缺失或打开失败时，可见光相机仍可工作。

## AI 功能：基于 Socket 的检测和跟踪

AI 推理与相机控制进程保持独立。`TrackingServer` 在配置的本地 **TCP socket**（当前为 `127.0.0.1:14600`）监听；AI 服务发送包含流/帧标识、对象名称、坐标和尺寸的**按行 JSON**数据。

`CameraLocalClient` 经回调接收数据、保存最新 `TrackingFrame`，并把对象转成渲染器的 **AI bounding boxes**。反向方向上，MAVSDK 的跟踪点和关闭跟踪命令会转为紧凑 socket 控制包，以启用检测、请求目标点或禁用跟踪，使模型执行与相机/MAVLink 控制可独立替换。

## 渲染和存储库

`CameraLocalClient` 加载 `librender_bridge.so` 并请求 `RenderBridge` 后端。该接口支持 **Weston、DRM 或 V4L2** 渲染目标，以及全屏 RGB/热成像、左右并排、画中画、叠加和混合布局；它在合成预览上绘制 OSD 和 AI 边界框。详见[视频流](/docs/architecture/video-streaming)。

它还加载 `libstorage_manager.so` 并为 **SD card** 创建 `StorageManager`。存储库提供可写路径、容量/状态更新、媒体索引与格式化；拍摄前本地客户端检查可用容量，文件写入当前存储路径，状态再通过 MAVSDK `CameraServer` 返回。

## 扩展边界

新增传感器或平台时，保留 MAVSDK 和 `CameraLocalClient` 层，再实现相应本地接口（`MavCamera`、`IRCamera`、`RenderBridge` 或 `StorageManager`）。这样可稳定保持 MAVLink 相机行为，同时独立演进硬件驱动、AI 模型、渲染目标和存储实现。

消息语义请继续阅读 [MAVLink 相机协议](/docs/protocol/mavlink-camera-protocol)；合成 RTSP 输出请参阅[视频流](/docs/architecture/video-streaming)。
