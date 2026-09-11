---
title: qcom-cam
---

# qcom-cam

## Scope

`qcom_camera_test` is the reference executable for the RGB `mav_camera::MavCamera` interface. It validates sensor preparation, display callback, still capture, recording, streaming, zoom, and 3A settings.

## Required Call Order

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

`prepare()` must return `mav_camera::Result::Success` before `open()`. Populate `mav_camera::Options` before opening: brand, module, initial mode, preview/photo/video resolution, photo format, encoder, JPEG quality, optional FPS logging, capture interval, and shared-preview-frame setting.

## Core APIs

| Function group | Calls used by `qcom_camera_test` | Validation rule |
| --- | --- | --- |
| Identity / readiness | `prepare()`, `get_information()`, `get_*_resolution()`, `get_photo_format()` | Stop on any non-`Success` readiness result. |
| Session | `set_timestamp()`, `set_log_path()`, `set_capture_callback()`, `open(options)`, `close()` | Register the preview callback before `open()`. |
| Capture | `set_mode()`, `take_photo(path)`, `start_video(path)`, `stop_video()` | Generate a path through `StorageManager`; allow mode switching and capture interval to settle. |
| Streaming | `start_streaming(ip_port)`, `stop_streaming()` | Stop only if the session started streaming. |
| 3A / imaging | `set_exposure_value()`, `set_white_balance()`, `get/set_iso()`, `get/set_shutter_speed()`, `set_metering_mode()`, `set_sharpness()`, `set_ae_lock()` | Change one control at a time, wait for it to apply, and restore automatic/unlocked state. |
| Zoom / format | `set_zoom()`, `set_jpeg_quality()`, `set_photo_format()` | Verify live output and saved media at each supported value. |

## Render Callback

The demo creates `create_render_bridge(RenderType::Weston)`, calls `open()`, then supplies:

```cpp
mav_camera->set_capture_callback(
    [&](mav_camera::MAVFrame* frame, void*) {
        render_bridge->draw_rgb_frame_in_full_screen(
            static_cast<uint8_t*>(frame->vaddr), frame->width, frame->height,
            frame->stride, frame->slice);
    }, nullptr);
```

The callback receives `MAVFrame` memory owned by the camera pipeline. Draw or copy it during the callback; do not retain its address after the callback returns.

## Demo Commands

`qcom_camera_test` is installed when `ENABLE_QCOM_CAMERA_TEST=ON`. It accepts configuration options such as `--mode`, `--preview_resolution`, `--photo_resolution`, `--photo_format`, `--video_resolution`, `--video_encoder`, `--streaming`, `--streaming_url`, and `--log_path`.

Use one test case at a time:

```bash
qcom_camera_test --test take_photo --test_param 10
qcom_camera_test --test video_recording --test_param 60
qcom_camera_test --test zoom --test_param 2
qcom_camera_test --test exposure
qcom_camera_test --test whitebalance
```

The demo also supports `mode`, `iso`, `shutter_speed`, `metering`, `sharpness`, and `ae_lock`. Enter `q` to end the interactive session. Confirm each API return result, resulting preview, and generated media; a command dispatch alone is not proof of camera success.

## Source References

- `qcom-cam/interface/mav_camera.h`
- `qcom-cam/qcom_camera/qcom_camera.h`
- `qcom-cam/qcom_camera/qcom_camera_test.cc`
