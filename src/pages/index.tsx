import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const capabilities = [
  ['Open Source', 'The OpenMAVCam software stack is open source and freely available on GitHub—free to use, inspect, and easy to adapt.', 'open-source'],
  ['Production Hardware', 'Purpose-built hardware validated through extensive testing for real autonomous missions—not a demo platform.', 'production-hardware'],
  ['Camera', 'Full-function camera control: 3A settings, capture, zoom, imaging modes, metadata, photos and video through MAVLink.', 'camera-control'],
  ['AI Function', 'Run object detection and tracking directly on the camera platform.', 'ai-function'],
  ['Autopilot Compatibility', 'Automatically adapts to PX4 and ArduPilot without autopilot firmware changes.', 'autopilot-compatibility'],
  ['Gimbal Control', 'Three-axis stabilization and payload pointing with ±0.02° precision through a documented control surface.', 'gimbal-control'],
];
const path = ['Connect', 'Build', 'Deploy', 'Integrate'];

export default function Home() {
  return <Layout title="Open MAVLink Camera Platform" description="OpenMAVCam documentation and products"><main>
    <section className={styles.hero}><div className={styles.heroContent}><p className={styles.kicker}>OPEN MAVLINK CAMERA PLATFORM</p><h1>Open vision for every autonomous mission.</h1><p>Connect camera, AI, video, and gimbal control through one open MAVLink platform.</p><p className={styles.compatibility}>Built for PX4 and ArduPilot — no autopilot firmware changes required.</p><div className={styles.actions}><Link className="button button--primary button--lg" to="/docs/getting-started/minimum-demo">Get started</Link><Link className="button button--secondary button--lg" to="/docs/products/d64tr">Explore D64TR</Link></div></div></section>
    <section className={styles.featureSection}><div className={styles.sectionIntro}><p className={styles.kicker}>WHY OPENMAVCAM</p><h2>Everything your payload needs, without a closed stack.</h2></div><div className={styles.grid}>{capabilities.map(([title, description, icon]) => <article key={title}><img className={styles.featureIcon} src={`/img/icons/${icon}.svg`} alt="" aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={styles.productSection}><div><p className={styles.kicker}>FEATURED PRODUCT</p><h2>D64TR dual-sensor EO/IR gimbal camera</h2><p>64 MP visible imaging, FLIR Boson+ thermal vision, 15 TOPS edge AI, and a MAVLink-native integration path.</p><Link className="button button--primary" to="/docs/products/d64tr">View D64TR specifications</Link><div className={styles.productLinks}><Link to="/docs/products/d64tr/build">Build image</Link><Link to="/docs/products/d64tr/deploy">Deploy image</Link></div></div><img src="/img/products/d64tr/d64tr-on-uav.png" alt="D64TR dual-sensor gimbal camera mounted below a multirotor UAV" /></section>
    <section className={styles.pathSection}><p className={styles.kicker}>DEVELOPER PATH</p><h2>From camera to mission in four steps.</h2><div className={styles.path}>{path.map((step, index) => <article key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{['Connect your payload.', 'Build the image and services.', 'Deploy to the target.', 'Integrate with your mission stack.'][index]}</p></article>)}</div></section>
  </main></Layout>;
}
