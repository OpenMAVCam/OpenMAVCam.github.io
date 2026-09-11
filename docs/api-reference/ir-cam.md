---
title: ir-cam
---

# ir-cam

## Scope

Use `ir_camera::IRCamera` for thermal capture, color mode, FFC, temperature measurement, recording, and live streaming. The reference demos are `ir_cam_display` and `ir_cam_streaming`.

## Required Call Order

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

`open(options)` must succeed before capture, streaming, recording, or thermal APIs. Set `Options::brand` and `Options::module` to the product integration values.

## Core APIs

| Function group | APIs | Validation rule |
| --- | --- | --- |
| Session | `set_log_path()`, `open()`, `close()` | Fail the test if `open()` returns `false`; call `close()` before deleting the instance. |
| Frames | `start_capture(callback, context)`, `stop_catpure()` | Use frame memory only inside the callback. Stop capture before closing renderer or camera resources. |
| Palette / calibration | `set_color_mode()`, `get_color_mode()`, `set_ffc_mode()`, `get_ffc_mode()`, `run_ffc()` | Read back the mode after setting it; validate output after FFC completes. |
| Temperature | `open_thermal_function()`, `measure_temperature(rect, temperatures)`, `close_thermal_function()` | Call measurement only while the thermal function is open; validate the requested rectangle and returned values. |
| Media | `take_photo(path)`, `start_video_recording(path)`, `stop_video_recording()` | Use a writable storage path and verify the resulting file. |
| Streaming | `start_live_streaming(ip_port)`, `stop_live_streaming()` | Accept `ip:port`, then confirm the receiver can decode the thermal stream. |

## Display Demo

`ir-cam/test/ir_cam_display.cc` uses Weston rendering:

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

The demo also shows optional `take_photo()`, `start_video_recording()`, and `stop_video_recording()` calls. When terminating, close the renderer only after camera capture has stopped; this avoids callbacks drawing into released render resources.

## Streaming Demo

Run the installed `ir_cam_streaming` test with an IP and port:

```bash
ir_cam_streaming -s 127.0.0.1:8554
```

The demo opens `libir_camera.so`, starts an empty capture callback, starts live streaming, waits for user input, then stops streaming and closes the camera. Confirm both the API return values and receiver-side thermal video.

## Source References

- `ir-cam/interface/ir_camera.h`
- `ir-cam/test/ir_cam_display.cc`
- `ir-cam/test/ir_cam_streaming.cc`
