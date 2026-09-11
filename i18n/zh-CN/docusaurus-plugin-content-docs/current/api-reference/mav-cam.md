---
title: mav-cam
---

# mav-cam

## 范围

在两个边界测试 `mav-cam`：以 `mav_client` 运行载荷服务，再以随附 MAVSDK client demo 作为 GCS。Demo 验证相机操作和 Definition File 设置，不需要手写 MAVLink 消息。

## 启动载荷服务

`mav_client` 支持 MAVSDK connection URL、本地/远程 client、RPC port、FTP root、log path、connection type、初始 camera mode 和初始 snapshot resolution。

```bash
mav_client \
  -u udp://127.0.0.1:14550 \
  --connection_type ethernet \
  --ftp_path /usr/share/mav-cam/ \
  --log_path /data/camera/
```

`--connection_type` 仅支持 `usb`、`wlan` 和 `ethernet`。Ethernet 时 `mav_client` 从 `eth0` 获取 RTSP 地址；没有 IPv4 地址会启动失败。需要明确初始模式时，`--camera_mode 0` 表示 photo，`--camera_mode 1` 表示 video。

## Camera Operation Demo

`mav-cam/example/camera_operation/camera_operation.cpp` 的 GCS 调用顺序如下：

```text
Mavsdk(GroundStation) → add_any_connection("udp://:14550")
  → wait for system.has_camera()
  → Camera(system)
  → subscribe_status() + subscribe_capture_info()
  → invoke operation and check its result
```

| API | Demo 验证规则 |
| --- | --- |
| `format_storage(1)` | 使用媒体存储前检查 operation result。 |
| `reset_settings()` | 检查结果并确认相机回到有文档的默认值。 |
| `take_photo()` / `start_photo_interval()` / `stop_photo_interval()` | 监听 `subscribe_capture_info()` 并确认拍照数量。 |
| `start_video()` / `stop_video()` | 检查 operation result 和 capture status。 |
| `start_video_streaming(1)` / `stop_video_streaming(1)` | 检查结果，并独立验证发布的 stream。 |
| `set_mode(Photo/Video)` | 检查结果，并确认 GCS 可见的 current mode。 |

Demo 等待十秒以发现具有 `has_camera()` 的 system。超时表示 service/discovery failure；不要对任意 MAVSDK system 执行操作。

## Definition File 和 Settings Demo

`mav-cam/example/camera_definition/camera_definition.cpp` 定义了设置测试顺序：

1. 订阅 `Camera::Information` 并等待 `definition_file_uri`。
2. 要求 URI 以 `mftp://` 开头，去除前缀并通过 `mavsdk::Ftp::download_async()` 下载。
3. 将 XML 传给 `camera.set_definition_data()`。
4. 订阅 `camera.subscribe_current_settings()`。
5. 对每个 setting，调用 `camera.set_setting(setting)`，再调用 `camera.get_setting(setting)`，并将 `option.option_id` 与请求值对比。

参考 setting ID 为 `CAM_WBMODE`、`CAM_EXPMODE`、`CAM_EV`、`CAM_SHUTTERSPD` 和 `CAM_ISO`。仅当已加载的 Definition File 和当前产品配置提供它们时才有效。

## 结果规则

- 检查每个 `ConnectionResult`、camera operation result、FTP result 和 setting readback。
- 对 discovery、information、FTP 和 status callback 必须设置 timeout；timeout 即为 test failure。
- 通过对应 callback 或 live output 确认效果；仅 API 返回成功不足以证明 storage、image、stream 和 setting 测试成功。

## 源码参考

- `mav-cam/src/mav_client/mav_client_bin.cpp`
- `mav-cam/example/camera_operation/camera_operation.cpp`
- `mav-cam/example/camera_definition/camera_definition.cpp`
