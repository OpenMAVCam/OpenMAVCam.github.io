import type {Product} from './types';

export const d64tr: Product = {
  slug: 'd64tr', name: 'D64TR',
  summary: 'A dual-sensor EO/IR gimbal camera with on-device edge AI for MAVLink-enabled autonomous platforms.',
  heroImage: {src: '/img/products/d64tr/d64tr-on-uav.png', alt: 'D64TR dual-sensor gimbal camera mounted below a multirotor UAV'},
  specificationGroups: [
    {title: 'Imaging', rows: [
      {label: 'RGB camera', value: '64 MP (1/2-inch sensor), 67° HFOV, F2.3'},
      {label: 'Thermal camera', value: 'FLIR Boson+ 640 × 512, 32° HFOV, F1.0'},
      {label: 'Photo', value: '64 MP 9248 × 6944 or 16 MP 4624 × 3472 RGB; JPEG/DNG; RJPEG thermal'},
      {label: 'Digital zoom', value: '924 × 694 crop in 64 MP mode; 462 × 247 crop in 16 MP mode'},
      {label: 'Recording', value: '4K 60/30 fps or FHD 60/30 fps RGB; 640 × 512 @ 60 fps thermal; MP4 H.264/H.265'},
    ]},
    {title: 'Video and Thermal Display', rows: [
      {label: 'Streaming', value: 'H.264 1920 × 1080 @ 30 fps'}, {label: 'Output', value: '1080p HDMI output'},
      {label: 'Thermal display', value: 'Side-by-side, picture-in-picture, superimpose, and mix'},
      {label: 'IR palettes', value: 'White hot, Black hot, Rainbow, RainHC, Ironbow, Lava, Arctic, Glowbow, Graded Fire, Hottest'},
    ]},
    {title: 'Compute Platform', rows: [
      {label: 'SoC', value: 'Qualcomm Dragonwing QRB5165'}, {label: 'SoM', value: 'Lantronix Open-Q 5165RB SOM'},
      {label: 'Memory and storage', value: '8 GB LPDDR5 and 128 GB UFS'}, {label: 'AI engine', value: '15 TOPS'},
    ]},
    {title: 'Gimbal System', rows: [{label: 'Stabilization', value: '3-axis, ±0.02° precision'}, {label: 'Motion', value: 'Pan/Yaw ±90°, Tilt −90° to +10°, Roll ±45°'}, {label: 'Wind resistance', value: 'Level 6 (maximum 14 m/s)'}]},
    {title: 'Connectivity', rows: [{label: 'Interfaces', value: 'Gigabit Ethernet, CAN, UART, SBUS, PPM, USB 3.0, HDMI'}]},
    {title: 'Physical, Storage, and Environment', rows: [{label: 'Dimensions and weight', value: '101 × 110 × 90.64 mm; 262 g'}, {label: 'Power', value: '12 V'}, {label: 'Storage', value: 'ExFAT SD card, 64 GB+ V30 / 100 MB/s'}, {label: 'Environment', value: '−10°C to 50°C; FCC; IP44'}]},
  ],
};
