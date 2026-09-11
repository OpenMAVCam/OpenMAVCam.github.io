---
title: 拍照与录像
---

# 拍照与录像

## 目的

通过 MAVSDK `CameraServer` 控制静态拍照、录像和预览码流。

## 输入 / MAVLink 请求

| GCS 操作 | `MavClient` callback | 本地操作 |
| --- | --- | --- |
| 拍照 | `subscribe_take_photo()` | `CameraLocalClient::take_photo(index)` |
| 开始 / 停止录像 | `subscribe_start_video()` / `subscribe_stop_video()` | `start_video()` / `stop_video()` |
| 开始 / 停止预览码流 | `subscribe_start_video_streaming()` / `subscribe_stop_video_streaming()` | `start_video_streaming(stream_id)` / `stop_video_streaming(stream_id)` |
| 选择拍照/录像模式 | `subscribe_set_mode()` | `set_mode(mode)` |

## 运行流程

```text
MAVLink command → MAVSDK CameraServer callback → CameraLocalClient
                → RGB / IR / storage backend → CameraServer response → GCS
```

拍照 callback 完成后，`MavClient` 会调用 `fill_capture_status()` 和 `respond_capture_status()` 刷新 GCS 拍摄界面。

## 源码入口

| 职责 | 位置 / 符号 |
| --- | --- |
| 协议 callback 和回复 | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_*`、`respond_*` |
| 本地拍摄操作 | `mav-cam/src/mav_client/camera_local_client.cpp` · `take_photo()`、`start_video()`、`stop_video()` |
| 状态构造 | `CameraLocalClient::fill_capture_status()` |

## 输出 / MAVLink 响应

| 操作 | 响应 |
| --- | --- |
| 拍照 | 携带 `CaptureInfo` 的 `respond_take_photo()`，随后为 `CAMERA_CAPTURE_STATUS` |
| 录像 | `respond_start_video(Ok/Failed)` 或 `respond_stop_video(Ok/Failed)` |
| 码流 | `respond_start_video_streaming(Ok/Failed)` 或 `respond_stop_video_streaming(Ok/Failed)` |
| 模式 | `respond_set_mode(Ok/Failed)` |

## 状态和数据字段

- `image_count` 来自本地拍照计数器。
- `image_status` 当前为 idle。
- `video_status` 为 idle 或 capture in progress。
- `recording_time_s` 来自本地录像开始时间。
- 可用容量来自缓存的存储信息。
- 当前拍照响应的 position、attitude 和 `file_url` 为空；如 GCS 需要地理标签或文件获取，需添加存储元数据。

## 失败条件

后端无法执行时返回 `Failed`。在 RGB、IR、streaming 或 storage backend 接受操作前，不应回复 `Ok`。使用主机时钟的时间戳在作为任务元数据前必须同步。

## 验证

1. 拍摄一张图；确认 `CaptureInfo` 和更新后的 `CAMERA_CAPTURE_STATUS`。
2. 开始和停止录像；确认确认响应、拍摄状态和递增的录像时间。
3. 开始和停止 streaming；确认 GCS 可打开独立发布的 stream URI。
4. 在 RGB 或 storage 不可用时重复；确认得到 `Failed` 而不是旧的成功状态。

## 参考

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
