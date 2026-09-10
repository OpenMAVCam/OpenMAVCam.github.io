---
title: 飞控
---

OpenMAVCam 通过 MAVLink 接入真实 PX4 和 ArduPilot 飞控。本页说明物理飞控连接方式，并提供所选开发板应遵循的官方固件资源。

## 固件构建和配置

不同飞控板和飞行器的固件目标、刷写方法、串口参数和飞行器配置各不相同。请按选用飞控的官方文档执行，而不要套用通用命令序列：

- [PX4: Building PX4 Software](https://docs.px4.io/main/en/dev_setup/building_px4)
- [PX4: Loading Firmware](https://docs.px4.io/v1.13/en/config/firmware)
- [ArduPilot: Set up the Build Environment](https://ardupilot.org/dev/docs/building-setup-linux.html)
- [ArduPilot: Load Firmware to a Compatible Board](https://ardupilot.org/copter/docs/common-loading-firmware-onto-pixhawk.html)

## 相机云台 UART 连接

将相机云台 UART 接至真实飞控的可用 telemetry/UART 端口。交叉连接信号线并共地：

<img src="/img/getting-started/autopilot-uart-wiring.svg" alt="相机云台 UART 接至飞控 telemetry UART：TX 接 RX、RX 接 TX、GND 接 GND" />

- **Camera Gimbal TX** → **Flight Controller RX**
- **Camera Gimbal RX** → **Flight Controller TX**
- **Camera Gimbal GND** → **Flight Controller GND**

请根据相机云台和飞控文档确认所选 UART、波特率、电平和供电要求。除非两个产品规格均明确要求，否则不要通过该信号线束连接电源引脚。

## 在真实飞控上验证

完成固件和 UART 配置后，连接 QGroundControl 并验证相机发现、MAVLink 相机命令和云台控制。云台控制需要此真实飞控 UART 连接，桌面模拟器测试不覆盖该功能。
