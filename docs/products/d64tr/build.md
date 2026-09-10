---
title: Build the D64TR Image
sidebar_position: 2
---

This guide builds the D64TR Ubuntu image for the QRB5165/RB5 target.

## Host requirements

- x86_64 Linux host
- At least **32 GB RAM** and **200 GB** of free storage
- Ubuntu 22.04 with Docker, or a native Ubuntu 20.04 build host

## Get the source tree

Extract the supplied proprietary components, then initialize and synchronize the manifest:

```bash
mkdir D64TR
tar -xJf d64tr_proprietary.tar.xz -C ./D64TR/
cd D64TR
repo init -u https://github.com/aeroratech/D64TR-manifest.git -b open -m D64TR.xml
repo sync -j "$(nproc)"
```

## Configure the build environment

On Ubuntu 22.04, use the supplied Docker helper from the source-tree root:

```bash
docker/build_docker.sh
```

For a native Ubuntu 20.04 build, install the host tools listed in the manifest README, ensure `/bin/sh` is Bash, and configure the required AArch64 dynamic-loader symlink.

## Build

Run inside the configured Docker container or native Ubuntu 20.04 environment:

```bash
source setup-environment
bitbake qti-ubuntu-robotics-image
```

The generated boot and filesystem images are placed in `build-qti-distro-ubuntu-fullstack-perf/tmp-glibc/deploy/images/qrb5165-rb5/`.
