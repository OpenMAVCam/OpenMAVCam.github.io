---
title: Tracking
---

# Tracking

## Purpose

Accept MAVLink target-selection commands and delegate tracking to the local AI/tracking service. MAVLink handles control; the local service produces detections and rendered boxes.

## Inputs / MAVLink Request

| GCS action | `MavClient` callback | Local action | Current result |
| --- | --- | --- | --- |
| Track point | `subscribe_tracking_point_command()` | `enable_tracking_point(x, y)` | `Accepted` or `Denied` |
| Track rectangle | `subscribe_tracking_rectangle_command()` | Not implemented | Always `Denied` |
| Stop tracking | `subscribe_tracking_off_command()` | `disable_tracking()` | `Accepted` or `Denied` |

## Runtime Flow

```text
GCS point → TrackingServer callback → CameraLocalClient
          → clamp [0.0, 1.0] → source pixels → tracking socket/service
          → Accepted or Denied → GCS
```

Point conversion uses a 1920-pixel source width. Height is 1440 in photo mode and 1080 in video mode.

## Source Code Entry Points

| Responsibility | Location / symbol |
| --- | --- |
| Tracking subscriptions | `mav-cam/src/mav_client/mav_client.cpp` · `subscribe_tracking_*_command()` |
| Point conversion and service control | `mav-cam/src/mav_client/camera_local_client.cpp` · `enable_tracking_point()`, `disable_tracking()` |
| Result ingestion | `CameraLocalClient::tracking_callback()` |
| Overlay rendering | Renderer converts `TrackingFrame` objects into bounding boxes |

## Outputs / MAVLink Responses

| Response | Meaning |
| --- | --- |
| `Accepted` | Local service accepted the command; it does not guarantee target acquisition. |
| `Denied` | Command unsupported or local service rejected it. |
| Local overlay | Latest tracking frame is drawn while the AI function is enabled. |

## State and Data Fields

- The AI-function setting starts the required detection/tracking service and local tracking server.
- Disabling AI stops those services, clears the cached `TrackingFrame`, and removes rendered boxes.
- Acquisition, confidence, target-loss, and re-acquisition policies are model/service-specific.

## Failure Conditions

Rectangle tracking is deliberately rejected. Tracking-off succeeds only if the local service accepts disable. An accepted point can still yield no overlay when the model finds no target.

## Validation

1. Enable the AI function and verify the selected service starts.
2. Send a point in the live image; verify `Accepted`, overlay, and updates.
3. Send a rectangle request; verify `Denied`.
4. Send tracking-off; verify the overlay and local tracking state clear.

## References

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
- [AI](../architecture/ai-tracking.md)
