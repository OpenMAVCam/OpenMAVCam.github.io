---
title: QGroundControl
---

OpenMAVCam 使用**官方 QGroundControl v5.1.0**验证地面站流程，同时提供自行编译的 **`5.1.0_custom`** 版本以完善 OpenMAVCam 专用 QGC 功能。官方应用请使用[官方 QGroundControl v5.1 下载和安装指南](https://docs.qgroundcontrol.com/Stable_V5.1/en/qgc-user-guide/getting_started/download_and_install.html)；需要增强功能时使用 `5.1.0_custom`。

## 仅相机桌面验证

当电脑只连接相机时，可用此方式方便验证相机功能。PX4 SITL 向 QGroundControl 提供模拟 MAVLink 飞控；它不替代真实飞控集成测试。

1. 在 PX4-Autopilot 源码树中启动模拟器：

   ```bash
   make px4_sitl gz_x500
   ```

2. 将相机以太网口直连电脑，等待相机网络可用。
3. 启动 QGroundControl，等待它连接 PX4 SITL 飞行器。
4. 在 QGroundControl 中验证相机发现、实时视频、拍照、录像和 AI 状态。

## 相机日志输出

复现相机功能前启用相机日志分类，可在 QGroundControl 中确认相机信息、参数交互和命令处理。

1. 打开 **Application Settings** → **App Logging** → **App Log Viewer**。
2. 选择 **Categories**，搜索 `Camera.VehicleCameraControl`。
3. 同时启用 **`Camera.VehicleCameraControl`** 与 **`Camera.VehicleCameraControl.Verbose`**。
4. 重复相机测试，再用 **App Log Viewer** 查看输出，或选择 **Save** 留存日志。

<figure>
  <img src="/img/getting-started/qgc-camera-log-output.png" alt="QGroundControl App Log Viewer Categories 对话框中启用 Camera VehicleCameraControl 及 verbose 相机日志" />
  <figcaption>验证期间启用标准和 verbose 相机分类以采集功能日志。</figcaption>
</figure>

> **范围限制：** 仅相机模拟器测试不验证云台控制。云台必须按[飞控](/docs/getting-started/autopilot)说明通过 UART 接至真实飞控。

## 真实飞控验证

完整载荷验证时，将相机云台 UART 接至真实飞控，并用 QGroundControl 验证 MAVLink 相机命令和云台控制。
