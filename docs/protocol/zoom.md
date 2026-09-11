---
title: Zoom
---

# Zoom

## Purpose

Set and report RGB camera zoom through MAVSDK `CameraServer`.

## Inputs / MAVLink Request

| Item | Value |
| --- | --- |
| GCS action | Normalized zoom-range request |
| MAVSDK callback | `CameraServer::subscribe_zoom_range()` |
| Local method | `CameraLocalClient::set_zoom_range(range)` |
| Hardware method | `MavCamera::set_zoom(range)` |

## Runtime Flow

```text
GCS zoom request → subscribe_zoom_range()
                 → set_zoom_range(range)
                 → MavCamera::set_zoom(range)
                 → respond_zoom_range(Ok/Failed)
```

The action mutex serializes camera access. `_zoom_level` changes only after the backend returns success.

## Source Code Entry Points

| Responsibility | Location / symbol |
| --- | --- |
| Request / acknowledgement | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_zoom_range()`, `respond_zoom_range()` |
| Zoom state | `mav-cam/src/mav_client/camera_local_client.cpp` · `set_zoom_range()` |
| Hardware abstraction | `qcom-cam/interface/mav_camera.h` · `MavCamera::set_zoom()` |
| Settings response | `CameraLocalClient::fill_settings()` |

## Outputs / MAVLink Responses

| Response | Meaning |
| --- | --- |
| `respond_zoom_range(Ok)` | RGB backend accepted the requested range. |
| `respond_zoom_range(Failed)` | Interface unavailable or backend rejected the request. |
| `CAMERA_SETTINGS.zoom_level` | Last zoom level accepted by the backend. |

## State and Data Fields

- `CAMERA_INFORMATION` advertises `HasBasicZoom` only when this end-to-end path is available.
- D64TR crop modes and resolution limits are enforced by the RGB backend.
- Thermal zoom or sensor-selection policy must be a documented camera setting; it is not implicit RGB zoom.

## Failure Conditions

An absent RGB interface or rejected range returns `Failed` and preserves the previous cached zoom value. A backend that clamps a value must document and report its final accepted state.

## Validation

1. Request minimum, nominal, and maximum supported ranges.
2. Query `CAMERA_SETTINGS` after each accepted request.
3. Verify the image changes at the supported limits.
4. Request an out-of-range value; verify rejection or documented clamping.

## References

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
