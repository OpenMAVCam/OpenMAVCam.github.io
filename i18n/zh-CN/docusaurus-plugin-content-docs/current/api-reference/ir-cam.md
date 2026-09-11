---
title: ir-cam
---

# ir-cam

## 范围

使用 `ir_camera::IRCamera` 完成 thermal capture、color mode、FFC、temperature measurement、recording 和 live streaming。参考 Demo 为 `ir_cam_display` 和 `ir_cam_streaming`。

## 必须调用顺序

```text
dlopen(libir_camera.so)
  → dlsym(create_ir_camera)
  → create_ir_camera()
  → set_log_path()
  → open(Options)
  → configure color / FFC / thermal function
  → start_capture(callback) and optional streaming / recording
  → stop streaming → stop_catpure() → close() → delete → dlclose()
```

`open(options)` 成功前不能调用 capture、streaming、recording 或 thermal API。为产品集成设置 `Options::brand` 和 `Options::module`。

## 核心 API

| 功能组 | API | 验证规则 |
| --- | --- | --- |
| Session | `set_log_path()`、`open()`、`close()` | `open()` 返回 `false` 时 test 失败；delete 前调用 `close()`。 |
| Frames | `start_capture(callback, context)`、`stop_catpure()` | 仅在 callback 内使用 frame memory。关闭 renderer 或 camera resource 前停止 capture。 |
| Palette / calibration | `set_color_mode()`、`get_color_mode()`、`set_ffc_mode()`、`get_ffc_mode()`、`run_ffc()` | 设置后 read back mode；FFC 完成后验证 output。 |
| Temperature | `open_thermal_function()`、`measure_temperature(rect, temperatures)`、`close_thermal_function()` | 仅 thermal function 已打开时测量；验证请求 rectangle 和返回值。 |
| Media | `take_photo(path)`、`start_video_recording(path)`、`stop_video_recording()` | 使用可写 storage path，并验证生成文件。 |
| Streaming | `start_live_streaming(ip_port)`、`stop_live_streaming()` | 使用 `ip:port`，然后确认 receiver 可解码 thermal stream。 |

## Display Demo

`ir-cam/test/ir_cam_display.cc` 使用 Weston rendering：

```cpp
RenderBridge* render_bridge = create_render_bridge(RenderType::Weston);
if (!render_bridge->open()) {
    // Stop the test.
}

ir_camera->set_color_mode(ir_camera::ColorMode::IRONBOW);
ir_camera->start_capture(
    [&](ir_camera::IRFrame* frame, void*) {
        render_bridge->draw_ir_frame_in_full_screen(
            frame->vaddr, frame->width, frame->height, frame->width, frame->height);
    }, nullptr);
```

Demo 还展示了可选 `take_photo()`、`start_video_recording()` 和 `stop_video_recording()`。结束时应先停止 camera capture，再关闭 renderer，避免 callback 绘制到已释放的 render resource。

## Streaming Demo

使用 IP 和端口运行已安装的 `ir_cam_streaming`：

```bash
ir_cam_streaming -s 127.0.0.1:8554
```

Demo 打开 `libir_camera.so`，启动空 capture callback 和 live streaming，等待用户输入后停止 streaming 并关闭相机。确认 API return value 和 receiver 侧 thermal video。

## 源码参考

- `ir-cam/interface/ir_camera.h`
- `ir-cam/test/ir_cam_display.cc`
- `ir-cam/test/ir_cam_streaming.cc`
