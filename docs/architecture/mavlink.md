---
title: MAVLink
---

MAVLink is the control contract between the payload, autopilot, and ground-control station. OpenMAVCam uses it to make a camera and gimbal behave as a first-class component of an autonomous system rather than as a vendor-specific peripheral.

## What Is MAVLink?

MAVLink is a lightweight binary messaging protocol for vehicles and onboard components. It works over transports such as UART and UDP over Ethernet, while the protocol itself identifies senders and targets using system and component IDs.

Messages are described in **XML message definitions**. Code generators turn those definitions into type-safe libraries for C/C++, Python, and other languages, so a camera, autopilot, and ground station can agree on the same message layout and command semantics.

MAVLink combines two communication patterns:

- **publish-subscribe** streams for recurring telemetry such as attitude, position, camera status, and tracking results;
- **point-to-point** exchanges for addressed commands, parameters, and configuration that require an acknowledgement or retransmission behavior.

MAVLink 2 adds a larger message-ID space, optional signing, and a protocol format designed for forward-compatible features. See the [official MAVLink protocol overview](https://mavlink.io/en/about/overview.html) for framing, integrity checks, and protocol-version details.

## OpenMAVCam MAVLink Topology

<figure>
  <img src="/img/architecture/mavlink-control-plane.svg" alt="OpenMAVCam camera and gimbal exchanging MAVLink control and telemetry with an autopilot and QGroundControl, while video uses a direct network stream" />
  <figcaption>MAVLink coordinates discovery, commands, and status; the video stream uses its own direct transport.</figcaption>
</figure>

OpenMAVCam presents camera capabilities, capture commands, zoom and imaging control, gimbal control, AI tracking results, and status telemetry through MAVLink. A MAVLink-compatible autopilot can route the payload connection, while a MAVLink-compatible ground station can discover and control the component using the same control contract.

## MAVLink Is the Control Plane

MAVLink is the control plane: it carries discovery, metadata, commands, acknowledgements, status, and stream information. **Video frames are not transported over MAVLink**. OpenMAVCam sends live H.264/H.265 video through the configured direct video transport, such as Ethernet, while MAVLink provides the control and status interface around that stream.

This separation keeps command and telemetry traffic efficient while allowing the video path to use the bandwidth and latency characteristics appropriate to the mission.

## Why OpenMAVCam Uses MAVLink

### Adapt to MAVLink ecosystems

MAVLink lets OpenMAVCam integrate with any MAVLink-compatible autopilot, ground-control station, companion computer, or autonomous platform. The payload can be added through standard interfaces instead of requiring a fork or firmware change in every supported flight controller.

### Prefer standards before vendor-specific behavior

OpenMAVCam uses the standard message definitions in **common.xml** wherever a suitable camera, gimbal, command, parameter, or status interface already exists. This is the path most likely to interoperate with existing flight stacks and ground stations. The [MAVLink standard definitions](https://mavlink.io/en/messages/) describe the shared `minimal.xml`, `standard.xml`, and `common.xml` sets.

### Keep extension freedom

Standard messages cover the common control surface, but missions often need additional functions. OpenMAVCam can use **MAVLink 2 extension fields** where the receiving implementation understands the extended message, or a versioned **custom dialect** for genuinely vendor- or mission-specific messages.

A custom dialect should include `common.xml`, use uniquely assigned message IDs, be versioned with the software that consumes it, and be introduced only when the standard definitions cannot express the required behavior. This preserves interoperability for the baseline while leaving room for AI, workflow, and platform-specific extensions. The [MAVLink dialect guidance](https://mavlink.io/en/messages/dialects.html) describes this standard-plus-extension model.

## Developer Path

1. Implement and test standard camera, gimbal, command, and status messages first.
2. Validate behavior with the target MAVLink-compatible autopilot and ground station.
3. Add MAVLink 2 extension fields or a custom dialect only for capabilities that cannot be represented by the standard messages.
4. Document the extension, its version, and the peer implementations required to use it.

For message-level detail, continue to the [MAVLink Camera Protocol](/docs/protocol/mavlink-camera-protocol) and [MAVLink Messages](/docs/api-reference/mavlink-messages) pages.
