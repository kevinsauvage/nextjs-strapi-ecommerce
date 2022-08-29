import Link from 'next/link';
import styles from './Crumbs.module.scss';

export default function Crumbs({ title, href, last }) {
  if (last) {
    return <p className={styles.crumbs}>{title}</p>;
  }
  return (
    <>
      <Link href={href}>
        <a className={styles.crumbs}>{title}</a>
      </Link>
      {!last && <p className={styles.arrow}>{'>'}</p>}
    </>
  );
}
