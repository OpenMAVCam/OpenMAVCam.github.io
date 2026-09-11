---
title: Status
---

# Status

## Purpose

Publish payload state as standard MAVLink camera responses: parameters, capture state, storage state, and video-stream metadata.

## Inputs / MAVLink Request

| Requested state | `MavClient` callback | Local builder |
| --- | --- | --- |
| `CAMERA_SETTINGS` | `subscribe_settings()` | `fill_settings()` |
| `CAMERA_CAPTURE_STATUS` | `subscribe_capture_status()` and photo completion | `fill_capture_status()` |
| `STORAGE_INFORMATION` | `subscribe_storage_information()` | `fill_storage_information()` |
| Video stream metadata | Initialization publication | `fill_video_stream_info()` |
| Detailed parameters | MAVSDK `ParamServer` / `FtpServer` | Local settings map and Definition File |

## Runtime Flow

```text
GCS request → MAVSDK callback → cached camera / storage / stream state
            → fill_*() → standard MAVLink response → GCS
```

## Source Code Entry Points

| Responsibility | Location / symbol |
| --- | --- |
| Status subscriptions and replies | `mav-cam/src/mav_client/mav_client.cpp` |
| Settings / capture / storage builders | `mav-cam/src/mav_client/camera_local_client.cpp` · `fill_settings()`, `fill_capture_status()`, `fill_storage_information()` |
| Parameter mapping | `CameraLocalClient::set_setting()` and MAVSDK `ParamServer` |

## Outputs / MAVLink Responses

| Response | Published data |
| --- | --- |
| `CAMERA_SETTINGS` | Photo/video mode, cached RGB zoom level, focus level (`0` currently) |
| `CAMERA_CAPTURE_STATUS` | Image count, video state, recording time, available capacity |
| `STORAGE_INFORMATION` | Storage type, format state, total, used, free MiB |
| `VIDEO_STREAM_INFORMATION` | Stream ID, URI, encoding, dimensions, frame rate, bitrate |
| Parameters / Definition File | Camera mode, sensor/display, resolution, 3A, thermal, and AI settings supported by the product |

## State and Data Fields

- Mode is photo when the local camera-mode setting is `0`; otherwise video.
- Storage maps format state to formatted, unformatted, unavailable, or unsupported.
- Storage type maps to USB stick, microSD, internal/other, or unknown.
- Capture and storage responses read cached local state; the cache must be initialized and refreshed by the product backend.

## Failure Conditions

Current capture and storage callbacks return `Ok` after copying cached state. Uninitialized caches can therefore publish zero or stale capacity. Backend integrations must mark removed or unmounted storage unavailable instead of retaining prior values.

## Validation

1. Query `CAMERA_SETTINGS`; compare mode and zoom with the live camera.
2. Change a documented parameter; query again and verify backend acceptance.
3. Query `STORAGE_INFORMATION`; compare total, used, and free MiB with the target.
4. Record video; verify capture-in-progress, increasing time, and changing capacity.
5. Remove storage; verify its state becomes unavailable.

## References

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
