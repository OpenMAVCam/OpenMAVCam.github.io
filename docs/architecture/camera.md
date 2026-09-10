---
title: Camera
---

OpenMAVCam presents a physical imaging payload as a standard MAVLink camera component. The `mav-cam` service is the local orchestration layer: it uses MAVSDK to receive camera requests, delegates work to visible-light, thermal, AI, rendering, and storage services, then reports results back to the vehicle and ground station.

## Camera Architecture

<figure>
  <img src="/img/architecture/camera-call-flow.svg" alt="OpenMAVCam Camera call flow from QGroundControl and the autopilot through MAVSDK, MavClient, CameraLocalClient, dual camera drivers, socket AI service, rendering, and SD card storage" />
  <figcaption>MAVSDK provides the MAVLink-facing component; CameraLocalClient coordinates camera capabilities and local services through stable interfaces.</figcaption>
</figure>

## MAVSDK: the MAVLink-facing Camera Component

[MAVSDK](https://mavsdk.mavlink.io/) is the MAVLink SDK used by `mav-cam` to expose the payload as a camera component. Rather than implementing MAVLink message parsing and command responses directly in every camera driver, `MavClient` creates MAVSDK server plugins and connects their callbacks to the local camera implementation.

The service uses these MAVSDK server interfaces:

| MAVSDK interface | Role in `mav-cam` |
| --- | --- |
| `CameraServer` | Camera information, capture, video recording, zoom, settings, storage, capture status, and video-stream information |
| `ParamServer` | Camera-setting changes and parameter publication |
| `TrackingServer` | Point tracking and tracking-off commands, plus the corresponding command response |
| `FtpServer` | Access to the configured payload file root |

This gives QGroundControl, PX4, ArduPilot, and other MAVLink clients a standard camera contract while keeping sensor-specific implementation behind local C++ interfaces.

## `mav-cam` Call Flow

1. `MavClient` opens the MAVLink connection and creates a MAVSDK Camera component.
2. It registers `CameraServer`, `ParamServer`, and `TrackingServer` callbacks, then selects a `CameraLocalClient` for on-device hardware (or an RPC client when that backend is selected).
3. `CameraLocalClient` dynamically loads the local service libraries, initializes their interfaces, and publishes camera information and the RTSP stream description through MAVSDK.
4. A MAVLink request—such as take photo, start recording, set zoom, change a 3A setting, query storage, or start point tracking—is forwarded to the appropriate local service.
5. Camera frames and AI results return through callbacks. The renderer produces the composed preview; storage and operation status are reported back through the MAVSDK server plugins.

## Visible-Light Camera Abstraction

The visible-light backend implements the `mav_camera::MavCamera` interface from `qcom-cam/interface/mav_camera.h`. `CameraLocalClient` loads `libqcom_camera.so` and creates the implementation through its factory, so the MAVLink-facing layer does not need to depend on a particular Qualcomm sensor driver.

`MavCamera` provides the visible-light lifecycle and imaging-control surface:

- `prepare`, `open`, `close`, and a `MAVFrame` capture callback for camera discovery and preview frames;
- photo capture, video recording, live streaming, and timestamps;
- preview, photo, video-resolution, and H.264/H.265 encoder selection;
- white balance, auto/manual exposure, exposure value, ISO, shutter speed, metering, sharpness, AE lock, and zoom;
- JPEG/DNG photo format and JPEG quality.

The `Options` structure also enables a shared NV12 preview frame. `CameraLocalClient` registers the RGB callback before opening the camera and sends received frames to the render path.

## Thermal Camera Abstraction

The thermal backend implements `ir_camera::IRCamera` from `ir-cam/interface/ir_camera.h`. It is loaded as `libir_camera.so` and supplies its own `IRFrame` capture callback alongside the RGB callback.

`IRCamera` covers thermal-specific functions as well as capture and recording:

- start and stop infrared capture, palette/color mode, FFC mode, and manual FFC;
- optional thermal measurement in a rectangle;
- thermal photo capture, video recording, live streaming, and encoder selection.

The local client initializes the RGB service first and treats thermal initialization as optional, so a visible-light camera can remain available when an infrared module is not present or cannot be opened.

## AI Function: Socket-based Detection and Tracking

AI inference remains a separate service from the camera-control process. The local `TrackingServer` listens on a **TCP socket** at the configured local endpoint (the current implementation uses `127.0.0.1:14600`). The AI service sends **newline-delimited JSON** frames containing stream/frame identifiers and object names, coordinates, and dimensions.

`CameraLocalClient` receives those frames through a callback, stores the latest `TrackingFrame`, and turns the objects into **AI bounding boxes** for the renderer. In the reverse direction, MAVSDK tracking-point and tracking-off commands become compact socket control packets that enable detection, request a target point, or disable tracking. This keeps model execution and camera/MAVLink control independently replaceable.

## Rendering and Storage Libraries

### Rendering

`CameraLocalClient` loads `librender_bridge.so` and requests a `RenderBridge` backend. The interface supports **Weston, DRM, or V4L2** render targets and offers full-screen RGB/thermal, side-by-side, picture-in-picture, superimpose, and mix layouts. It also draws OSD text and AI bounding boxes on the composed preview. See [Video Streaming](/docs/architecture/video-streaming) for the one-stream output architecture.

### Storage

`CameraLocalClient` loads `libstorage_manager.so` and creates a `StorageManager` for the **SD card**. The library supplies a writable storage path, storage capacity/status updates, media-file indexes, and formatting. Before a capture operation, the local client checks available capacity and uses the current storage path for photo and video files; the resulting storage state is returned through MAVSDK `CameraServer`.

## Extension Boundary

To add another sensor or platform, preserve the MAVSDK and `CameraLocalClient` layer, then provide an implementation of the relevant local interface (`MavCamera`, `IRCamera`, `RenderBridge`, or `StorageManager`). This keeps the normal MAVLink camera behavior stable while allowing hardware-specific drivers, AI models, render targets, and storage implementations to evolve independently.

For message semantics, continue to [MAVLink Camera Protocol](/docs/protocol/mavlink-camera-protocol). For the composed RTSP output, see [Video Streaming](/docs/architecture/video-streaming).
