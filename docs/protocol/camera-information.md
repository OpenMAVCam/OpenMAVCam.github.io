---
title: Camera Information
---

# Camera Information

## Purpose

Publish the camera identity, optical metadata, supported operations, and Camera Definition File endpoint through `CAMERA_INFORMATION`.

## Inputs / MAVLink Request

| Item | Value |
| --- | --- |
| GCS request | `MAV_CMD_REQUEST_MESSAGE` for `CAMERA_INFORMATION` |
| Identity source | Device product brand, model, and firmware version |
| Optical source | `mav_camera::MavCamera::get_information()` |
| Definition file | `mftp://definition/<model_name>.xml` |

## Runtime Flow

```text
GCS request
  → MAVSDK CameraServer
  → registered Information object
  → CAMERA_INFORMATION

MavClient::initialize()
  → CameraLocalClient::fill_information()
  → MavCamera::get_information()
  → CameraServer::set_information()
```

## Source Code Entry Points

| Responsibility | Location / symbol |
| --- | --- |
| Register information | `mav-cam/src/mav_client/mav_client.cpp` · `CameraServer::set_information()` |
| Build information | `mav-cam/src/mav_client/camera_local_client.cpp` · `CameraLocalClient::fill_information()` |
| RGB hardware abstraction | `qcom-cam/interface/mav_camera.h` · `MavCamera::get_information()` |
| Definition-file transfer | MAVSDK `FtpServer` configured by `MavClient` |

## Outputs / MAVLink Responses

| `CAMERA_INFORMATION` field group | OpenMAVCam value |
| --- | --- |
| Vendor, model, firmware | `product_brand_from_device()`, `product_name_from_device()`, `firmware_version_from_device()` |
| Lens and sensor metadata | Focal length, sensor dimensions, resolution, lens ID from `MavCamera::get_information()` |
| Definition metadata | Version from `definition_file_version_from_device(model_name)`; URI `mftp://definition/<model_name>.xml` |
| Capability flags | `CaptureImage`, `CaptureVideo`, `HasModes`, `HasVideoStream`, `HasBasicZoom`, `HasTrackingPoint` |

## State and Data Fields

- A new RGB camera must implement `get_information()` with real optical and resolution data.
- Advertise a capability only when its backend and MAVLink response path both work.
- Increment the definition-file version when a released XML schema or setting enumeration changes.

## Failure Conditions

`fill_information()` returns `CameraServer::Result::NoSystem` when the RGB backend is unavailable. It currently supplies fallback values such as `Unknown`, `0.0.0.0`, zero optical values, and an empty definition URI. Product integrations should check this result before calling `set_information()` and retry after the local camera service is ready.

## Validation

1. Start the camera and MAVLink services.
2. Request `CAMERA_INFORMATION` from QGroundControl.
3. Verify identity, resolution, focal length, flags, and definition URI against the product configuration.
4. Retrieve the definition XML through MFTP and confirm the GCS renders its settings.
5. Stop the RGB backend and confirm an incomplete `Unknown` record is not published.

## References

- [MAVLink Camera Protocol](https://mavlink.io/en/services/camera.html)
