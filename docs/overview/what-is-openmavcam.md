---
title: What is OpenMAVCam?
---
OpenMAVCam is an open-source, MAVLink-native camera software stack for autonomous platforms. It brings camera control, three-axis gimbal control, live video, and edge AI functions together through open interfaces that developers can inspect, adapt, and deploy.

It is designed to connect directly with PX4 and ArduPilot based autopilots without custom autopilot firmware changes. The same integration model can be used on UAVs, UGVs, robot dogs, and other MAVLink-enabled autonomous systems.

## What OpenMAVCam Can Do

- **Camera and gimbal control** — Control 3A settings, capture, recording, zoom, imaging modes, metadata, and a stabilized payload through MAVLink.
- **AI functions at the edge** — Run object detection and tracking on the camera platform, where the result is available to the mission stack.
- **Autopilot compatibility** — Integrate with PX4 and ArduPilot through standard MAVLink camera and gimbal interfaces.
- **Open software** — Use, inspect, modify, and contribute to the OpenMAVCam software stack on GitHub.
- **Autonomous-platform ready** — Apply the same camera software model to drones, ground vehicles, robot dogs, and other autonomous platforms.

## QGroundControl Ready

OpenMAVCam is fully compatible with QGroundControl (QGC). A D64TR payload can present its live video and camera controls in the ground station while the autopilot remains on its standard MAVLink interface.

<figure>
  <img src="/img/overview/qgroundcontrol-mountain-d64tr.png" alt="QGroundControl showing a D64TR live mountain video view and payload controls" />
  <figcaption>QGroundControl can present a D64TR live view and camera controls through MAVLink.</figcaption>
</figure>

## AI Functions for Your Mission

OpenMAVCam runs AI functions on the payload, close to the video source. For example, **person detection** can mark a person with a bounding box in QGroundControl and report the confidence score to the operator and mission stack.

Deploy **custom-trained models** for the objects and conditions that matter to your mission. OpenMAVCam provides the camera, video, and MAVLink integration layer so teams can bring their own detection and tracking models to an autonomous platform.

<figure>
  <img src="/img/overview/ai-person-detection-qgc.png" alt="QGroundControl mountain view with a real hiker boxed as a person detection at 96 percent confidence" />
  <figcaption>Example AI overlay: a person in the ground-station view is boxed with its confidence score.</figcaption>
</figure>

## Visible + Thermal, Together

Dual-sensor products such as D64TR make visible RGB and thermal IR imagery available together for a clearer mission picture. Supported display modes include **Side-by-side**, picture-by-picture, superimpose, and mix, so an operator can select the view that suits the task.

<figure>
  <img src="/img/overview/visible-thermal-side-by-side.png" alt="The same mountain scene shown side-by-side as visible RGB and thermal infrared video" />
  <figcaption>Side-by-side visible and thermal streams from a D64TR-class dual-sensor payload.</figcaption>
</figure>
