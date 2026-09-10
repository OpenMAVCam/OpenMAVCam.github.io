import type {SpecificationGroup} from '@site/src/data/products/types';
import styles from './index.module.css';

export default function ProductSpecs({groups}: {groups: SpecificationGroup[]}) {
  return <div className={styles.groups}>{groups.map((group) => <section key={group.title}><h2>{group.title}</h2><div className={styles.scroll}><table><tbody>{group.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table></div></section>)}</div>;
}
