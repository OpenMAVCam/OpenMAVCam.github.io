---
title: 相机信息
---

# 相机信息

## 目的

通过 `CAMERA_INFORMATION` 发布相机身份、光学元数据、支持的操作及 Camera Definition File 端点。

## 输入 / MAVLink 请求

| 项目 | 值 |
| --- | --- |
| GCS 请求 | 请求 `CAMERA_INFORMATION` 的 `MAV_CMD_REQUEST_MESSAGE` |
| 身份来源 | 设备产品品牌、型号和固件版本 |
| 光学来源 | `mav_camera::MavCamera::get_information()` |
| Definition file | `mftp://definition/<model_name>.xml` |

## 运行流程

```text
GCS request
  → MAVSDK CameraServer
  → registered Information object
  → CAMERA_INFORMATION

MavClient::initialize()
  → CameraLocalClient::fill_information()
  → MavCamera::get_information()
  → CameraServer::set_information()
```

## 源码入口

| 职责 | 位置 / 符号 |
| --- | --- |
| 注册信息 | `mav-cam/src/mav_client/mav_client.cpp` · `CameraServer::set_information()` |
| 构造信息 | `mav-cam/src/mav_client/camera_local_client.cpp` · `CameraLocalClient::fill_information()` |
| RGB 硬件抽象 | `qcom-cam/interface/mav_camera.h` · `MavCamera::get_information()` |
| Definition file 传输 | 由 `MavClient` 配置的 MAVSDK `FtpServer` |

## 输出 / MAVLink 响应

| `CAMERA_INFORMATION` 字段组 | OpenMAVCam 值 |
| --- | --- |
| 厂商、型号、固件 | `product_brand_from_device()`、`product_name_from_device()`、`firmware_version_from_device()` |
| 镜头和传感器元数据 | 来自 `MavCamera::get_information()` 的焦距、传感器尺寸、分辨率、镜头 ID |
| Definition 元数据 | `definition_file_version_from_device(model_name)` 的版本；URI 为 `mftp://definition/<model_name>.xml` |
| 能力位 | `CaptureImage`、`CaptureVideo`、`HasModes`、`HasVideoStream`、`HasBasicZoom`、`HasTrackingPoint` |

## 状态和数据字段

- 新 RGB 相机必须在 `get_information()` 实现真实光学和分辨率数据。
- 只有后端及 MAVLink 响应链路均可用时才声明能力位。
- 发布的 XML schema 或设置枚举变化时，必须增加 Definition File 版本。

## 失败条件

RGB 后端不可用时，`fill_information()` 返回 `CameraServer::Result::NoSystem`，并使用 `Unknown`、`0.0.0.0`、零光学参数和空 Definition URI 等回退值。产品集成应在调用 `set_information()` 前检查该结果，并在本地相机服务就绪后重试。

## 验证

1. 启动相机和 MAVLink 服务。
2. 从 QGroundControl 请求 `CAMERA_INFORMATION`。
3. 将身份、分辨率、焦距、能力位和 Definition URI 与产品配置比对。
4. 通过 MFTP 获取 Definition XML，确认 GCS 可渲染设置。
5. 停止 RGB 后端，确认不会发布不完整的 `Unknown` 记录。

## 参考

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
