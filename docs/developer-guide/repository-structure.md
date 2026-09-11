---
title: Repository Structure
---

# Repository Structure

## Source of Truth

This page describes the D64TR source workspace declared in `.repo/manifests/D64TR.xml`. The manifest pins every directly listed project to a revision. Treat those paths and revisions as the reproducible D64TR source set; do not substitute a similarly named repository or an arbitrary branch.

`D64TR.xml` also includes `LU.UM.3.3.1.r1-Common.xml`. That inherited manifest supplies common platform dependencies and is intentionally not represented below as D64TR-specific code.

## Workspace Tree

```text
D64TR-open/
├── docker/                              development container definitions
├── build-scripts/                       product build helpers
├── setup-environment                    link to poky/qti-conf/set_bb_env.sh
├── poky/
│   ├── qti-conf/                        QTI/Yocto environment configuration
│   ├── meta-aeroratech-{bsp,display,mm,ml}/
│   └── meta-qti-{audio,bsp,ml,ubuntu,camera-prop}/
└── src/
    ├── kernel/msm-5.4/                  kernel and display driver source
    ├── display/weston/                  compositor
    ├── system/core/                     platform system services
    ├── external/wpa_supplicant_8/       Wi-Fi supplicant
    └── vendor/aeroratech/
        ├── qcom-cam/  mav-cam/  MAVSDK/  ir-cam/
        ├── render-bridge/  storage-manager/  uvc-gadget/
        ├── exif-writer/  timezone-writer/  dng-sdk/  XMP-Toolkit-SDK/
        ├── gimbal-server/  gimbal-update/  aerora-tools/
        └── object-detection/  object-tracking/
```

## Manifest Module Map

### Environment and System

| Manifest project | Workspace path | D64TR responsibility |
| --- | --- | --- |
| `docker` | `docker/` | Reproducible development-container environment. |
| `build-scripts` | `build-scripts/` | Product build orchestration helpers. |
| `qti-conf` | `poky/qti-conf/` | QTI build configuration; exposes `setup-environment` through the manifest `linkfile`. |
| `msm-5.4` | `src/kernel/msm-5.4/` | QRB5165 Linux kernel base. |
| `display-drivers` | `src/kernel/msm-5.4/techpack/display/` | Kernel display technology-pack source layered into the kernel tree. |
| `weston` | `src/display/weston/` | Wayland compositor used by the composed display pipeline. |
| `uvc-gadget` | `src/vendor/aeroratech/uvc-gadget/` | USB Video Class gadget path for host-visible video. |
| `platform-system-core` | `src/system/core/` | Platform system/core services required by the product image. |
| `platform-external-wpa_supplicant_8` | `src/external/wpa_supplicant_8/` | Wi-Fi supplicant integration. |

### Yocto Metadata

| Manifest project | Workspace path | D64TR responsibility |
| --- | --- | --- |
| `meta-aeroratech-bsp` | `poky/meta-aeroratech-bsp/` | Product BSP recipes, base services, connectivity, UVC, and package groups. |
| `meta-aeroratech-display` | `poky/meta-aeroratech-display/` | Display-layer recipes and display package group. |
| `meta-aeroratech-mm` | `poky/meta-aeroratech-mm/` | Multimedia recipes, including camera/gimbal/storage metadata packages. |
| `meta-aeroratech-ml` | `poky/meta-aeroratech-ml/` | ML package group and object detection/tracking recipes. |
| `meta-qti-audio` | `poky/meta-qti-audio/` | Qualcomm audio layer. |
| `meta-qti-bsp` | `poky/meta-qti-bsp/` | Qualcomm BSP layer. |
| `meta-qti-ml` | `poky/meta-qti-ml/` | Qualcomm ML layer and target dependencies. |
| `meta-qti-ubuntu` | `poky/meta-qti-ubuntu/` | Ubuntu integration layer for the QTI image. |
| `meta-qti-camera-prop` | `poky/meta-qti-camera-prop/` | Qualcomm proprietary camera integration layer. |

### Camera Payload and Media

| Manifest project | Workspace path | Main directories | D64TR responsibility |
| --- | --- | --- | --- |
| `qcom-cam` | `src/vendor/aeroratech/qcom-cam/` | `interface/`, `qcom_camera/`, `qcamx/`, `gstreamer/`, `encoder/`, `qcamx_test/` | RGB camera hardware abstraction, Qualcomm camera pipeline, capture/record/stream implementation, and `qcom_camera_test`. |
| `MAVCam` | `src/vendor/aeroratech/mav-cam/` | `src/mav_client/`, `src/mav_server/`, `src/camera_param/`, `src/tracking/`, `src/definition/`, `example/` | MAVLink camera component: MAVSDK server plugins, local camera bridge, parameters, tracking control, Definition Files, and GCS demos. |
| `MAVSDK` | `src/vendor/aeroratech/MAVSDK/` | `src/mavsdk/`, `examples/`, `src/mavsdk_server/` | MAVLink SDK dependency used by `mav-cam` for camera, FTP, parameter, and tracking services. |
| `ir-cam` | `src/vendor/aeroratech/ir-cam/` | `interface/`, `src/`, `gstreamer/`, `test/` | Thermal camera abstraction, palette/FFC/temperature functions, thermal media, streaming, and IR demos. |
| `render-bridge` | `src/vendor/aeroratech/render-bridge/` | `bridge/`, `weston/`, `drm/`, `v4l2/` | RGB/IR composition, OSD, AI overlays, and output backends. |
| `storage-manager` | `src/vendor/aeroratech/storage-manager/` | `storage/`, `base/`, `test/` | Storage discovery, capacity state, media path/index management, formatting, and storage test. |
| `exif-writer` | `src/vendor/aeroratech/exif-writer/` | `src/`, `third_party/` | Writes image EXIF metadata after capture. |
| `timezone-writer` | `src/vendor/aeroratech/timezone-writer/` | `src/`, `third_party/` | Writes timezone-related capture metadata. |
| `dng-sdk` | `src/vendor/aeroratech/dng-sdk/` | `lib/`, `test/`, `third_party/` | DNG encoding and validation support. |
| `XMP-Toolkit-SDK` | `src/vendor/aeroratech/XMP-Toolkit-SDK/` | `XMPCore/`, `XMPFiles/`, `samples/` | XMP metadata library used by media metadata workflows. |

### Gimbal, Tools, and AI

| Manifest project | Workspace path | Main directories | D64TR responsibility |
| --- | --- | --- | --- |
| `gimbal-server` | `src/vendor/aeroratech/gimbal-server/` | `src/`, `base/`, `mavlink2/`, `test/` | Gimbal MAVLink service and hardware control path. |
| `gimbal-update` | `src/vendor/aeroratech/gimbal-update/` | `src/`, `base/`, `mavlink2/` | Gimbal firmware-update service. |
| `aerora-tools` | `src/vendor/aeroratech/aerora-tools/` | product tool scripts and utilities | Product maintenance and integration tools. |
| `object-detection` | `src/vendor/aeroratech/object-detection/` | `src/`, `models/`, `service/` | AI inference service that produces class IDs, confidence values, and bounding boxes. |
| `object-tracking` | `src/vendor/aeroratech/object-tracking/` | `byteTrack/`, `deepsort/`, `example/` | Target association and tracking service consuming detection results. |

## Camera Payload Dependency View

```text
qcom-cam ── RGB frames ─┐
ir-cam   ── IR frames ──┼─→ render-bridge ─→ Weston / DRM / V4L2 / composed preview
                        │
storage-manager ────────┼─→ qcom-cam / ir-cam ─→ media files
exif-writer + timezone-writer + dng-sdk + XMP-Toolkit-SDK ─→ capture metadata
                        │
mav-cam + MAVSDK ───────┼─→ MAVLink camera, settings, FTP, tracking, and GCS control
object-detection ───────┴─→ object-tracking ─→ mav-cam tracking data + render overlays
gimbal-server ─────────────────────────────────→ gimbal MAVLink control
```

## Working Rules

1. Use the path stated in `D64TR.xml`; a manifest project name and its local directory may differ, such as `MAVCam` at `src/vendor/aeroratech/mav-cam/`.
2. Keep each manifest revision pinned while reproducing or releasing a D64TR image. Update a revision only through an intentional manifest change.
3. Put product packaging and dependency changes in the relevant `poky/meta-*` recipe layer; put runtime behavior in the corresponding source module.
4. Begin camera changes at the narrowest layer: hardware behavior in `qcom-cam` or `ir-cam`, composition in `render-bridge`, MAVLink exposure in `mav-cam`, and AI behavior in the object service modules.
5. Run the module’s own test/demo before testing the full camera payload integration.

## References

- `D64TR.xml`: `.repo/manifests/D64TR.xml`
- [Camera Architecture](../architecture/camera.md)
- [API Reference](../api-reference/mav-cam.md)
