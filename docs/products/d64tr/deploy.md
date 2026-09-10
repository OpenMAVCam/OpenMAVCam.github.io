---
title: Deploy the D64TR Image
sidebar_position: 3
---

After building the image, flash the generated artifacts to an unlocked D64TR target. Keep the target connected over ADB until it enters fastboot mode.

## Enter fastboot mode

```bash
adb reboot bootloader
fastboot devices
```

Confirm that `fastboot devices` lists the connected target before flashing.

## Flash both slots

From the deployment directory, flash the boot and system images to every slot:

```bash
cd build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5
fastboot --slot all flash boot qti-ubuntu-robotics-image-qrb5165-rb5-boot.img
fastboot --slot all flash system qti-ubuntu-robotics-image-qrb5165-rb5-sysfs.ext4
fastboot reboot
```

Do not interrupt the system-image transfer: the filesystem image is several gigabytes. After the target restarts, continue with [Autopilot integration](/docs/getting-started/autopilot).
