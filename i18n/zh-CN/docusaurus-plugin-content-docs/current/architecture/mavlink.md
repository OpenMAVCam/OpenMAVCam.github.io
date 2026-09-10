---
title: MAVLink
---

MAVLink 是载荷、飞控和地面站之间的控制契约。OpenMAVCam 使用它使相机和云台成为自主系统的一等组件，而不是厂商专有外设。

## 什么是 MAVLink？

MAVLink 是用于飞行器和机载组件的轻量二进制消息协议，可运行在 UART 或以太网 UDP 等传输上；协议使用系统 ID 和组件 ID 标识发送方和目标。

消息由 **XML message definitions** 描述，代码生成器将定义转换为 C/C++、Python 等语言的类型安全库，使相机、飞控和地面站能约定相同的消息布局与命令语义。MAVLink 同时支持用于姿态、位置、相机状态和跟踪结果的 **publish-subscribe** 周期流，以及用于定向命令、参数和配置的 **point-to-point** 交互。MAVLink 2 增加更大的消息 ID 空间、可选签名和面向前向兼容功能的格式；参见[官方概览](https://mavlink.io/en/about/overview.html)。

## OpenMAVCam MAVLink 拓扑

<figure>
  <img src="/img/architecture/mavlink-control-plane.svg" alt="OpenMAVCam 相机和云台通过 MAVLink 与飞控和 QGroundControl 交换控制和遥测，视频使用直连网络流" />
  <figcaption>MAVLink 协调发现、命令和状态；视频流使用独立的直接传输。</figcaption>
</figure>

OpenMAVCam 通过 MAVLink 提供相机能力、拍摄命令、变焦和成像控制、云台控制、AI 跟踪结果和状态遥测。兼容 MAVLink 的飞控可路由载荷连接，兼容 MAVLink 的地面站可按同一控制契约发现和控制组件。

## MAVLink 是控制平面

MAVLink 传递发现、元数据、命令、确认、状态和流信息。**视频帧不通过 MAVLink 传输**；OpenMAVCam 使用以太网等已配置的直接视频传输发送 H.264/H.265 实时视频，而 MAVLink 为其提供控制和状态接口。这种分离保持命令/遥测高效，并让视频路径使用适合任务的带宽和时延特性。

## 为什么使用 MAVLink

### 适配 MAVLink 生态

MAVLink 让 OpenMAVCam 可接入任意兼容 MAVLink 的飞控、地面站、伴随计算机或自主平台；载荷通过标准接口加入，不需要为每个飞控分支或修改固件。

### 标准优先

只要标准中已有合适接口，OpenMAVCam 就使用 **common.xml** 中的相机、云台、命令、参数和状态定义。这最有利于与现有飞控栈和地面站互操作；[MAVLink 标准定义](https://mavlink.io/en/messages/)说明了 `minimal.xml`、`standard.xml` 和 `common.xml`。

### 保持扩展自由

标准消息覆盖通用控制面，但任务也可能需要额外能力。OpenMAVCam 可使用接收端理解的 **MAVLink 2 extension fields**，或用于真正厂商/任务特定消息的版本化 **custom dialect**。自定义 dialect 应包含 `common.xml`、使用唯一消息 ID、与消费它的软件一起版本化，并仅在标准定义无法表达所需行为时引入。参见 [dialect guidance](https://mavlink.io/en/messages/dialects.html)。

## 开发路径

1. 先实现并测试标准相机、云台、命令和状态消息。
2. 与目标 MAVLink 兼容飞控和地面站验证行为。
3. 仅为标准消息无法表示的能力添加 MAVLink 2 扩展字段或 custom dialect。
4. 记录扩展、版本及所需对端实现。

消息级细节请继续阅读 [MAVLink 相机协议](/docs/protocol/mavlink-camera-protocol)和 [MAVLink 消息](/docs/api-reference/mavlink-messages)。
