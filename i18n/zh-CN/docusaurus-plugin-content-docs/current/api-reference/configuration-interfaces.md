---
title: 配置
---

OpenMAVCam 配置涵盖相机和平台运行时设置。本节说明可用的视频流预览参数：分辨率、码率和编码器。每项设置会跨重启保留，但只有重启后才生效。

## 视频流

每次只运行**一个**配置块。每个块都先进入 `adb shell`，写入一个设置，使用 `sync` 刷盘，然后重启设备。

### 预览分辨率

#### 1080p @ 30 fps

```sh
adb shell
setprop persist.video.preview.mode "1920x1080@30"
sync
reboot
```

#### 720p @ 30 fps

```sh
adb shell
setprop persist.video.preview.mode "1280x720@30"
sync
reboot
```

### 预览码率

将预览流码率设为 10 Mbps：

```sh
adb shell
setprop persist.video.preview.bitrate "10000000"
sync
reboot
```

### 预览流编码器

#### H.265

> **UVC 限制：** 配置 H.265 时，UVC 视频流无法显示预览。需要 UVC 预览输出时请使用 H.264。

```sh
adb shell
setprop persist.video.preview.encoder "h265"
sync
reboot
```

#### H.264

```sh
adb shell
setprop persist.video.preview.encoder "h264"
sync
reboot
```
