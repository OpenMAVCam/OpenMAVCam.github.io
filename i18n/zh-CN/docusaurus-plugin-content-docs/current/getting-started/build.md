---
title: 构建和部署
---

OpenMAVCam 产品有各自的构建环境和镜像内容，但使用相同的镜像部署方式。先构建产品镜像，再使用以下通用 fastboot 流程刷写。

## 构建

构建步骤因产品而异。请根据产品源码树、主机要求、构建环境和镜像产物选择对应指南。

- [构建 D64TR 镜像](/docs/products/d64tr/build) — 为 QRB5165/RB5 目标构建 D64TR Ubuntu 镜像。

后续产品会在其产品文档中提供相应构建指南。

## 部署镜像

所有 OpenMAVCam 产品使用同一 fastboot 部署方法。使用所选产品构建指南产出的部署目录和产物名称；以下以 D64TR 产物为例。

### 进入 fastboot 模式

通过 ADB 连接目标设备，然后重启到 fastboot：

```bash
adb reboot bootloader
fastboot devices
```

刷写前确认 `fastboot devices` 已列出连接设备。

### 刷写全部 slot

从产品部署目录将 boot 与 system 镜像刷到所有 slot，然后重启目标：

```bash
cd build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5
fastboot --slot all flash boot qti-ubuntu-robotics-image-qrb5165-rb5-boot.img
fastboot --slot all flash system qti-ubuntu-robotics-image-qrb5165-rb5-sysfs.ext4
fastboot reboot
```

不要中断 system 镜像传输，文件系统镜像可能有数 GB。目标重启后继续进行[飞控集成](/docs/getting-started/autopilot)。
