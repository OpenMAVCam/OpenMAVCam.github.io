---
title: mav-cam
---

# mav-cam

## Scope

Test `mav-cam` at two boundaries: run `mav_client` as the payload service, then use the included MAVSDK client demos as a GCS. The demos validate camera operations and Definition File settings without hand-writing MAVLink messages.

## Start the Payload Service

`mav_client` accepts a MAVSDK connection URL, local/remote client selection, an RPC port, FTP root, log path, connection type, initial camera mode, and initial snapshot resolution.

```bash
mav_client \
  -u udp://127.0.0.1:14550 \
  --connection_type ethernet \
  --ftp_path /usr/share/mav-cam/ \
  --log_path /data/camera/
```

Use `--connection_type` only with `usb`, `wlan`, or `ethernet`. For Ethernet, `mav_client` derives the RTSP address from `eth0`; startup fails when no IPv4 address is available. Use `--camera_mode 0` for photo or `--camera_mode 1` for video when an explicit initial mode is required.

## Camera Operation Demo

`mav-cam/example/camera_operation/camera_operation.cpp` has the GCS-side call order:

```text
Mavsdk(GroundStation) → add_any_connection("udp://:14550")
  → wait for system.has_camera()
  → Camera(system)
  → subscribe_status() + subscribe_capture_info()
  → invoke operation and check its result
```

| API | Demo validation |
| --- | --- |
| `format_storage(1)` | Check the returned operation result before using media storage. |
| `reset_settings()` | Check result, then confirm the camera returns to documented defaults. |
| `take_photo()` / `start_photo_interval()` / `stop_photo_interval()` | Observe `subscribe_capture_info()` and confirm the expected capture count. |
| `start_video()` / `stop_video()` | Check operation results and capture status. |
| `start_video_streaming(1)` / `stop_video_streaming(1)` | Check result and verify the announced stream independently. |
| `set_mode(Photo/Video)` | Check result and confirm the GCS-visible current mode. |

The demo waits ten seconds for a system with `has_camera()`. Treat timeout as a service/discovery failure; do not issue operations against an arbitrary MAVSDK system.

## Definition File and Settings Demo

`mav-cam/example/camera_definition/camera_definition.cpp` defines the settings test sequence:

1. Subscribe to `Camera::Information` and wait for `definition_file_uri`.
2. Require an `mftp://` URI, remove the prefix, and download through `mavsdk::Ftp::download_async()`.
3. Pass the downloaded XML to `camera.set_definition_data()`.
4. Subscribe to `camera.subscribe_current_settings()`.
5. For each setting, call `camera.set_setting(setting)`, then `camera.get_setting(setting)` and compare `option.option_id` with the requested value.

The reference setting IDs are `CAM_WBMODE`, `CAM_EXPMODE`, `CAM_EV`, `CAM_SHUTTERSPD`, and `CAM_ISO`. They are valid only when the loaded Definition File and current product configuration expose them.

## Result Rules

- Check every `ConnectionResult`, camera operation result, FTP result, and setting readback.
- For asynchronous discovery, information, FTP, and status callbacks, include a timeout and report timeout as test failure.
- Confirm effects through the matching callback or live output; a successful call return is insufficient for storage, image, stream, and setting tests.

## Source References

- `mav-cam/src/mav_client/mav_client_bin.cpp`
- `mav-cam/example/camera_operation/camera_operation.cpp`
- `mav-cam/example/camera_definition/camera_definition.cpp`
