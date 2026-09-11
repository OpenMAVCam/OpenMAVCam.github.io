---
title: Capture
---

# Capture

## Purpose

Control still capture, video recording, and preview streaming through MAVSDK `CameraServer`.

## Inputs / MAVLink Request

| GCS operation | `MavClient` callback | Local operation |
| --- | --- | --- |
| Take photo | `subscribe_take_photo()` | `CameraLocalClient::take_photo(index)` |
| Start / stop recording | `subscribe_start_video()` / `subscribe_stop_video()` | `start_video()` / `stop_video()` |
| Start / stop preview stream | `subscribe_start_video_streaming()` / `subscribe_stop_video_streaming()` | `start_video_streaming(stream_id)` / `stop_video_streaming(stream_id)` |
| Select photo/video mode | `subscribe_set_mode()` | `set_mode(mode)` |

## Runtime Flow

```text
MAVLink command → MAVSDK CameraServer callback → CameraLocalClient
                → RGB / IR / storage backend → CameraServer response → GCS
```

After a photo callback, `MavClient` calls `fill_capture_status()` and `respond_capture_status()` to refresh the GCS capture UI.

## Source Code Entry Points

| Responsibility | Location / symbol |
| --- | --- |
| Protocol callbacks and replies | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_*`, `respond_*` |
| Local capture operations | `mav-cam/src/mav_client/camera_local_client.cpp` · `take_photo()`, `start_video()`, `stop_video()` |
| Status construction | `CameraLocalClient::fill_capture_status()` |

## Outputs / MAVLink Responses

| Operation | Response |
| --- | --- |
| Photo | `respond_take_photo()` with `CaptureInfo`, then `CAMERA_CAPTURE_STATUS` |
| Video | `respond_start_video(Ok/Failed)` or `respond_stop_video(Ok/Failed)` |
| Streaming | `respond_start_video_streaming(Ok/Failed)` or `respond_stop_video_streaming(Ok/Failed)` |
| Mode | `respond_set_mode(Ok/Failed)` |

## State and Data Fields

- `image_count` comes from the local capture counter.
- `image_status` is currently idle.
- `video_status` is idle or capture in progress.
- `recording_time_s` is derived from the local video-start time.
- Available capacity comes from cached storage information.
- Photo response currently has empty position, attitude, and `file_url`; add storage metadata if the GCS needs geotagging or file retrieval.

## Failure Conditions

Return `Failed` when the backend cannot perform the operation. Do not acknowledge `Ok` before the RGB, IR, streaming, or storage backend accepts it. Host-clock timestamps require synchronization before use as mission metadata.

## Validation

1. Take one photo; verify `CaptureInfo` and refreshed `CAMERA_CAPTURE_STATUS`.
2. Start and stop recording; verify acknowledgement, capture state, and increasing recording time.
3. Start and stop streaming; verify the independently published stream URI opens in the GCS.
4. Repeat with RGB or storage unavailable; verify `Failed`, not stale success.

## References

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
