---
title: Video Streaming
---

OpenMAVCam turns the visible-light image, thermal image, AI overlays, and OSD into **one composed preview** before it is encoded and sent to the ground station. The result is one video stream for the operator to open, decode, and record.

## Single-Stream Video Architecture

<figure>
  <img src="/img/architecture/video-streaming-pipeline.svg" alt="OpenMAVCam composing RGB, thermal, AI bounding boxes, and OSD into one encoded RTSP video stream for QGroundControl" />
  <figcaption>Composition happens once on the camera. QGroundControl receives one low-latency preview stream and camera control stays on MAVLink.</figcaption>
</figure>

### Compose at the camera

The camera-side renderer uses **Weston composition** to keep the input layers aligned in one output surface:

- **RGB** visible-light frames and **thermal** frames are placed in the selected layout;
- **AI bounding boxes** are rendered above the sensor images when an AI function is enabled;
- **OSD** text and status are placed above the image and AI layers.

This matches the Weston implementation: independent video, infrared, bounding-box, and OSD surfaces are composed in a defined z-order before the preview is delivered to the streaming path.

OpenMAVCam supports these composed viewing modes:

| Mode | Composed output |
| --- | --- |
| RGB / thermal | A full-screen visible-light or thermal preview |
| Side-by-side | RGB on the left and thermal on the right |
| Picture-in-Picture | One sensor full-screen with the other as an inset |
| Superimpose | Sensor imagery overlaid using the selected render mode |
| Mix | A blended visible-light and thermal presentation |

## One Encoded Stream, One Ground-Station View

After composition, the preview is encoded as **H.264 or H.265** and exposed as a single RTSP endpoint, for example `rtsp://<camera-ip>/live`. The camera publishes that endpoint, resolution, frame rate, bitrate, and stream status through the **MAVLink Camera Protocol**.

QGroundControl receives one stream description and opens one video source. It does not need to synchronize separate RGB, thermal, OSD, and AI streams or recreate their layout on the ground computer. This gives the supported QGroundControl configuration a direct, fully compatible preview path while leaving camera controls, capture, zoom, tracking, and status on MAVLink.

## Why This Keeps Integration Fast and Latency Low

The single-stream design deliberately keeps the number of real-time paths small:

1. The camera composes sensor frames and overlays once, close to their source.
2. The encoder processes one final frame instead of several independently decoded sources.
3. The ground station uses **one decoder** and one presentation clock.
4. MAVLink carries compact control and status messages separately from the video payload.

Avoiding client-side multi-stream composition means the operator application does not need to synchronize independent network streams, arrange their layers, or align overlay timestamps. That reduces buffering and integration work, supporting a **low-latency** operator view and **fast integration** with QGroundControl and other MAVLink-aware applications.

## QGroundControl Integration

OpenMAVCam advertises the running stream through the MAVLink Camera Protocol and serves the video directly over Ethernet. In the normal workflow, connect the camera to the network, connect MAVLink to the vehicle or simulator, then let QGroundControl discover the camera and its stream information.

For the validated desktop workflow and tested QGroundControl versions, see [QGroundControl](/docs/getting-started/qgroundcontrol). Video transport settings such as preview resolution, bitrate, and H.264/H.265 selection are documented in [Configuration](/docs/api-reference/configuration-interfaces).

## Implementation Boundary

Weston is the composition stage: it creates and layers the RGB, infrared, AI, and OSD surfaces. The video encoder and RTSP publisher are downstream of that composed preview. Keeping these responsibilities separate makes it possible to adjust a transport or encoder configuration without changing the camera-facing composition API or the MAVLink control interface.
