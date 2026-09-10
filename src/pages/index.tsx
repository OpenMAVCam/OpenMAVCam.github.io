import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const capabilities = ['Camera Control', 'Video Streaming', 'Gimbal Control', 'Object Detection', 'Object Tracking', 'ROS 2'];

export default function Home() {
  return <Layout title="Open MAVLink Camera Platform" description="OpenMAVCam documentation and products"><main>
    <section className={styles.hero}><div><p className={styles.kicker}>OPEN MAVLINK CAMERA PLATFORM</p><h1>Camera intelligence for autonomous systems.</h1><p>Build, deploy, and integrate MAVLink-native cameras, gimbals, video, and edge AI.</p><div className={styles.actions}><Link className="button button--primary button--lg" to="/docs/getting-started/minimum-demo">Run the minimum demo</Link><Link className="button button--secondary button--lg" to="/docs/products/d64tr">Explore D64TR</Link></div></div></section>
    <section className={styles.section}><h2>One platform, open integration</h2><div className={styles.grid}>{capabilities.map((item) => <article key={item}><h3>{item}</h3><p>Open interfaces and focused documentation for your autonomous platform.</p></article>)}</div></section>
  </main></Layout>;
}
