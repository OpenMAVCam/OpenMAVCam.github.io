---
title: render-bridge
---

# render-bridge

## 范围

`RenderBridge` 为 Weston、DRM 或 V4L2 output 组合 RGB、thermal、OSD 和 tracking overlay。它是 camera callback 的 consumer，不拥有 camera-frame memory。

## Factory 和生命周期

```cpp
RenderBridge* render_bridge = create_render_bridge(RenderType::Weston);
if (!render_bridge->open()) {
    // Do not start a camera callback that draws frames.
}

// Draw frames and overlays from active camera callbacks.

render_bridge->close();
delete render_bridge;
```

按 target output backend 选择 `RenderType::Weston`、`RenderType::Drm` 或 `RenderType::V4l2`。每个 draw call 前 `open()` 必须成功；`close()` 前停止所有 RGB/IR callback。

## Frame API

| Layout | RGB API | IR API | 用途 |
| --- | --- | --- | --- |
| Full screen | `draw_rgb_frame_in_full_screen()` | `draw_ir_frame_in_full_screen()` | 单 visible-light 或 thermal view。 |
| Side by side | `draw_rgb_frame_in_left()` | `draw_ir_frame_in_right()` | visible light 在左，thermal 在右。 |
| Picture in Picture | `draw_rgb_frame_in_PIP()` | `draw_ir_frame_in_PIP()` | 一个 stream 作为 inset。 |
| Superimpose | `draw_rgb_frame_in_superimpose(..., RenderMode)` | `draw_ir_frame_in_superimpose()` | 指定 RGB render mode 的 fused view。 |
| Mix | `draw_rgb_frame_in_mix(..., RenderMode)` | `draw_ir_frame_in_mix()` | RGB 和 thermal mixed composition。 |

所有 frame function 需要 `address`、`width`、`height`、`stride` 和 `slice`。使用源 camera callback 提供的 frame 值；除非 producer 保证相同，否则不要以 width 替代 stride。

## Overlay API

| API | 输入 | 验证 |
| --- | --- | --- |
| `draw_osd_texts()` | `std::vector<std::tuple<int32_t, int32_t, std::string>>` | 确认每项 text 出现在要求的 display coordinate。 |
| `draw_bounding_boxes()` | `std::vector<BoundingBox>` | 将 `x`、`y`、`width`、`height` 和 `label` 与 AI/tracking frame 比对。 |

`kBoundingBoxColorCount` 为 `10`；测试 detection result 时不要依赖某个特定 color assignment。

## Demo 集成规则

- `qcom_camera_test` 打开 Weston bridge，并在 `MavCamera` capture callback 内调用 `draw_rgb_frame_in_full_screen()`。
- `ir_cam_display` 打开 Weston bridge，并在 `IRCamera` capture callback 内调用 `draw_ir_frame_in_full_screen()`。
- dual-stream layout 时，仅在 `RenderBridge::open()` 成功后启动两个 capture path；将 RGB 和 IR frame 送到对应 layout API。
- 关闭顺序：停止 streaming/recording，停止 IR capture，关闭 camera session，最后调用 `RenderBridge::close()`。

## 源码参考

- `render-bridge/bridge/render_bridge.h`
- `qcom-cam/qcom_camera/qcom_camera_test.cc`
- `ir-cam/test/ir_cam_display.cc`
