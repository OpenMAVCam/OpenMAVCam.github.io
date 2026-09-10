---
title: Gimbal
---

OpenMAVCam provides stabilized three-axis payload pointing through MAVLink. It supports both the legacy mount command set and the current Gimbal Manager / Gimbal Device architecture, so an integrated camera-gimbal can work with existing autopilot and ground-station deployments while using the modern control model where it is available.

## Gimbal Protocol Compatibility

<figure>
  <img src="/img/architecture/gimbal-protocol-flow.svg" alt="OpenMAVCam gimbal protocol flow showing MAVLink Gimbal Protocol v1 and v2 commands from QGroundControl and an autopilot through a Gimbal Manager to a Gimbal Device, with attitude status returned to the ground station" />
  <figcaption>Gimbal Protocol v2 is the preferred manager/device path; the legacy v1 mount path remains available for deployed integrations.</figcaption>
</figure>

OpenMAVCam supports two MAVLink gimbal protocol generations. This refers to the gimbal microservice versions, not the MAVLink packet framing versions.

| Protocol | Role | Primary commands and status |
| --- | --- | --- |
| **Gimbal Protocol v1** | Legacy mount compatibility for existing autopilots, ground stations, and gimbal integrations | `MAV_CMD_DO_MOUNT_CONFIGURE`, `MAV_CMD_DO_MOUNT_CONTROL`, and `MOUNT_ORIENTATION` |
| **Gimbal Protocol v2** | Recommended manager/device model for discovery, capability reporting, control ownership, setpoints, and attitude status | `GIMBAL_MANAGER_INFORMATION`, `GIMBAL_MANAGER_SET_ATTITUDE`, `GIMBAL_MANAGER_SET_PITCHYAW`, `GIMBAL_DEVICE_ATTITUDE_STATUS` |

The local gimbal service retains the v1 `MOUNT_ORIENTATION` path and the v2 `GIMBAL_DEVICE_ATTITUDE_STATUS` path when decoding gimbal status. It also keeps the legacy `MAV_CMD_DO_MOUNT_CONFIGURE` configuration flow for systems that use the mount interface.

## Why Gimbal Protocol v2

[Gimbal Protocol v2](https://mavlink.io/en/services/gimbal_v2.html) separates a **Gimbal Manager** from a **Gimbal Device**:

- The **Gimbal Device** is the physical stabilized hardware and its low-level software.
- The **Gimbal Manager** is the MAVLink control authority that discovers the device, reports its capabilities, coordinates competing controllers, and sends device setpoints.

For the common aircraft connection, the autopilot acts as the Gimbal Manager. QGroundControl, a mission, or a companion application requests control from that manager; the manager then sends the corresponding command to the Gimbal Device. This keeps ground-station, mission, and AI control from issuing competing direct commands to the same hardware.

The manager reports capability and ownership information with `GIMBAL_MANAGER_INFORMATION` and `GIMBAL_MANAGER_STATUS`. The device broadcasts `GIMBAL_DEVICE_ATTITUDE_STATUS`, allowing the autopilot and ground station to observe the current attitude.

> **Compatibility note:** [Gimbal Protocol v1](https://mavlink.io/en/services/gimbal.html) is superseded by v2, but it remains widely deployed. OpenMAVCam keeps the v1 mount commands for compatibility and uses v2 as the preferred integration path for new platforms.

## Control Modes

OpenMAVCam supports the following gimbal-control semantics. The selected mode determines whether the setpoint is a destination, a motion rate, or both.

| Mode | Setpoint | Typical use |
| --- | --- | --- |
| **Angle Mode** | Target roll, pitch, and/or yaw attitude | Point the payload at a stable, repeatable view direction or mission target |
| **Velocity Mode** | Angular rate for roll, pitch, and/or yaw | Continuous pan, tilt, and yaw movement from a joystick or tracking controller |
| **Angle + Velocity** | Target angle with an angular-rate limit | Reach a requested attitude at a controlled slew rate |
| **Manual normalized control** | Normalized manual input, normally `-1` to `1` | Let the Gimbal Manager map a joystick command to suitable angles or rates based on its configuration |

### Angle Mode

Angle Mode commands a desired attitude. In v2, use `GIMBAL_MANAGER_SET_ATTITUDE` for a quaternion target or `GIMBAL_MANAGER_SET_PITCHYAW` for pitch/yaw targets. An axis not being controlled can be left unset, allowing partial-axis commands such as pitch-only pointing.

This mode is suited to survey capture, a fixed inspection view, or a tracking controller that continuously updates an attitude target.

### Velocity Mode

Velocity Mode commands an angular rate rather than a final position. A yaw-rate-only command, for example, produces continuous panning until a new setpoint stops or changes it. Rate setpoints should be sent at an appropriate control cadence by the active controller.

This mode is suited to operator panning and tilting, as well as smooth automated tracking corrections. In v2, angular rate can be supplied in `GIMBAL_MANAGER_SET_PITCHYAW` or `GIMBAL_MANAGER_SET_ATTITUDE`.

### Angle + Velocity

Angle + Velocity combines a destination with a requested speed. The target angle defines where the gimbal should stop; the rate specifies how fast it should move there. This is useful where a mission needs repeatable pointing without abrupt motion.

### Reference Frames: vehicle-follow and earth-lock

Yaw commands may be interpreted in a **vehicle-follow** frame, where yaw follows the airframe, or an **earth-lock** frame, where yaw is held relative to the earth/North reference. The selected v2 gimbal-manager flags define the intended frame; the gimbal reports the reference for its attitude status. Use vehicle-follow for normal piloted observation and earth-lock when the payload must keep looking at a geographic direction while the vehicle changes heading.

## Control Ownership and Safe Handover

Before issuing high-rate or mission-critical v2 setpoints, the controlling component should obtain ownership with `MAV_CMD_DO_GIMBAL_MANAGER_CONFIGURE` and release it when finished. The manager can distinguish primary and secondary controllers, helping avoid conflicts between a ground station, mission execution, companion computer, and AI tracking logic.

For v1 integrations, the autopilot or payload should be configured according to its legacy mount behavior. Use the v1 path only when required by the connected system; new integrations should use the v2 manager/device messages.

## Integration Path

1. Connect camera-gimbal MAVLink serial to the flight controller as described in [Autopilot](/docs/getting-started/autopilot).
2. Allow the autopilot and QGroundControl to discover the payload.
3. Select the v2 Gimbal Manager path when the connected platform supports it; use v1 Mount compatibility only for legacy integrations.
4. Choose Angle Mode for target pointing or Velocity Mode for continuous motion, and release control when the activity ends.

For protocol-level details, see the [official Gimbal Protocol v2 guide](https://mavlink.io/en/services/gimbal_v2.html) and the [legacy Gimbal Protocol v1 guide](https://mavlink.io/en/services/gimbal.html).
