---
title: 仓库结构
---

# 仓库结构

## 事实来源

本页描述 `.repo/manifests/D64TR.xml` 声明的 D64TR 源码工作区。Manifest 将每个直接列出的 project 固定到一个 revision。应将这些路径和 revision 作为可复现的 D64TR 源码集合；不要使用名称相似的仓库或任意 branch 替代。

`D64TR.xml` 还包含 `LU.UM.3.3.1.r1-Common.xml`。该继承 manifest 提供通用 platform dependency，本文不会把它表示为 D64TR 专用代码。

## 工作区树

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

## Manifest 模块映射

### Environment 和 System

| Manifest project | 工作区路径 | D64TR 职责 |
| --- | --- | --- |
| `docker` | `docker/` | 可复现的 development-container environment。 |
| `build-scripts` | `build-scripts/` | 产品 build orchestration helper。 |
| `qti-conf` | `poky/qti-conf/` | QTI build configuration；通过 manifest `linkfile` 提供 `setup-environment`。 |
| `msm-5.4` | `src/kernel/msm-5.4/` | QRB5165 Linux kernel base。 |
| `display-drivers` | `src/kernel/msm-5.4/techpack/display/` | 合入 kernel tree 的 display technology-pack source。 |
| `weston` | `src/display/weston/` | 用于 composed display pipeline 的 Wayland compositor。 |
| `uvc-gadget` | `src/vendor/aeroratech/uvc-gadget/` | 用于 host-visible video 的 USB Video Class gadget path。 |
| `platform-system-core` | `src/system/core/` | 产品镜像所需的 platform system/core service。 |
| `platform-external-wpa_supplicant_8` | `src/external/wpa_supplicant_8/` | Wi-Fi supplicant integration。 |

### Yocto Metadata

| Manifest project | 工作区路径 | D64TR 职责 |
| --- | --- | --- |
| `meta-aeroratech-bsp` | `poky/meta-aeroratech-bsp/` | 产品 BSP recipe、base service、connectivity、UVC 和 package group。 |
| `meta-aeroratech-display` | `poky/meta-aeroratech-display/` | display-layer recipe 和 display package group。 |
| `meta-aeroratech-mm` | `poky/meta-aeroratech-mm/` | multimedia recipe，包括 camera/gimbal/storage metadata package。 |
| `meta-aeroratech-ml` | `poky/meta-aeroratech-ml/` | ML package group 和 object detection/tracking recipe。 |
| `meta-qti-audio` | `poky/meta-qti-audio/` | Qualcomm audio layer。 |
| `meta-qti-bsp` | `poky/meta-qti-bsp/` | Qualcomm BSP layer。 |
| `meta-qti-ml` | `poky/meta-qti-ml/` | Qualcomm ML layer 和 target dependency。 |
| `meta-qti-ubuntu` | `poky/meta-qti-ubuntu/` | QTI image 的 Ubuntu integration layer。 |
| `meta-qti-camera-prop` | `poky/meta-qti-camera-prop/` | Qualcomm proprietary camera integration layer。 |

### Camera Payload 和 Media

| Manifest project | 工作区路径 | 主要目录 | D64TR 职责 |
| --- | --- | --- | --- |
| `qcom-cam` | `src/vendor/aeroratech/qcom-cam/` | `interface/`、`qcom_camera/`、`qcamx/`、`gstreamer/`、`encoder/`、`qcamx_test/` | RGB camera hardware abstraction、Qualcomm camera pipeline、capture/record/stream implementation 和 `qcom_camera_test`。 |
| `MAVCam` | `src/vendor/aeroratech/mav-cam/` | `src/mav_client/`、`src/mav_server/`、`src/camera_param/`、`src/tracking/`、`src/definition/`、`example/` | MAVLink camera component：MAVSDK server plugin、local camera bridge、parameter、tracking control、Definition File 和 GCS demo。 |
| `MAVSDK` | `src/vendor/aeroratech/MAVSDK/` | `src/mavsdk/`、`examples/`、`src/mavsdk_server/` | `mav-cam` 使用的 MAVLink SDK dependency，提供 camera、FTP、parameter 和 tracking service。 |
| `ir-cam` | `src/vendor/aeroratech/ir-cam/` | `interface/`、`src/`、`gstreamer/`、`test/` | thermal camera abstraction、palette/FFC/temperature function、thermal media、streaming 和 IR demo。 |
| `render-bridge` | `src/vendor/aeroratech/render-bridge/` | `bridge/`、`weston/`、`drm/`、`v4l2/` | RGB/IR composition、OSD、AI overlay 和 output backend。 |
| `storage-manager` | `src/vendor/aeroratech/storage-manager/` | `storage/`、`base/`、`test/` | storage discovery、capacity state、media path/index management、formatting 和 storage test。 |
| `exif-writer` | `src/vendor/aeroratech/exif-writer/` | `src/`、`third_party/` | capture 后写入 image EXIF metadata。 |
| `timezone-writer` | `src/vendor/aeroratech/timezone-writer/` | `src/`、`third_party/` | 写入 timezone-related capture metadata。 |
| `dng-sdk` | `src/vendor/aeroratech/dng-sdk/` | `lib/`、`test/`、`third_party/` | DNG encoding 和 validation support。 |
| `XMP-Toolkit-SDK` | `src/vendor/aeroratech/XMP-Toolkit-SDK/` | `XMPCore/`、`XMPFiles/`、`samples/` | media metadata workflow 使用的 XMP metadata library。 |

### Gimbal、Tools 和 AI

| Manifest project | 工作区路径 | 主要目录 | D64TR 职责 |
| --- | --- | --- | --- |
| `gimbal-server` | `src/vendor/aeroratech/gimbal-server/` | `src/`、`base/`、`mavlink2/`、`test/` | gimbal MAVLink service 和 hardware control path。 |
| `gimbal-update` | `src/vendor/aeroratech/gimbal-update/` | `src/`、`base/`、`mavlink2/` | gimbal firmware-update service。 |
| `aerora-tools` | `src/vendor/aeroratech/aerora-tools/` | product tool script 和 utility | 产品维护和 integration tool。 |
| `object-detection` | `src/vendor/aeroratech/object-detection/` | `src/`、`models/`、`service/` | 产生 class ID、confidence value 和 bounding box 的 AI inference service。 |
| `object-tracking` | `src/vendor/aeroratech/object-tracking/` | `byteTrack/`、`deepsort/`、`example/` | 消费 detection result 的 target association 和 tracking service。 |

## Camera Payload 依赖关系

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

## 工作规则

1. 使用 `D64TR.xml` 声明的路径；manifest project name 和本地目录可能不同，例如 `MAVCam` 位于 `src/vendor/aeroratech/mav-cam/`。
2. 复现或发布 D64TR image 时保持每个 manifest revision 固定。仅通过有意的 manifest 修改更新 revision。
3. 将 product packaging 和 dependency 修改放入对应的 `poky/meta-*` recipe layer；将 runtime behavior 放入对应 source module。
4. 从最窄层开始修改相机功能：hardware behavior 在 `qcom-cam` 或 `ir-cam`，composition 在 `render-bridge`，MAVLink exposure 在 `mav-cam`，AI behavior 在 object service module。
5. 完整 camera payload integration test 前，先运行模块自身的 test/demo。

## 参考

- `D64TR.xml`: `.repo/manifests/D64TR.xml`
- [相机架构](../architecture/camera.md)
- [API 参考](../api-reference/mav-cam.md)
