---
title: 什么是 OpenMAVCam？
---

OpenMAVCam 是一套面向自主平台的开源 MAVLink 原生相机软件栈。它通过开放接口把相机控制、三轴云台控制、实时视频和边缘 AI 功能整合在一起，开发者可以查阅、修改并部署整个软件栈。

它可直接连接基于 PX4 和 ArduPilot 的飞控，无需定制飞控固件。同一集成模型可用于无人机、无人车、机器狗和其他支持 MAVLink 的自主系统。

## OpenMAVCam 能做什么

- **相机和云台控制** — 通过 MAVLink 控制 3A 参数、拍照、录像、变焦、成像模式、元数据和稳定载荷。
- **边缘 AI 功能** — 在相机平台运行目标检测和跟踪，并将结果提供给任务系统。
- **飞控兼容性** — 通过标准 MAVLink 相机和云台接口集成 PX4 与 ArduPilot。
- **开放软件** — 在 GitHub 上自由使用、查阅、修改并参与 OpenMAVCam 软件栈。
- **面向自主平台** — 将同一相机软件模型用于无人机、地面车辆、机器狗及其他自主平台。

## 已适配 QGroundControl

OpenMAVCam 完全兼容 QGroundControl (QGC)。OpenMAVCam camera platform 可在地面站中显示实时视频和相机控制，而飞控仍使用标准 MAVLink 接口。

<figure>
  <img src="/img/overview/qgroundcontrol-aerial-video.png" alt="QGroundControl 显示山地河谷航拍实时视频和相机控制" />
  <figcaption>QGroundControl 可通过 MAVLink 显示 OpenMAVCam 航拍实时画面和相机控制。</figcaption>
</figure>

## 面向任务的 AI 功能

OpenMAVCam 在靠近视频源的载荷端运行 AI 功能。例如，**人员检测**可在 QGroundControl 中以边界框标出人员，并将置信度报告给操作员和任务系统。

可部署针对任务目标和环境自行训练的模型。OpenMAVCam 提供相机、视频和 MAVLink 集成层，使团队能够将自己的检测和跟踪模型带到自主平台上。

<figure>
  <img src="/img/overview/ai-person-detection-qgc.png" alt="QGroundControl 山地画面中以 96% 置信度标出的徒步人员" />
  <figcaption>AI 叠加示例：地面站画面中的人员被框选并显示置信度。</figcaption>
</figure>

## 可见光与热成像协同

像 D64TR 这样的双传感器产品可同时提供可见光 RGB 和热红外图像，帮助获得更清晰的任务视图。支持**左右并排**、画中画、叠加和混合显示，操作员可按任务选择合适的模式。

<figure>
  <img src="/img/overview/visible-thermal-side-by-side.png" alt="同一山地场景以可见光 RGB 和热红外视频并排显示" />
  <figcaption>D64TR 级双传感器载荷的可见光和热成像并排视频流。</figcaption>
</figure>
