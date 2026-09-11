---
title: 变焦
---

# 变焦

## 目的

通过 MAVSDK `CameraServer` 设置并报告 RGB 相机变焦。

## 输入 / MAVLink 请求

| 项目 | 值 |
| --- | --- |
| GCS 操作 | 归一化的 zoom-range 请求 |
| MAVSDK callback | `CameraServer::subscribe_zoom_range()` |
| 本地方法 | `CameraLocalClient::set_zoom_range(range)` |
| 硬件方法 | `MavCamera::set_zoom(range)` |

## 运行流程

```text
GCS zoom request → subscribe_zoom_range()
                 → set_zoom_range(range)
                 → MavCamera::set_zoom(range)
                 → respond_zoom_range(Ok/Failed)
```

action mutex 会串行化相机访问。只有后端返回成功后，`_zoom_level` 才会更新。

## 源码入口

| 职责 | 位置 / 符号 |
| --- | --- |
| 请求 / 确认响应 | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_zoom_range()`、`respond_zoom_range()` |
| 变焦状态 | `mav-cam/src/mav_client/camera_local_client.cpp` · `set_zoom_range()` |
| 硬件抽象 | `qcom-cam/interface/mav_camera.h` · `MavCamera::set_zoom()` |
| 设置响应 | `CameraLocalClient::fill_settings()` |

## 输出 / MAVLink 响应

| 响应 | 含义 |
| --- | --- |
| `respond_zoom_range(Ok)` | RGB backend 接受请求的 range。 |
| `respond_zoom_range(Failed)` | 接口不可用或 backend 拒绝请求。 |
| `CAMERA_SETTINGS.zoom_level` | backend 最后接受的 zoom level。 |

## 状态和数据字段

- 仅当端到端链路可用时，`CAMERA_INFORMATION` 才声明 `HasBasicZoom`。
- D64TR crop mode 和分辨率限制由 RGB backend 强制执行。
- thermal zoom 或 sensor-selection policy 必须作为有文档的 camera setting，而不是隐式 RGB zoom。

## 失败条件

RGB 接口缺失或 range 被拒绝时返回 `Failed`，并保留此前缓存的 zoom value。backend 如对值做 clamp，必须记录并报告最终接受状态。

## 验证

1. 请求最小、常用和最大支持 range。
2. 每次接受后查询 `CAMERA_SETTINGS`。
3. 确认图像在支持上限和下限发生相应变化。
4. 请求越界值；确认拒绝或已记录的 clamp 行为。

## 参考

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
