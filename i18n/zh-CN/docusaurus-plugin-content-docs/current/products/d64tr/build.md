---
title: 构建 D64TR 镜像
sidebar_position: 2
---

本指南用于构建面向 QRB5165/RB5 目标的 D64TR Ubuntu 镜像。

## 主机构建要求

- x86_64 Linux 主机
- 至少 **32 GB RAM** 和 **200 GB** 可用存储空间
- Ubuntu 22.04（Docker）或原生 Ubuntu 20.04 构建主机

## 获取源码树

解压提供的专有组件，然后初始化并同步 manifest：

```bash
mkdir D64TR
tar -xJf d64tr_proprietary.tar.xz -C ./D64TR/
cd D64TR
repo init -u https://github.com/aeroratech/D64TR-manifest.git -b open -m D64TR.xml
repo sync -j "$(nproc)"
```

## 配置构建环境

在 Ubuntu 22.04 上，从源码根目录使用提供的 Docker 辅助脚本：

```bash
docker/build_docker.sh
```

对于原生 Ubuntu 20.04 构建，请安装 manifest README 中的主机工具，确保 `/bin/sh` 指向 Bash，并配置所需的 AArch64 动态加载器软链接。

## 构建

在已配置的 Docker 容器或原生 Ubuntu 20.04 环境中运行：

```bash
source setup-environment
bitbake qti-ubuntu-robotics-image
```

生成的 boot 和文件系统镜像位于 `build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5/`。
