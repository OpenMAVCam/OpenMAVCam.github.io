---
title: render-bridge
---

# render-bridge

## Scope

`RenderBridge` composes RGB, thermal, OSD, and tracking overlays for Weston, DRM, or V4L2 output. It is a consumer of camera callbacks, not an owner of camera-frame memory.

## Factory and Lifecycle

```cpp
RenderBridge* render_bridge = create_render_bridge(RenderType::Weston);
if (!render_bridge->open()) {
    // Do not start a camera callback that draws frames.
}

// Draw frames and overlays from active camera callbacks.

render_bridge->close();
delete render_bridge;
```

Select `RenderType::Weston`, `RenderType::Drm`, or `RenderType::V4l2` for the target output backend. Call `open()` successfully before every draw call, and stop all RGB/IR callbacks before `close()`.

## Frame APIs

| Layout | RGB API | IR API | Use case |
| --- | --- | --- | --- |
| Full screen | `draw_rgb_frame_in_full_screen()` | `draw_ir_frame_in_full_screen()` | Single visible-light or thermal view. |
| Side by side | `draw_rgb_frame_in_left()` | `draw_ir_frame_in_right()` | Visible light on the left; thermal on the right. |
| Picture in Picture | `draw_rgb_frame_in_PIP()` | `draw_ir_frame_in_PIP()` | One stream as the inset. |
| Superimpose | `draw_rgb_frame_in_superimpose(..., RenderMode)` | `draw_ir_frame_in_superimpose()` | Fused view with RGB render mode specified. |
| Mix | `draw_rgb_frame_in_mix(..., RenderMode)` | `draw_ir_frame_in_mix()` | Mixed RGB and thermal composition. |

All frame functions require `address`, `width`, `height`, `stride`, and `slice`. Use the frame values supplied by the originating camera callback; do not substitute width for stride unless the producer guarantees they are equal.

## Overlay APIs

| API | Input | Validation |
| --- | --- | --- |
| `draw_osd_texts()` | `std::vector<std::tuple<int32_t, int32_t, std::string>>` | Confirm each text item appears at the requested display coordinate. |
| `draw_bounding_boxes()` | `std::vector<BoundingBox>` | Check `x`, `y`, `width`, `height`, and `label` against the AI/tracking frame. |

`kBoundingBoxColorCount` is `10`; do not depend on a particular color assignment when testing detection results.

## Demo Integration Rules

- `qcom_camera_test` opens a Weston bridge and calls `draw_rgb_frame_in_full_screen()` from `MavCamera`'s capture callback.
- `ir_cam_display` opens a Weston bridge and calls `draw_ir_frame_in_full_screen()` from `IRCamera`'s capture callback.
- For dual-stream layouts, start both capture paths only after `RenderBridge::open()` succeeds; send RGB and IR frames to the matched layout APIs.
- On shutdown: stop streaming/recording, stop IR capture, close the camera sessions, then call `RenderBridge::close()`.

## Source References

- `render-bridge/bridge/render_bridge.h`
- `qcom-cam/qcom_camera/qcom_camera_test.cc`
- `ir-cam/test/ir_cam_display.cc`
