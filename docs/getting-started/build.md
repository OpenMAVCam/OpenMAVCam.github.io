---
title: Build and Deploy
---
OpenMAVCam products have product-specific build environments and image contents, but use the same image deployment method. Build the image for your product first, then flash it with the shared fastboot sequence below.

## Build

Build steps are product-specific. Select the appropriate product guide for its source tree, host requirements, build environment, and image artifacts.

- [Build the D64TR Image](/docs/products/d64tr/build) — build the D64TR Ubuntu image for the QRB5165/RB5 target.

Additional product build guides will be added alongside their product documentation.

## Deploy an Image

All OpenMAVCam products use the same fastboot deployment method. Use the deployment directory and artifact names produced by the selected product's build guide. The commands below use D64TR artifacts as the concrete example.

### Enter fastboot mode

Connect the target over ADB, then restart it into fastboot mode:

```bash
adb reboot bootloader
fastboot devices
```

Confirm that `fastboot devices` lists the connected target before flashing.

### Flash both slots

From the product deployment directory, flash the boot and system images to every slot, then restart the target:

```bash
cd build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5
fastboot --slot all flash boot qti-ubuntu-robotics-image-qrb5165-rb5-boot.img
fastboot --slot all flash system qti-ubuntu-robotics-image-qrb5165-rb5-sysfs.ext4
fastboot reboot
```

Do not interrupt the system-image transfer: the filesystem image can be several gigabytes. After the target restarts, continue with [Autopilot integration](/docs/getting-started/autopilot).
