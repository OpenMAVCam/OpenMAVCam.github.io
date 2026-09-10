import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {type: 'category', label: 'Overview', items: ['overview/what-is-openmavcam', 'overview/why-openmavcam', 'overview/supported-platforms']},
    {type: 'category', label: 'Products', items: ['products/d64tr']},
    {type: 'category', label: 'Architecture', items: ['architecture/camera', 'architecture/mavlink', 'architecture/video-streaming', 'architecture/gimbal', 'architecture/ai-tracking', 'architecture/ros2']},
    {type: 'category', label: 'Getting Started', items: ['getting-started/build', 'getting-started/deploy', 'getting-started/minimum-demo', 'getting-started/px4-ardupilot-qgc']},
    {type: 'category', label: 'Protocol', items: ['protocol/mavlink-camera-protocol', 'protocol/camera-information', 'protocol/capture', 'protocol/zoom', 'protocol/tracking', 'protocol/status']},
    {type: 'category', label: 'Hardware Integration', items: ['hardware-integration/platforms']},
    {type: 'category', label: 'API Reference', items: ['api-reference/cpp', 'api-reference/mavlink-messages', 'api-reference/configuration-interfaces']},
    {type: 'category', label: 'Developer Guide', items: ['developer-guide/repository-structure', 'developer-guide/coding-style', 'developer-guide/contribution', 'developer-guide/license']},
  ],
};

export default sidebars;
