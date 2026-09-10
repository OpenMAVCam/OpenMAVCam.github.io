---
title: Configuration
---
OpenMAVCam configuration covers camera and platform runtime settings. This section documents the available video streaming preview parameters: resolution, bitrate, and encoder. Each setting persists across restarts, but it takes effect only after a reboot.

## Video Streaming

Run **one** configuration block at a time. Every block starts by entering `adb shell`, writes one setting, flushes it with `sync`, and reboots the device.

### Preview Resolution

#### 1080p at 30 fps

```sh
adb shell
setprop persist.video.preview.mode "1920x1080@30"
sync
reboot
```

#### 720p at 30 fps

```sh
adb shell
setprop persist.video.preview.mode "1280x720@30"
sync
reboot
```

### Preview Bitrate

Set the preview-stream bitrate to 10 Mbps:

```sh
adb shell
setprop persist.video.preview.bitrate "10000000"
sync
reboot
```

### Preview Streaming Encoder

#### H.265

> **UVC limitation:** When H.265 is configured, UVC video streaming cannot display the preview. Use H.264 when UVC preview output is required.

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
