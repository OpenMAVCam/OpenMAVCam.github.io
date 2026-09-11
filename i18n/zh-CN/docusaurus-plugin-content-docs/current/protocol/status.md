---
title: 状态
---

# 状态

## 目的

将相机参数、拍摄状态、存储状态和视频码流元数据作为标准 MAVLink 相机响应发布。

## 输入 / MAVLink 请求

| 请求的状态 | `MavClient` callback | 本地构造方法 |
| --- | --- | --- |
| `CAMERA_SETTINGS` | `subscribe_settings()` | `fill_settings()` |
| `CAMERA_CAPTURE_STATUS` | `subscribe_capture_status()` 和拍照完成 | `fill_capture_status()` |
| `STORAGE_INFORMATION` | `subscribe_storage_information()` | `fill_storage_information()` |
| Video stream metadata | 初始化发布 | `fill_video_stream_info()` |
| 详细参数 | MAVSDK `ParamServer` / `FtpServer` | 本地 settings map 和 Definition File |

## 运行流程

```text
GCS request → MAVSDK callback → cached camera / storage / stream state
            → fill_*() → standard MAVLink response → GCS
```

## 源码入口

| 职责 | 位置 / 符号 |
| --- | --- |
| 状态 subscriptions 和响应 | `mav-cam/src/mav_client/mav_client.cpp` |
| settings / capture / storage 构造 | `mav-cam/src/mav_client/camera_local_client.cpp` · `fill_settings()`、`fill_capture_status()`、`fill_storage_information()` |
| 参数映射 | `CameraLocalClient::set_setting()` 和 MAVSDK `ParamServer` |

## 输出 / MAVLink 响应

| 响应 | 发布的数据 |
| --- | --- |
| `CAMERA_SETTINGS` | photo/video mode、缓存的 RGB zoom level、focus level（当前为 `0`） |
| `CAMERA_CAPTURE_STATUS` | image count、video state、recording time、available capacity |
| `STORAGE_INFORMATION` | storage type、format state、total、used、free MiB |
| `VIDEO_STREAM_INFORMATION` | stream ID、URI、encoding、dimensions、frame rate、bitrate |
| Parameters / Definition File | 产品支持的 camera mode、sensor/display、resolution、3A、thermal 和 AI settings |

## 状态和数据字段

- 本地 camera-mode setting 为 `0` 时 mode 为 photo，否则为 video。
- storage format state 映射为 formatted、unformatted、unavailable 或 unsupported。
- storage type 映射为 USB stick、microSD、internal/other 或 unknown。
- capture 和 storage 响应读取缓存的本地状态；产品 backend 必须初始化并刷新缓存。

## 失败条件

当前 capture 和 storage callback 在复制缓存状态后返回 `Ok`。未初始化的 cache 可能发布零容量或过期容量。backend 集成必须将移除或卸载的 storage 标记为 unavailable，而不是保留旧值。

## 验证

1. 查询 `CAMERA_SETTINGS`；将 mode 和 zoom 与实时相机比对。
2. 修改有文档的 parameter；再次查询并确认 backend 接受。
3. 查询 `STORAGE_INFORMATION`；将 total、used、free MiB 与 target 比对。
4. 录像；确认 capture-in-progress、递增时间和容量变化。
5. 移除 storage；确认状态变为 unavailable。

## 参考

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
