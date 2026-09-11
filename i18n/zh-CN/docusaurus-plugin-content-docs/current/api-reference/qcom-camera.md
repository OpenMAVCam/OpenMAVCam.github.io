---
title: qcom-cam
---

# qcom-cam

## 范围

`qcom_camera_test` 是 RGB `mav_camera::MavCamera` 接口的参考可执行程序。它验证 sensor preparation、display callback、拍照、录像、streaming、zoom 和 3A setting。

## 必须调用顺序

```text
dlopen(libqcom_camera.so)
  → dlsym(create_qcom_camera)
  → create_qcom_camera()
  → prepare()
  → read current resolution / format
  → open StorageManager + RenderBridge
  → set_capture_callback(...)
  → open(Options)
  → test camera operation
  → stop_streaming() → close() → delete → RenderBridge::close() → dlclose()
```

`prepare()` 必须在 `open()` 前返回 `mav_camera::Result::Success`。打开前填充 `mav_camera::Options`：brand、module、initial mode、preview/photo/video resolution、photo format、encoder、JPEG quality、可选 FPS logging、capture interval 和 shared-preview-frame setting。

## 核心 API

| 功能组 | `qcom_camera_test` 调用 | 验证规则 |
| --- | --- | --- |
| Identity / readiness | `prepare()`、`get_information()`、`get_*_resolution()`、`get_photo_format()` | 任一 readiness result 非 `Success` 时停止。 |
| Session | `set_timestamp()`、`set_log_path()`、`set_capture_callback()`、`open(options)`、`close()` | 在 `open()` 前注册 preview callback。 |
| Capture | `set_mode()`、`take_photo(path)`、`start_video(path)`、`stop_video()` | 通过 `StorageManager` 生成 path；等待 mode switching 和 capture interval 生效。 |
| Streaming | `start_streaming(ip_port)`、`stop_streaming()` | 仅在 session 已开始 streaming 时停止。 |
| 3A / imaging | `set_exposure_value()`、`set_white_balance()`、`get/set_iso()`、`get/set_shutter_speed()`、`set_metering_mode()`、`set_sharpness()`、`set_ae_lock()` | 每次只修改一个 control，等待生效，并恢复 automatic/unlocked state。 |
| Zoom / format | `set_zoom()`、`set_jpeg_quality()`、`set_photo_format()` | 在每个支持值检查 live output 和保存的 media。 |

## Render Callback

Demo 创建 `create_render_bridge(RenderType::Weston)` 并调用 `open()`，然后注册：

```cpp
mav_camera->set_capture_callback(
    [&](mav_camera::MAVFrame* frame, void*) {
        render_bridge->draw_rgb_frame_in_full_screen(
            static_cast<uint8_t*>(frame->vaddr), frame->width, frame->height,
            frame->stride, frame->slice);
    }, nullptr);
```

callback 收到的 `MAVFrame` 内存由相机 pipeline 持有。必须在 callback 内绘制或复制，不可在 callback 返回后保留地址。

## Demo 命令

`ENABLE_QCOM_CAMERA_TEST=ON` 时安装 `qcom_camera_test`。它支持 `--mode`、`--preview_resolution`、`--photo_resolution`、`--photo_format`、`--video_resolution`、`--video_encoder`、`--streaming`、`--streaming_url` 和 `--log_path`。

每次执行一个 test case：

```bash
qcom_camera_test --test take_photo --test_param 10
qcom_camera_test --test video_recording --test_param 60
qcom_camera_test --test zoom --test_param 2
qcom_camera_test --test exposure
qcom_camera_test --test whitebalance
```

还支持 `mode`、`iso`、`shutter_speed`、`metering`、`sharpness` 和 `ae_lock`。输入 `q` 结束交互 session。确认每项 API result、preview 和生成 media；命令被 dispatch 不等于相机成功。

## 源码参考

- `qcom-cam/interface/mav_camera.h`
- `qcom-cam/qcom_camera/qcom_camera.h`
- `qcom-cam/qcom_camera/qcom_camera_test.cc`
