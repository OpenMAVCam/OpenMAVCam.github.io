# OpenMAVCam 官方网站设计

**日期：** 2026-09-10  
**状态：** 已确认，待实施

## 目标与受众

建立一个面向开发者的英文官方网站，帮助用户快速理解并开始使用基于 MAVLink 的 OpenMAVCam 开源自动驾驶相机平台。首个重点上手场景是目标检测；目标跟踪与 AI 模型部署是同等可见、但后续展开的能力入口。

网站托管在 GitHub Pages，由 GitHub Actions 自动构建和发布。GitHub 组织为 `OpenMAVCam`，组织主页仓库为 `OpenMAVCam/OpenMAVCam.github.io`，公开地址为 `https://openmavcam.github.io/`。

## 技术架构

- 使用 Docusaurus Classic 和 TypeScript。
- 使用定制的英文首页展示平台价值、核心能力和开发者入口；文档、产品资料和发布说明由 Markdown/MDX 驱动。
- Docusaurus 配置使用 `url: https://openmavcam.github.io` 与 `baseUrl: /`，以适配组织主页仓库。
- 顶部导航提供 Docs、Products、GitHub 和 Releases；首页的主要行动入口为 Minimum Demo 与 D64TR。
- `blog/` 保存按日期编排的 Release / Changelog 条目。

## 产品模型

`Products` 是一级内容区域。产品叙述使用 Markdown；可复用规格存放在类型安全的数据文件中，例如 `src/data/products/d64tr.ts`。产品页面读取该数据并渲染分组规格表。

每个产品必须提供：名称、状态、首页摘要、计算平台、物理信息和规格分组。新增产品只需增加一份规格数据和相应的 Markdown 页面，不改变全站导航或组件实现。

### D64TR

D64TR 是第一款产品：一款双光、三轴云台相机，并提供边缘 AI 计算能力。

| 分组 | 已确认规格 |
| --- | --- |
| 尺寸与重量 | 101 × 110 × 90.64 mm；262 g；铝制机身；12 V |
| RGB | 64 MP（1/2 英寸）；67° HFOV；F2.3；64 MP 9248×6944 / 16 MP 4624×3472；4K 60/30 fps 或 FHD 60/30 fps；JPEG/DNG |
| 热成像 | FLIR Boson+ 640×512；32° HFOV；F1.0；640×512 @ 60 fps；RJPEG |
| 视频与显示 | MP4（H.264/H.265）；H.264 1920×1080@30 fps 直播；1080p HDMI 输出；并排、画中画、叠加、融合热成像显示；白热、黑热、彩虹、RainHC、Ironbow、Lava、Arctic、Glowbow、Graded Fire、Hottest 调色板 |
| 云台 | 三轴稳定，±0.02°；Pan/Yaw ±90°；Tilt -90° 至 +10°；Roll ±45°；六级风阻（最高 14 m/s） |
| 接口 | CAN、UART、SBUS、PPM、千兆以太网、USB 3.0、HDMI |
| 存储与环境 | ExFAT；64 GB 或更大 V30 / 100 MB/s SD 卡；-10°C 至 50°C；FCC、IP44 |
| 计算平台 | NDAA-compliant 设计；Qualcomm Dragonwing QRB5165；Lantronix Open-Q 5165RB SOM；8 GB LPDDR5（2750 MHz）+ 128 GB UFS |
| 计算能力 | Kryo 585 八核 CPU（最高 2.84 GHz）、Hexagon 698 DSP、Adreno 650 GPU、Spectra 480 ISP；15 TOPS AI Engine |

产品页链接至 [Lantronix Open-Q 5165RB SOM 官方规格](https://www.lantronix.com/products/open-q-5165rb-som/)，并避免声明长期供货承诺：官方产品页目前标示其为 Last Time Buy。

## 视觉资产

- D64TR 产品页和首页产品入口使用已确认的本地素材 `/home/goerlab/Pictures/Screenshots/Screenshot from 2026-09-10 09-55-17.png`：该图展示安装于飞行器下方的 D64TR 云台相机。
- 实施时将该渲染图复制到 `static/img/products/d64tr/`，使用描述性文件名并提供准确的英文 alt text；不在页面运行时依赖 Aerora 网站的外链图片。
- 图片将生成适用于响应式页面的压缩版本，首页只加载其需要的尺寸，避免影响首次访问速度。
- Aerora Drone Solutions 页面中的其他图片不作为第一版 D64TR 页面的必需素材；如后续采用，须先由维护者确认产品归属。

## 文档信息架构

- **Overview**：What is OpenMAVCam、Why OpenMAVCam、Supported Platforms
- **Products**：D64TR Overview、Specifications、Interfaces、Compute Platform、Setup
- **Architecture**：Camera、MAVLink、Video Streaming、Gimbal、AI / Tracking、ROS 2
- **Getting Started**：Build、Deploy、Minimum Demo、PX4 / ArduPilot / QGroundControl integration
- **Protocol**：MAVLink Camera Protocol、Camera Information、Capture、Zoom、Tracking、Status
- **Hardware Integration**：UAV、UGV、Robot Dog、Other Autonomous Platforms
- **API Reference**：C/C++、MAVLink Messages、Configuration Interfaces
- **Developer Guide**：Repository Structure、Coding Style、Contribution、License
- **Release / Changelog**：以 Docusaurus Blog 的日期条目发布

“View source” 链接面向计划迁移的 `OpenMAVCam/object-detection` 与 `OpenMAVCam/object-tracking` 仓库。

## 内容与发布流程

```text
Markdown / MDX + 产品规格数据
        ↓  Pull Request 合并到 main
GitHub Actions：安装 → 构建 → 上传 Pages Artifact
        ↓
GitHub Pages：https://openmavcam.github.io/
```

- GitHub 是所有内容的唯一真源；通过 Pull Request 编辑 Markdown、MDX、产品数据与发布说明。
- PR 运行生产级构建，验证链接、front matter、MDX 和渲染；合并到 `main` 后发布。
- 部署使用 GitHub 官方 Pages Actions 与最小权限：`pages: write`、`id-token: write`。
- 使用 Node 依赖缓存、固定版本 Action 和工作流并发控制，避免旧部署覆盖新部署。
- GitHub Pages 设置为从 Actions 发布，而不是从分支发布。
- 构建失败不发布；最近一次成功的站点继续在线，维护者通过 Actions 日志排查。

## 维护和质量保证

- `npm run build` 是本地和 CI 的统一验证命令。
- 文档须避免断链、无效 front matter 和 MDX 渲染错误。
- 产品数据接受 TypeScript 类型检查，并在构建期间验证必填字段。
- 提供贡献指南：Markdown 规范、侧栏排序、本地预览、PR 要求、编码风格、许可证和 Release Note 规则。

## 错误处理

- 内容或类型错误在 CI 构建阶段失败，阻止 Pages 部署。
- 内部链接错误在 Docusaurus 构建阶段失败，阻止错误文档上线。
- 部署并发由 workflow concurrency 控制；取消过期排队任务。
- 生产构建或部署失败时，保留最近成功版本，不发布半成品。

## 验证策略

实施后至少验证：

1. 依赖安装和 `npm run build` 成功。
2. 首页、D64TR 页面、主要文档分类和 Release 页面均出现在静态构建输出中。
3. 所有侧栏目标、内部链接和 GitHub 链接可解析。
4. GitHub Actions 的 PR 构建与 `main` 部署工作流语法正确，并针对根站点 URL 配置。
