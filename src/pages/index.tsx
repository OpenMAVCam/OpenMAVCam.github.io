import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const capabilities = [
  ['Camera + Gimbal', 'Control, stabilize, capture, and expose payload capabilities through MAVLink.'],
  ['Live Video', 'Deliver video streams to ground-control stations and application consumers.'],
  ['Edge AI', 'Run object detection and tracking directly on the camera platform.'],
];
const path = ['Connect', 'Build', 'Deploy', 'Integrate'];

export default function Home() {
  return <Layout title="Open MAVLink Camera Platform" description="OpenMAVCam documentation and products"><main>
    <section className={styles.hero}><div><p className={styles.kicker}>OPEN MAVLINK CAMERA PLATFORM</p><h1>Vision payloads, open by design.</h1><p>Build MAVLink-native cameras, streaming, gimbal control, and edge AI for autonomous platforms.</p><div className={styles.actions}><Link className="button button--primary button--lg" to="/docs/getting-started/minimum-demo">Get started</Link><Link className="button button--secondary button--lg" to="/docs/products/d64tr">Explore D64TR</Link></div></div><div className={styles.grid}>{capabilities.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={styles.pathSection}><p className={styles.kicker}>DEVELOPER PATH</p><h2>From camera to mission in four steps.</h2><div className={styles.path}>{path.map((step, index) => <article key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{['Connect your payload.', 'Build the image and services.', 'Deploy to the target.', 'Integrate with your mission stack.'][index]}</p></article>)}</div></section>
  </main></Layout>;
}
