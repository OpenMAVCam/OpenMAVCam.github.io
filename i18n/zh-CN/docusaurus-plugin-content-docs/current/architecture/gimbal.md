---
title: 云台
---

OpenMAVCam 通过 MAVLink 提供稳定的三轴载荷指向。它同时支持传统 mount 命令集和当前的 Gimbal Manager / Gimbal Device 架构，使一体化相机云台既能配合既有飞控与地面站部署，也能在可用时采用现代控制模型。

## 云台协议兼容性

<figure>
  <img src="/img/architecture/gimbal-protocol-flow.svg" alt="OpenMAVCam 云台协议流程：QGroundControl 和飞控使用 MAVLink Gimbal Protocol v1 与 v2，经 Gimbal Manager 控制 Gimbal Device，并向地面站返回姿态状态" />
  <figcaption>Gimbal Protocol v2 是推荐的 manager/device 路径；保留传统 v1 mount 路径以兼容已部署系统。</figcaption>
</figure>

OpenMAVCam 支持两代 MAVLink 云台微服务协议，这指的是云台微服务版本，而不是 MAVLink 数据包帧格式版本。

| 协议 | 作用 | 主要命令和状态 |
| --- | --- | --- |
| **Gimbal Protocol v1** | 面向既有飞控、地面站和云台集成的传统 mount 兼容性 | `MAV_CMD_DO_MOUNT_CONFIGURE`、`MAV_CMD_DO_MOUNT_CONTROL`、`MOUNT_ORIENTATION` |
| **Gimbal Protocol v2** | 推荐的 manager/device 模型，用于发现、能力报告、控制所有权、设定点和姿态状态 | `GIMBAL_MANAGER_INFORMATION`、`GIMBAL_MANAGER_SET_ATTITUDE`、`GIMBAL_MANAGER_SET_PITCHYAW`、`GIMBAL_DEVICE_ATTITUDE_STATUS` |

本地云台服务在解析状态时保留 v1 `MOUNT_ORIENTATION` 和 v2 `GIMBAL_DEVICE_ATTITUDE_STATUS` 路径，也保留传统 `MAV_CMD_DO_MOUNT_CONFIGURE` 配置流程。

## 为什么采用 Gimbal Protocol v2

[Gimbal Protocol v2](https://mavlink.io/en/services/gimbal_v2.html) 将 **Gimbal Manager** 与 **Gimbal Device** 分离：

- **Gimbal Device** 是物理稳定硬件及其底层软件。
- **Gimbal Manager** 是 MAVLink 控制权威，负责发现设备、报告能力、协调竞争控制器并发送设备设定点。

在常见飞行器连接中，飞控充当 Gimbal Manager。QGroundControl、任务或伴随应用向 manager 请求控制，再由 manager 向 Gimbal Device 发送命令，避免地面站、任务和 AI 同时直接争抢硬件。manager 通过 `GIMBAL_MANAGER_INFORMATION` 和 `GIMBAL_MANAGER_STATUS` 报告能力与所有权；device 广播 `GIMBAL_DEVICE_ATTITUDE_STATUS`，供飞控和地面站观察当前姿态。

> **兼容性说明：** [Gimbal Protocol v1](https://mavlink.io/en/services/gimbal.html) 已被 v2 替代，但仍广泛部署。OpenMAVCam 保留 v1 mount 命令以兼容既有系统；新平台优先采用 v2。

## 控制模式

| 模式 | 设定点 | 典型用途 |
| --- | --- | --- |
| **Angle Mode** | 目标 roll、pitch 和/或 yaw 姿态 | 将载荷指向稳定、可重复的视线或任务目标 |
| **Velocity Mode** | roll、pitch 和/或 yaw 角速度 | 由摇杆或跟踪控制器持续 pan、tilt、yaw |
| **Angle + Velocity** | 目标角度及角速度限制 | 以受控转速抵达请求姿态 |
| **Manual normalized control** | 通常为 `-1` 到 `1` 的归一化手动输入 | 让 Gimbal Manager 按配置映射摇杆命令到合适角度或速率 |

### Angle Mode

Angle Mode 命令期望姿态。v2 中可用 `GIMBAL_MANAGER_SET_ATTITUDE` 设置四元数目标，或用 `GIMBAL_MANAGER_SET_PITCHYAW` 设置俯仰/偏航目标。未控制的轴可保持未设置，因此支持只控制俯仰等部分轴命令。它适合测绘拍摄、固定检查视图或持续更新姿态目标的跟踪控制器。

### Velocity Mode

Velocity Mode 命令角速度而不是最终位置。例如仅 yaw-rate 命令会持续平移，直到新的设定点停止或改变它。活动控制器应以合适的控制频率发送速率设定点。它适合操作员平移/俯仰和流畅自动跟踪修正；v2 中可在 `GIMBAL_MANAGER_SET_PITCHYAW` 或 `GIMBAL_MANAGER_SET_ATTITUDE` 中提供角速度。

### Angle + Velocity

Angle + Velocity 将目标和速度结合：目标角度定义云台停止位置，速率指定移动速度，适用于既要求可重复指向又要避免突兀运动的任务。

### 参考系：vehicle-follow 与 earth-lock

yaw 命令可采用 **vehicle-follow** 参考系（随机体偏航）或 **earth-lock** 参考系（相对地球/北向保持）。所选 v2 gimbal-manager flags 定义意图参考系，云台在姿态状态中报告参考系。常规观察用 vehicle-follow；平台改变航向但载荷需保持地理方向时用 earth-lock。

## 控制所有权和安全交接

发送高频或关键 v2 设定点前，控制组件应通过 `MAV_CMD_DO_GIMBAL_MANAGER_CONFIGURE` 获取所有权，并在结束时释放。manager 可区分主/次控制器，避免地面站、任务、伴随计算机和 AI 跟踪逻辑发生冲突。v1 集成则按飞控或载荷的传统 mount 行为配置；仅在连接系统需要时使用 v1，新集成应使用 v2 manager/device 消息。

## 集成路径

1. 按[飞控](/docs/getting-started/autopilot)说明将相机云台 MAVLink 串口接至飞控。
2. 让飞控和 QGroundControl 发现载荷。
3. 平台支持时选择 v2 Gimbal Manager 路径；仅为传统集成使用 v1 Mount 兼容。
4. 目标指向使用 Angle Mode，连续运动使用 Velocity Mode，活动结束时释放控制权。

协议细节请参阅[官方 Gimbal Protocol v2 指南](https://mavlink.io/en/services/gimbal_v2.html)和[传统 Gimbal Protocol v1 指南](https://mavlink.io/en/services/gimbal.html)。
