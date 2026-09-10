---
title: Autopilot
---

OpenMAVCam integrates with real PX4 and ArduPilot flight controllers through MAVLink. Use this page for the physical flight-controller connection and the official firmware resources needed for your board.

## Firmware Build and Configuration

Firmware targets, flashing methods, serial-port parameters, and vehicle configuration differ by flight-controller board and vehicle. Follow the official documentation for the selected autopilot instead of applying a generic command sequence:

- [PX4: Building PX4 Software](https://docs.px4.io/main/en/dev_setup/building_px4)
- [PX4: Loading Firmware](https://docs.px4.io/v1.13/en/config/firmware)
- [ArduPilot: Set up the Build Environment](https://ardupilot.org/dev/docs/building-setup-linux.html)
- [ArduPilot: Load Firmware to a Compatible Board](https://ardupilot.org/copter/docs/common-loading-firmware-onto-pixhawk.html)

## Camera Gimbal UART Connection

Connect the camera gimbal UART to an available telemetry/UART port on the real flight controller. Cross the signal pair and share ground:

<img src="/img/getting-started/autopilot-uart-wiring.svg" alt="Camera gimbal UART connected to a flight controller telemetry UART: TX crosses to RX, RX crosses to TX, and ground connects to ground" />

- **Camera Gimbal TX** → **Flight Controller RX**
- **Camera Gimbal RX** → **Flight Controller TX**
- **Camera Gimbal GND** → **Flight Controller GND**

Confirm the selected UART, baud rate, voltage levels, and power requirements against the camera-gimbal and flight-controller documentation. Do not connect a power pin through this signal harness unless both product specifications explicitly require it.

## Validate on a Real Autopilot

After firmware and UART configuration are complete, connect QGroundControl and verify camera discovery, MAVLink camera commands, and gimbal control. Gimbal control requires this real autopilot UART connection; it is not covered by the desktop simulator test.
