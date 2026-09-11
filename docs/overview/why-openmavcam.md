---
title: Why OpenMAVCam?
---

# Why OpenMAVCam?

OpenMAVCam combines production-proven camera-platform hardware with an open, MAVLink-native software stack. It is for teams that need dependable camera capability today and the freedom to adapt it for future missions.

<div className="row">
  <div className="col col--6">
    <figure>
      <img src="/img/products/d64tr/d64tr-on-uav.png" alt="A stabilized camera platform mounted on a multirotor UAV" />
      <figcaption>Example installation: an OpenMAVCam camera platform designed for deployment, not laboratory demos.</figcaption>
    </figure>

    ## Production-Proven Hardware

OpenMAVCam products are designed and validated as deployable camera platforms for autonomous systems. The platform combines imaging, stabilization, edge compute, and vehicle-ready connectivity in mature hardware packages. It is designed to support different sensor configurations, including future multi-spectral products; exact sensor and compute specifications belong to each product page.

    Hardware validation in real product integration reduces the risk of turning a software demo into a mission payload. Teams can start from a stable camera, gimbal, video, storage, and connectivity foundation instead of assembling those subsystems from scratch.
  </div>

  <div className="col col--6">
    <figure>
      <img src="/img/overview/qgroundcontrol-mountain-d64tr.png" alt="D64TR video and camera controls displayed in QGroundControl" />
      <figcaption>Validated camera controls and live video in QGroundControl.</figcaption>
    </figure>

    ## Validated Software

    The software stack integrates camera control, three-axis gimbal control, low-latency video, storage, AI functions, and MAVLink services as tested modules. Standard MAVLink camera and gimbal interfaces let it work with PX4, ArduPilot, and QGroundControl without custom autopilot firmware changes.

    Module demos and end-to-end payload validation are used to exercise capture, recording, streaming, settings, tracking, and status paths. This disciplined integration path reduces avoidable defects and makes failures easier to isolate when a product is customized.
  </div>
</div>

<div className="row">
  <div className="col col--6">
    <figure>
      <img src="/img/icons/open-source.svg" alt="Open source icon" style={{maxWidth: '112px', margin: '1rem auto'}} />
      <figcaption>Inspect, modify, build, and deploy the software stack yourself.</figcaption>
    </figure>

    ## Open Source, Under Your Control

    Everything in the OpenMAVCam software stack that is published by the project is available for inspection and modification on GitHub. You can follow the camera-to-MAVLink data path, adjust product behavior, add an integration, and build your own image rather than waiting for a closed vendor roadmap.

    The modular structure separates sensor services, rendering, storage, MAVLink exposure, gimbal control, and AI services. That gives a product team a practical boundary for custom work while preserving the components that already work together.
  </div>

  <div className="col col--6">
    <figure>
      <img src="/img/overview/ai-person-detection-qgc.png" alt="Person detection with a bounding box and confidence score in QGroundControl" />
      <figcaption>Run detection and tracking at the payload edge, including custom models.</figcaption>
    </figure>

    ## Open Edge Compute for Your Model

    OpenMAVCam supports edge-compute products and their supported runtime workflows to run vision workloads close to the camera. The stack includes reference object-detection and object-tracking integrations, so teams can validate the full route from inference output to the renderer and MAVLink control path.

    Bring a custom-trained ONNX model, convert it to the supported DLC format, deploy matching labels and post-processing, and validate it on target hardware. This supports mission-specific detection, tracking, and other visual functions without moving raw video to a cloud service.
  </div>
</div>

## A Practical Path from Product to Mission

Choose OpenMAVCam when you need a real camera platform and an integration surface you can own. Select the product that fits the mission, follow [Build and Deploy](../getting-started/build.md), validate the camera with [QGroundControl](../getting-started/qgroundcontrol.md), then extend the platform through [AI](../architecture/ai-tracking.md) and the documented module APIs.
