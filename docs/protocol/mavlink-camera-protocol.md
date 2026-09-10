---
title: MAVLink Camera Protocol
---

OpenMAVCam implements the [MAVLink Camera Protocol v2](https://mavlink.io/en/services/camera.html) as its common payload-control surface. The protocol covers camera discovery, capabilities, settings, capture, storage, video-stream metadata, and tracking; `mav-cam` implements that contract with MAVSDK server plugins and forwards operations to `CameraLocalClient`.

## Camera Protocol v2 Implementation

<figure>
  <img src="/img/protocol/mavlink-camera-protocol-flow.svg" alt="QGroundControl discovering an OpenMAVCam camera through MAVLink Camera Protocol v2, with MavClient CameraServer routing commands to CameraLocalClient and publishing camera information, video stream information, and status" />
  <figcaption>Protocol messages and acknowledgements use MAVLink; live video uses the published RTSP endpoint.</figcaption>
</figure>

## Discovery and Capability Publication

A GCS discovers the camera through its MAVLink component heartbeat and requests `CAMERA_INFORMATION` using `MAV_CMD_REQUEST_MESSAGE`. In `mav-cam`, `MavClient` constructs a MAVSDK `CameraServer`, asks `CameraLocalClient` to fill the camera information, then calls `set_information()` to activate and publish the camera capability model.

`CAMERA_INFORMATION` advertises capture, video, streaming, zoom, settings, storage, and tracking capabilities. It can also contain a **Camera Definition File** URI. The current local implementation publishes an `mftp://definition/...` URI when a definition file is available; the MAVSDK `FtpServer` serves the configured payload file root so a compatible GCS can retrieve it.

## `mav-cam` Protocol Mapping

| Camera Protocol v2 function | `mav-cam` implementation |
| --- | --- |
| Discovery and capabilities | `CameraServer` + `CameraLocalClient::fill_information()` + `set_information()` → `CAMERA_INFORMATION` |
| Stream discovery | `fill_video_stream_info()` + `set_video_stream_info()` → `VIDEO_STREAM_INFORMATION` with the active `rtsp://<camera-ip>/live` URI |
| Camera modes, zoom, capture, recording, stream start/stop | `CameraServer.subscribe_*` callbacks forward commands to `CameraLocalClient`, then return `COMMAND_ACK`-equivalent MAVSDK feedback |
| Settings and definition-driven UI | `CameraServer` settings callbacks return `CAMERA_SETTINGS`; `ParamServer` parameter updates map UI changes to local camera settings |
| SD-card state and formatting | storage callbacks return `STORAGE_INFORMATION`; format requests are delegated to the local storage manager |
| Capture state | `fill_capture_status()` returns `CAMERA_CAPTURE_STATUS` for requested capture feedback |
| Point tracking | `TrackingServer` maps tracking-point and tracking-off commands to the local AI/tracking service |

## Commands, Results, and Status

The CameraServer implementation subscribes to camera time, zoom, photo capture, start/stop recording, start/stop streaming, mode, storage information, storage formatting, capture status, settings, and reset-settings requests. Each callback forwards work to `CameraLocalClient` and reports success or failure through the normal MAVLink `COMMAND_ACK` flow.

For interactive capture, the client receives the command result and `CAMERA_CAPTURE_STATUS`; after a successful photo operation, `mav-cam` also reports capture feedback. For storage, the service returns capacity and status from the SD-card manager before accepting media operations.

## Video Stream Metadata

The protocol publishes video configuration, not the encoded image payload. `VIDEO_STREAM_INFORMATION` carries the stream identifier, URI, resolution, frame rate, bitrate, rotation, spectrum, and state. `mav-cam` currently publishes one running preview stream with `stream_id = 1` and `rtsp://<camera-ip>/live`.

**Video frames are not transported over MAVLink.** MAVLink tells QGroundControl how to discover and control the stream; RTSP over Ethernet carries the H.264/H.265 preview. See [Video Streaming](/docs/architecture/video-streaming) for the composed single-stream pipeline.

## Settings and Camera Definition

The Camera Protocol v2 definition-file mechanism lets a GCS build a settings UI from camera-provided metadata. `mav-cam` keeps the protocol-facing setting list in `CameraLocalClient`, while `ParamServer` receives parameter changes and converts them to local setting operations. This covers mode, image and video format, 3A controls, zoom, thermal palette/FFC, and AI-function selection without requiring a vendor-specific ground-station UI.

## Tracking Extension

Camera tracking is exposed through the MAVSDK `TrackingServer` integration. A point-tracking request is handed to the socket-based local tracking service described in [Camera](/docs/architecture/camera); its detection results are rendered as overlays and can be returned through the standard tracking status path as implemented by the selected client and GCS.

## Implementation Boundary

OpenMAVCam follows the standard Camera Protocol v2 semantics first and keeps hardware-specific behavior below `CameraLocalClient`. This permits a GCS or autopilot to use standard discovery and commands while visible-light, infrared, AI, render, and storage implementations evolve independently.

For message-level requirements and GCS behavior, consult the [official Camera Protocol v2 guide](https://mavlink.io/en/services/camera.html). Continue to [Camera Information](/docs/protocol/camera-information), [Capture](/docs/protocol/capture), [Zoom](/docs/protocol/zoom), and [Tracking](/docs/protocol/tracking) for focused references.
