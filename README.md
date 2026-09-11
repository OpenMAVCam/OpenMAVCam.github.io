# OpenMAVCam

OpenMAVCam is an open-source, MAVLink-native camera platform for autonomous systems. It connects camera control, stabilized gimbal control, low-latency video, edge AI, storage, and ground-station workflows through documented, modular interfaces.

The project is designed for UAVs, UGVs, robot platforms, and other MAVLink-compatible systems. It integrates with PX4, ArduPilot, and QGroundControl using standard MAVLink camera and gimbal services; no custom autopilot firmware change is required for the normal integration path.

Website and documentation: [openmavcam.github.io](https://openmavcam.github.io/)

## What OpenMAVCam Provides

- Full camera control: 3A settings, imaging modes, photo capture, video recording, zoom, metadata, and storage state.
- Three-axis gimbal control through MAVLink-compatible control services.
- Low-latency composed video for visible, thermal, OSD, and AI overlay output.
- Edge AI integration for object detection, tracking, confidence reporting, and custom-trained vision models.
- An open software stack that can be inspected, modified, built, and deployed by product teams.
- Production-oriented camera platforms; hardware capabilities and sensors are defined per product rather than by one fixed payload design.

## Current Product and Documentation

The first documented product is **D64TR**, a QRB5165-based camera platform. Its build guide is product-specific. Future products can provide different source trees and image build steps while following the same documented deployment and MAVLink integration model.

| Topic | Documentation |
| --- | --- |
| Product specification | [D64TR](https://openmavcam.github.io/docs/products/d64tr) |
| Product image build | [Build the D64TR Image](https://openmavcam.github.io/docs/products/d64tr/build) |
| Product image deployment | [Deploy the D64TR Image](https://openmavcam.github.io/docs/products/d64tr/deploy) |
| Shared build/deploy overview | [Build and Deploy](https://openmavcam.github.io/docs/getting-started/build) |
| PX4 / ArduPilot integration | [Autopilot](https://openmavcam.github.io/docs/getting-started/autopilot) |
| Ground-station validation | [QGroundControl](https://openmavcam.github.io/docs/getting-started/qgroundcontrol) |
| Architecture and module APIs | [Documentation](https://openmavcam.github.io/docs/overview/what-is-openmavcam) |

## Build a D64TR Image

### Host requirements

- x86_64 Linux host
- At least **32 GB RAM** and **200 GB** free storage
- Ubuntu 22.04 with Docker, or a native Ubuntu 20.04 build host
- Supplied D64TR proprietary components and access to the D64TR manifest source

### Fetch the source tree

Extract the supplied proprietary components, initialize the D64TR manifest, and synchronize the pinned source revisions:

```bash
mkdir D64TR
tar -xJf d64tr_proprietary.tar.xz -C ./D64TR/
cd D64TR
repo init -u https://github.com/aeroratech/D64TR-manifest.git -b open -m D64TR.xml
repo sync -j "$(nproc)"
```

The manifest defines the complete D64TR source set, including Yocto layers, camera services, MAVSDK, rendering, storage, gimbal, and AI modules. Keep its revisions pinned for reproducible builds.

### Configure the build environment

On Ubuntu 22.04, create and enter the supplied Docker build environment from the source-tree root:

```bash
docker/build_docker.sh
```

For a native Ubuntu 20.04 host, install the tools required by the manifest, configure `/bin/sh` to use Bash, and set the required AArch64 dynamic-loader symlink before building.

### Build

Run in the configured Docker container or native build environment:

```bash
source setup-environment
bitbake qti-ubuntu-robotics-image
```

The D64TR boot and filesystem artifacts are produced in:

```text
build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5/
```

Do not use this build procedure for a future product unless that product’s build guide explicitly says it uses the same manifest, machine, and image recipe.

## Deploy an Image

OpenMAVCam products use a fastboot deployment flow. Use the artifact names and deployment directory produced by the selected product build. The commands below are the D64TR example.

1. Connect the unlocked target through ADB and enter fastboot:

   ```bash
   adb reboot bootloader
   fastboot devices
   ```

2. Confirm that `fastboot devices` lists the expected target. From the product deployment directory, flash both slots:

   ```bash
   cd build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5
   fastboot --slot all flash boot qti-ubuntu-robotics-image-qrb5165-rb5-boot.img
   fastboot --slot all flash system qti-ubuntu-robotics-image-qrb5165-rb5-sysfs.ext4
   fastboot reboot
   ```

Do not disconnect the target or interrupt the system-image transfer. The filesystem image can be several gigabytes. After restart, validate the product network, video, camera control, and MAVLink connection before mission use.

## Validate with QGroundControl

OpenMAVCam validates its ground-station workflow with official **QGroundControl v5.1.0** and a self-built **`5.1.0_custom`** variant for OpenMAVCam-specific enhancements.

For a camera-only desktop check, run PX4 SITL, connect the camera Ethernet port to the computer, start QGroundControl, then validate camera discovery, live video, photo capture, recording, and AI status:

```bash
make px4_sitl gz_x500
```

This simulator flow validates camera functions only. Gimbal control requires the gimbal UART to be connected to a real autopilot. Enable `Camera.VehicleCameraControl` and `Camera.VehicleCameraControl.Verbose` in the QGroundControl App Log Viewer when diagnosing camera behavior.

## Repository Layout

This repository contains the OpenMAVCam documentation website. Product source is built from its product manifest.

```text
OpenMAVCam.github.io/
├── docs/                         English documentation source
├── i18n/zh-CN/                   Simplified Chinese documentation mirror
├── src/                          Docusaurus pages, components, and product data
├── static/                       Local images and static assets
├── test/                         Content, product, and locale validation
├── sidebars.ts                   Documentation navigation
└── .github/workflows/            Validation and GitHub Pages deployment
```

For the D64TR product source layout and module responsibilities, see [Repository Structure](https://openmavcam.github.io/docs/developer-guide/repository-structure).

## Develop the Website

Install dependencies and start a local site preview:

```bash
npm ci
npm run start
```

Run the complete site validation before committing:

```bash
npm run validate
```

The validation runs content tests and generates both English and Simplified Chinese production sites. Every public page under `docs/` requires a matching Chinese page under `i18n/zh-CN/docusaurus-plugin-content-docs/current/`.

## Publish to GitHub Pages

This repository is published at `https://openmavcam.github.io/`.

1. In GitHub, enable **Settings → Pages → Source → GitHub Actions** for `OpenMAVCam/OpenMAVCam.github.io`.
2. Pull requests run static-site validation.
3. A validated push to `main` builds the Docusaurus site and deploys the generated static artifact to GitHub Pages.

## Contributing and License

- Read the full [Contribution guide](https://openmavcam.github.io/docs/developer-guide/contribution) before opening a pull request.
- OpenMAVCam-authored code is licensed under **Apache License 2.0**. Third-party and vendor dependencies retain their own terms; see [License](https://openmavcam.github.io/docs/developer-guide/license).
