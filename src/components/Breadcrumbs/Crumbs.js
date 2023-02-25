import Link from 'next/link';
import { arrowRight } from '@/assets/svg';
import styles from './Crumbs.module.scss';

export default function Crumbs({ title, href, last, isNotClickable }) {
  if (isNotClickable) return null;
  if (last) {
    const t = decodeURIComponent(title)
      .replace('gid://shopify/Order/', '')
      .replace('gid://shopify/MailingAddress/', '')
      .split('?')[0];
    return <strong className={`${styles.crumbs} ${styles.last}`}> {t}</strong>;
  }

  if (isNotClickable) {
    return (
      <>
        <a className={styles.crumbs}>{title}</a>
        {!last && <p className={styles.arrow}>{arrowRight}</p>}
      </>
    );
  }
  return (
    <>
      <Link href={href} className={styles.crumbs}>
        {decodeURIComponent(title)}
      </Link>
      {!last && <p className={styles.arrow}>{arrowRight}</p>}
    </>
  );
}
