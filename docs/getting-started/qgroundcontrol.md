---
title: QGroundControl
---

OpenMAVCam validates its ground-station workflow with **official QGroundControl v5.1.0**. We also provide a self-built **`5.1.0_custom`** variant for OpenMAVCam-specific QGC function improvements.

Use the [official QGroundControl v5.1 download and installation guide](https://docs.qgroundcontrol.com/Stable_V5.1/en/qgc-user-guide/getting_started/download_and_install.html) for the official application. Use `5.1.0_custom` when the OpenMAVCam-specific enhancements are required.

## Camera-Only Desktop Validation

This test is a convenient way to validate camera functions when the computer is connected only to the camera. PX4 SITL supplies a simulated MAVLink autopilot to QGroundControl; it is not a real-autopilot integration test.

1. In the PX4-Autopilot source tree, start the simulator:

   ```bash
   make px4_sitl gz_x500
   ```

2. Connect the camera Ethernet port directly to the computer and wait for the camera network connection to become available.
3. Start QGroundControl and allow it to connect to the PX4 SITL vehicle.
4. Verify camera discovery, live video, photo capture, video recording, and AI status in QGroundControl.

## Camera Log Output

Enable the camera logging categories before reproducing a camera function. The resulting log output makes it possible to confirm camera information, parameter exchange, and command handling in QGroundControl.

1. Open **Application Settings** → **App Logging** → **App Log Viewer**.
2. Select **Categories** and search for `Camera.VehicleCameraControl`.
3. Enable both **`Camera.VehicleCameraControl`** and **`Camera.VehicleCameraControl.Verbose`**.
4. Repeat the camera test, then use **App Log Viewer** to inspect the output or select **Save** to retain it for analysis.

<figure>
  <img src="/img/getting-started/qgc-camera-log-output.png" alt="QGroundControl App Log Viewer Categories dialog with Camera VehicleCameraControl and verbose camera logging enabled" />
  <figcaption>Enable the standard and verbose camera categories to capture camera-function logs during validation.</figcaption>
</figure>

> **Scope limitation:** This camera-only simulator test does not validate gimbal control. Gimbal control requires the camera gimbal UART to be connected to a real autopilot, as described in [Autopilot](/docs/getting-started/autopilot).

## Real-Autopilot Validation

For a complete payload validation, connect the camera gimbal UART to the real autopilot and use QGroundControl to verify MAVLink camera commands and gimbal control.
