import Link from 'next/link';
import styles from './Crumbs.module.scss';

export default function Crumbs({ title, href, last, isNotClickable }) {
  if (last) {
    return <p className={styles.crumbs}>{title}</p>;
  }

  if (isNotClickable) {
    return (
      <>
        <a className={styles.crumbs}>{title}</a>
        {!last && <p className={styles.arrow}>{'>'}</p>}
      </>
    );
  }
  return (
    <>
      <Link href={href} className={styles.crumbs}>
        {title}
      </Link>
      {!last && <p className={styles.arrow}>{'>'}</p>}
    </>
  );
}
