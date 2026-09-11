---
title: 为什么选择 OpenMAVCam？
---

# 为什么选择 OpenMAVCam？

OpenMAVCam 将经过实际产品验证的相机平台硬件与开放、MAVLink-native 的软件栈结合。它适合既需要今天可靠相机能力、又希望为未来任务自由定制的团队。

<div className="row">
  <div className="col col--6">
    <figure>
      <img src="/img/products/d64tr/d64tr-on-uav.png" alt="A stabilized camera platform mounted on a multirotor UAV" />
      <figcaption>安装示例：面向部署而不是 laboratory demo 的 OpenMAVCam camera platform。</figcaption>
    </figure>

    ## 经过产品验证的硬件

    OpenMAVCam 产品按可部署 autonomous system camera platform 设计和验证。平台在成熟硬件封装中结合 imaging、stabilization、edge compute 和 vehicle-ready connectivity。它可支持不同 sensor configuration，包括未来的 multi-spectral product；具体 sensor 和 compute specification 以各产品页面为准。

    真实产品集成中的硬件验证，降低了将 software demo 转为 mission payload 的风险。团队可从稳定的 camera、gimbal、video、storage 和 connectivity 基础开始，而不是从零组装这些 subsystem。
  </div>

  <div className="col col--6">
    <figure>
      <img src="/img/overview/qgroundcontrol-mountain-d64tr.png" alt="D64TR video and camera controls displayed in QGroundControl" />
      <figcaption>已在 QGroundControl 中验证的 camera control 和 live video。</figcaption>
    </figure>

    ## 已验证的软件

    软件栈将 camera control、three-axis gimbal control、low-latency video、storage、AI function 和 MAVLink service 作为已测试模块集成。标准 MAVLink camera 和 gimbal interface 使其可与 PX4、ArduPilot 和 QGroundControl 协同，无需修改 autopilot firmware。

    通过 module demo 和 end-to-end payload validation 覆盖 capture、recording、streaming、setting、tracking 和 status path。这种有纪律的集成路径可以减少可避免 defect，并在产品定制时更容易隔离 failure。
  </div>
</div>

<div className="row">
  <div className="col col--6">
    <figure>
      <img src="/img/icons/open-source.svg" alt="Open source icon" style={{maxWidth: '112px', margin: '1rem auto'}} />
      <figcaption>自行 inspect、modify、build 和 deploy software stack。</figcaption>
    </figure>

    ## 可控的开源软件

    项目公开发布的 OpenMAVCam software stack 均可在 GitHub 上 inspect 和 modify。你可以追踪 camera-to-MAVLink data path、调整产品行为、增加 integration，并构建自己的 image，而不是等待 closed vendor roadmap。

    模块化结构将 sensor service、rendering、storage、MAVLink exposure、gimbal control 和 AI service 分离。这为 product team 提供了实际的 custom work boundary，同时保留已可协同工作的组件。
  </div>

  <div className="col col--6">
    <figure>
      <img src="/img/overview/ai-person-detection-qgc.png" alt="Person detection with a bounding box and confidence score in QGroundControl" />
      <figcaption>在 payload edge 运行 detection 和 tracking，也支持 custom model。</figcaption>
    </figure>

    ## 面向自有模型的开放边缘算力

    OpenMAVCam 支持采用 edge compute 的产品及其支持的 runtime workflow，在相机附近运行 vision workload。软件栈包含 reference object-detection 和 object-tracking integration，因此团队可验证从 inference output 到 renderer 和 MAVLink control path 的完整链路。

    导入 custom-trained ONNX model，将其转换为支持的 DLC format，部署匹配的 label 和 post-processing，并在 target hardware 验证。无需将 raw video 传到 cloud service，即可支持 mission-specific detection、tracking 和其他 visual function。
  </div>
</div>

## 从产品到任务的实际路径

当你既需要真实 camera platform、又需要可以自主掌控的 integration surface 时，选择 OpenMAVCam。选择适合任务的产品，遵循 [Build and Deploy](../getting-started/build.md)，使用 [QGroundControl](../getting-started/qgroundcontrol.md) 验证相机，再通过 [AI](../architecture/ai-tracking.md) 和 module API 文档扩展平台。
