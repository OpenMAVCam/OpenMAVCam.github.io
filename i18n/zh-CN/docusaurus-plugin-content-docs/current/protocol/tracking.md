---
title: 目标跟踪
---

# 目标跟踪

## 目的

接收 MAVLink target-selection 命令并将跟踪委托给本地 AI/tracking service。MAVLink 负责控制；本地服务生成检测结果和渲染框。

## 输入 / MAVLink 请求

| GCS 操作 | `MavClient` callback | 本地操作 | 当前结果 |
| --- | --- | --- | --- |
| Track point | `subscribe_tracking_point_command()` | `enable_tracking_point(x, y)` | `Accepted` 或 `Denied` |
| Track rectangle | `subscribe_tracking_rectangle_command()` | 未实现 | 始终为 `Denied` |
| Stop tracking | `subscribe_tracking_off_command()` | `disable_tracking()` | `Accepted` 或 `Denied` |

## 运行流程

```text
GCS point → TrackingServer callback → CameraLocalClient
          → clamp [0.0, 1.0] → source pixels → tracking socket/service
          → Accepted or Denied → GCS
```

点坐标转换使用 1920 像素 source width。photo mode 的 height 为 1440，video mode 的 height 为 1080。

## 源码入口

| 职责 | 位置 / 符号 |
| --- | --- |
| Tracking subscriptions | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_tracking_*_command()` |
| 点坐标转换和服务控制 | `mav-cam/src/mav_client/camera_local_client.cpp` · `enable_tracking_point()`、`disable_tracking()` |
| 结果接收 | `CameraLocalClient::tracking_callback()` |
| 叠加层渲染 | renderer 将 `TrackingFrame` objects 转换为 bounding boxes |

## 输出 / MAVLink 响应

| 响应 | 含义 |
| --- | --- |
| `Accepted` | 本地服务接受命令；不保证已经获取目标。 |
| `Denied` | 命令不支持或本地服务拒绝。 |
| Local overlay | AI function 启用时绘制最新 tracking frame。 |

## 状态和数据字段

- AI function setting 会启动所需 detection/tracking service 和本地 tracking server。
- 禁用 AI 会停止服务、清除缓存 `TrackingFrame` 并移除渲染框。
- acquisition、confidence、target-loss 和 re-acquisition policy 由模型/服务决定。

## 失败条件

rectangle tracking 会被明确拒绝。只有本地服务接受 disable，tracking-off 才能成功。已接受的 point 在模型未检测到目标时仍可能没有 overlay。

## 验证

1. 启用 AI function，确认选定服务启动。
2. 在 live image 内发送 point；确认 `Accepted`、overlay 和更新。
3. 发送 rectangle 请求；确认 `Denied`。
4. 发送 tracking-off；确认 overlay 和本地 tracking state 清除。

## 参考

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
- [AI](../architecture/ai-tracking.md)
