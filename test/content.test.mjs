import assert from 'node:assert/strict';
import test from 'node:test';
import {access, readFile} from 'node:fs/promises';

test('Docusaurus is configured for the OpenMAVCam organization site', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  assert.match(config, /url:\s*'https:\/\/openmavcam\.github\.io'/);
  assert.match(config, /baseUrl:\s*'\/'/);
  assert.match(config, /organizationName:\s*'OpenMAVCam'/);
  assert.match(config, /projectName:\s*'OpenMAVCam\.github\.io'/);
  assert.match(config, /favicon:\s*'img\/open_cam\.png'/);
  assert.match(config, /src:\s*'img\/open_cam\.png'/);
});

test('the Docs navbar sidebar has the OpenMAVCam overview', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  assert.match(sidebar, /overview\/what-is-openmavcam/);
});

test('D64TR product page renders typed specifications', async () => {
  const page = await readFile('docs/products/d64tr.mdx', 'utf8');
  const home = await readFile('src/pages/index.tsx', 'utf8');
  assert.match(page, /title: D64TR/);
  assert.match(page, /ProductSpecs/);
  assert.match(page, /d64tr-on-uav\.png/);
  assert.match(home, /d64tr-on-uav\.png/);
});

test('D64TR product pages state the current supplier lifecycle position in both languages', async () => {
  const english = await readFile('docs/products/d64tr.mdx', 'utf8');
  const chinese = await readFile('i18n/zh-CN/docusaurus-plugin-content-docs/current/products/d64tr.mdx', 'utf8');

  assert.match(english, /is not currently labeled as Last Time Buy/);
  assert.match(chinese, /当前未标注为 Last Time Buy/);
});

test('homepage presents the light developer path', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const styles = await readFile('src/pages/index.module.css', 'utf8');
  for (const feature of ['Open Source', 'Camera', 'AI Function', 'Gimbal Control', 'Autopilot Compatibility', 'PX4', 'ArduPilot', 'FEATURED PRODUCT', 'D64TR']) assert.match(home, new RegExp(feature));
  assert.match(home, /From camera to mission in four steps\./);
  for (const step of ['Connect', 'Build', 'Deploy', 'Integrate']) assert.match(home, new RegExp(step));
  assert.match(styles, /d64tr-payload-hero\.png/);
  await access('static/img/home/d64tr-payload-hero.png');
});

test('homepage banner integrates a compact D64TR-equipped aircraft without a product card', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const styles = await readFile('src/pages/index.module.css', 'utf8');

  assert.doesNotMatch(home, /styles\.heroProduct/);
  assert.match(styles, /d64tr-payload-hero\.png/);
  await access('static/img/home/d64tr-payload-hero.png');
});

test('homepage prioritizes autopilot compatibility and explains camera and gimbal control', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const openSource = home.indexOf("'Open Source'");
  const hardware = home.indexOf("'Production Hardware'");
  const autopilot = home.indexOf("'Autopilot Compatibility'");
  const gimbal = home.indexOf("'Gimbal Control'");

  assert.ok(hardware > openSource, 'production hardware follows open source');
  assert.ok(autopilot > -1, 'autopilot compatibility capability is present');
  assert.ok(gimbal > autopilot, 'gimbal control follows autopilot compatibility');
  assert.match(home, /validated through extensive testing/);
  assert.match(home, /not a demo platform/);
  assert.match(home, /3A settings/);
  assert.match(home, /photos and video/);
  assert.match(home, /Three-axis stabilization/);
  assert.match(home, /±0\.02° precision/);
  assert.match(home, /OpenMAVCam software stack is open source and freely available on GitHub/);
  assert.match(home, /free to use, inspect, and easy to adapt/);
});

test('homepage feature cards include local capability icons', async () => {
  const home = await readFile('src/pages/index.tsx', 'utf8');
  assert.match(home, /styles\.featureIcon/);

  for (const icon of ['open-source', 'production-hardware', 'camera-control', 'ai-function', 'autopilot-compatibility', 'gimbal-control']) {
    await access(`static/img/icons/${icon}.svg`);
  }
});

test('homepage provides a dedicated dark palette for the hero and capability cards', async () => {
  const styles = await readFile('src/pages/index.module.css', 'utf8');

  for (const selector of [
    "[data-theme='dark'] .hero",
    "[data-theme='dark'] .hero h1",
    "[data-theme='dark'] .grid article",
    "[data-theme='dark'] .grid h3",
    "[data-theme='dark'] .sectionIntro h2",
  ]) assert.ok(styles.includes(selector), `dark palette includes ${selector}`);
});

test('D64TR build and deployment docs contain the supported image workflow', async () => {
  const build = await readFile('docs/products/d64tr/build.md', 'utf8');
  const deploy = await readFile('docs/products/d64tr/deploy.md', 'utf8');
  assert.match(build, /bitbake qti-ubuntu-robotics-image/);
  assert.match(build, /32 GB RAM/);
  assert.match(build, /200 GB/);
  assert.match(deploy, /qrb5165-rb5/);
  assert.match(deploy, /fastboot --slot all flash boot/);
  assert.match(deploy, /fastboot --slot all flash system/);
});

test('Camera architecture documents MAVSDK orchestration and local camera services', async () => {
  const camera = await readFile('docs/architecture/camera.md', 'utf8');

  await access('static/img/architecture/camera-call-flow.svg');
  for (const phrase of [
    'Camera Architecture',
    'MAVSDK',
    'CameraServer',
    'ParamServer',
    'TrackingServer',
    'MavClient',
    'CameraLocalClient',
    'MavCamera',
    'IRCamera',
    'TCP socket',
    'newline-delimited JSON',
    'AI bounding boxes',
    'RenderBridge',
    'Weston, DRM, or V4L2',
    'librender_bridge.so',
    'StorageManager',
    'libstorage_manager.so',
    'SD card',
    'camera-call-flow.svg',
  ]) assert.ok(camera.includes(phrase), `Camera page includes ${phrase}`);
});

test('Gimbal architecture documents v1 and v2 compatibility with angle and velocity control', async () => {
  const gimbal = await readFile('docs/architecture/gimbal.md', 'utf8');

  await access('static/img/architecture/gimbal-protocol-flow.svg');
  for (const phrase of [
    'Gimbal Protocol Compatibility',
    'Gimbal Protocol v1',
    'Gimbal Protocol v2',
    'MAV_CMD_DO_MOUNT_CONFIGURE',
    'MAV_CMD_DO_MOUNT_CONTROL',
    'MOUNT_ORIENTATION',
    'Gimbal Manager',
    'Gimbal Device',
    'GIMBAL_MANAGER_SET_ATTITUDE',
    'GIMBAL_MANAGER_SET_PITCHYAW',
    'GIMBAL_DEVICE_ATTITUDE_STATUS',
    'Angle Mode',
    'Velocity Mode',
    'Angle + Velocity',
    'Manual normalized control',
    'vehicle-follow',
    'earth-lock',
    'gimbal-protocol-flow.svg',
    'mavlink.io/en/services/gimbal_v2.html',
  ]) assert.ok(gimbal.includes(phrase), `Gimbal page includes ${phrase}`);
});

test('MAVLink Camera Protocol maps v2 semantics to the mav-cam CameraServer implementation', async () => {
  const protocol = await readFile('docs/protocol/mavlink-camera-protocol.md', 'utf8');

  await access('static/img/protocol/mavlink-camera-protocol-flow.svg');
  for (const phrase of [
    'Camera Protocol v2',
    'CAMERA_INFORMATION',
    'MAV_CMD_REQUEST_MESSAGE',
    'CameraServer',
    'CameraLocalClient',
    'set_information()',
    'VIDEO_STREAM_INFORMATION',
    'set_video_stream_info()',
    'rtsp://',
    'CAMERA_SETTINGS',
    'STORAGE_INFORMATION',
    'CAMERA_CAPTURE_STATUS',
    'COMMAND_ACK',
    'Camera Definition File',
    'ParamServer',
    'TrackingServer',
    'Video frames are not transported over MAVLink',
    'mavlink-camera-protocol-flow.svg',
    'mavlink.io/en/services/camera.html',
  ]) assert.ok(protocol.includes(phrase), `Camera protocol page includes ${phrase}`);
});

test('MAVLink architecture explains interoperability, control scope, and extension paths', async () => {
  const mavlink = await readFile('docs/architecture/mavlink.md', 'utf8');

  await access('static/img/architecture/mavlink-control-plane.svg');
  for (const phrase of [
    'What Is MAVLink?',
    'XML message definitions',
    'publish-subscribe',
    'point-to-point',
    'Why OpenMAVCam Uses MAVLink',
    'MAVLink-compatible autopilot',
    'common.xml',
    'MAVLink 2 extension fields',
    'custom dialect',
    'MAVLink is the control plane',
    'Video frames are not transported over MAVLink',
    'mavlink.io',
    'mavlink-control-plane.svg',
  ]) assert.ok(mavlink.includes(phrase), `MAVLink page includes ${phrase}`);
});

test('Video Streaming documents the composed single-stream pipeline for QGroundControl', async () => {
  const streaming = await readFile('docs/architecture/video-streaming.md', 'utf8');

  await access('static/img/architecture/video-streaming-pipeline.svg');
  for (const phrase of [
    'Single-Stream Video Architecture',
    'Weston composition',
    'RGB',
    'thermal',
    'OSD',
    'AI bounding boxes',
    'Side-by-side',
    'Picture-in-Picture',
    'Superimpose',
    'Mix',
    'one composed preview',
    'H.264 or H.265',
    'rtsp://',
    'MAVLink Camera Protocol',
    'QGroundControl',
    'one decoder',
    'does not need to synchronize',
    'low-latency',
    'fast integration',
    'video-streaming-pipeline.svg',
    '[Configuration](/docs/api-reference/configuration-interfaces)',
  ]) assert.ok(streaming.includes(phrase), `Video Streaming page includes ${phrase}`);
  assert.ok(!streaming.includes('/docs/getting-started/configuration-interfaces'));
});

test('Getting Started combines build and deploy while retaining the shared flash sequence', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  const guide = await readFile('docs/getting-started/build.md', 'utf8');
  const gettingStarted = sidebar.match(/label: 'Getting Started', items: \[([^\]]+)\]/)?.[1] ?? '';

  assert.ok(gettingStarted.includes('getting-started/build'));
  assert.ok(!gettingStarted.includes('getting-started/deploy'));
  assert.match(guide, /title: Build and Deploy/);
  assert.match(guide, /Build steps are product-specific/);
  assert.match(guide, /Build the D64TR Image/);

  for (const command of [
    'adb reboot bootloader',
    'fastboot devices',
    'fastboot --slot all flash boot',
    'fastboot --slot all flash system',
    'fastboot reboot',
  ]) assert.match(guide, new RegExp(command.replace(/[/.+]/g, '\\$&')));

  await assert.rejects(access('docs/getting-started/deploy.md'));
});

test('Minimum Demo is removed from the site navigation and active documentation', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  const home = await readFile('src/pages/index.tsx', 'utf8');
  const buildAndDeploy = await readFile('docs/getting-started/build.md', 'utf8');
  const d64tr = await readFile('docs/products/d64tr.mdx', 'utf8');
  const d64trDeploy = await readFile('docs/products/d64tr/deploy.md', 'utf8');
  const config = await readFile('docusaurus.config.ts', 'utf8');

  await assert.rejects(access('docs/getting-started/minimum-demo.md'));
  for (const content of [sidebar, home, buildAndDeploy, d64tr, d64trDeploy, config]) {
    assert.doesNotMatch(content, /minimum-demo/);
  }
  assert.match(home, /to="\/docs\/getting-started\/build"/);
  assert.match(buildAndDeploy, /getting-started\/autopilot/);
  assert.match(config, /to: '\/docs\/getting-started\/build'/);
});

test('Autopilot and QGroundControl guides separate real integration from camera-only simulation', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  const autopilot = await readFile('docs/getting-started/autopilot.md', 'utf8');
  const qgc = await readFile('docs/getting-started/qgroundcontrol.md', 'utf8');

  assert.match(sidebar, /getting-started\/autopilot/);
  assert.match(sidebar, /getting-started\/qgroundcontrol/);
  assert.doesNotMatch(sidebar, /px4-ardupilot-qgc/);
  await assert.rejects(access('docs/getting-started/px4-ardupilot-qgc.md'));
  await access('static/img/getting-started/autopilot-uart-wiring.svg');
  await access('static/img/getting-started/qgc-camera-log-output.png');

  assert.match(autopilot, /title: Autopilot/);
  assert.match(autopilot, /docs\.px4\.io/);
  assert.match(autopilot, /ardupilot\.org/);
  assert.match(autopilot, /Camera Gimbal TX/);
  assert.match(autopilot, /Flight Controller RX/);

  assert.match(qgc, /title: QGroundControl/);
  assert.match(qgc, /v5\.1\.0/);
  assert.match(qgc, /5\.1\.0_custom/);
  assert.match(qgc, /make px4_sitl gz_x500/);
  assert.match(qgc, /camera Ethernet/);
  assert.match(qgc, /does not validate gimbal control/);
  assert.match(qgc, /real autopilot/);
  assert.match(qgc, /Camera Log Output/);
  assert.match(qgc, /Camera\.VehicleCameraControl/);
  assert.match(qgc, /Camera\.VehicleCameraControl\.Verbose/);
  assert.match(qgc, /App Log Viewer/);
  assert.match(qgc, /qgc-camera-log-output\.png/);
});

test('Configuration is a Getting Started guide with rebooted preview settings', async () => {
  const sidebar = await readFile('sidebars.ts', 'utf8');
  const configuration = await readFile('docs/api-reference/configuration-interfaces.md', 'utf8');
  const gettingStarted = sidebar.match(/label: 'Getting Started', items: \[([^\]]+)\]/)?.[1] ?? '';
  const apiReference = sidebar.match(/label: 'API Reference', items: \[([^\]]+)\]/)?.[1] ?? '';

  assert.ok(gettingStarted.includes('api-reference/configuration-interfaces'));
  assert.ok(!apiReference.includes('api-reference/configuration-interfaces'));
  assert.match(configuration, /title: Configuration/);
  assert.match(configuration, /## Video Streaming/);
  assert.match(configuration, /video streaming preview/);
  assert.match(configuration, /H\.265.*UVC.*cannot display/s);

  for (const setting of [
    'persist.video.preview.mode "1920x1080@30"',
    'persist.video.preview.mode "1280x720@30"',
    'persist.video.preview.bitrate "10000000"',
    'persist.video.preview.encoder "h265"',
    'persist.video.preview.encoder "h264"',
  ]) {
    const block = ['adb shell', `setprop ${setting}`, 'sync', 'reboot'].join('\n');
    assert.ok(configuration.includes(block), `configuration contains reboot workflow for ${setting}`);
  }
});

test('OpenMAVCam overview explains QGroundControl and dual-sensor viewing', async () => {
  const overview = await readFile('docs/overview/what-is-openmavcam.md', 'utf8');

  for (const phrase of [
    'What OpenMAVCam Can Do',
    'MAVLink-native camera software stack',
    'PX4 and ArduPilot',
    'QGroundControl Ready',
    'Visible + Thermal, Together',
    'AI Functions for Your Mission',
    'person detection',
    'custom-trained models',
    'Side-by-side',
  ]) assert.ok(overview.includes(phrase), `overview includes ${phrase}`);

  for (const asset of ['qgroundcontrol-aerial-video.png', 'visible-thermal-side-by-side.png', 'ai-person-detection-qgc.png']) {
    await access(`static/img/overview/${asset}`);
  }

  assert.match(overview, /Side-by-side visible and thermal streams from a D64TR-class dual-sensor payload/);
});

test('Pages deployment publishes the build artifact with least privilege', async () => {
  const workflow = await readFile('.github/workflows/deploy-pages.yml', 'utf8');
  for (const value of ['actions/configure-pages@v5', 'actions/upload-pages-artifact@v4', 'path: build', 'actions/deploy-pages@v4', 'pages: write', 'id-token: write']) {
    assert.match(workflow, new RegExp(value.replace(/[/.+]/g, '\\$&')));
  }
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /enablement: true/);
});

test('test command uses Node built-in test discovery', async () => {
  const packageJson = await readFile('package.json', 'utf8');
  assert.match(packageJson, /"test": "node --test"/);
  assert.doesNotMatch(packageJson, /"test": "node --test test"/);
  assert.doesNotMatch(packageJson, /test\/\*\*\/\*\.test\.mjs/);
});
