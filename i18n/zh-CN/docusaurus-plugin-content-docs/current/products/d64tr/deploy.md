---
title: 部署 D64TR 镜像
sidebar_position: 3
---

构建完成后，将生成的镜像刷写到已解锁的 D64TR 目标设备。在设备进入 fastboot 模式前请保持 ADB 连接。

## 进入 fastboot 模式

```bash
adb reboot bootloader
fastboot devices
```

刷写前请确认 `fastboot devices` 已列出连接的目标设备。

## 刷写所有 slot

在部署目录中，将 boot 和 system 镜像刷写到每一个 slot：

```bash
cd build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5
fastboot --slot all flash boot qti-ubuntu-robotics-image-qrb5165-rb5-boot.img
fastboot --slot all flash system qti-ubuntu-robotics-image-qrb5165-rb5-sysfs.ext4
fastboot reboot
```

不要中断 system 镜像传输：文件系统镜像有数 GB 大小。设备重启后，继续进行[飞控集成](/docs/getting-started/autopilot)。
