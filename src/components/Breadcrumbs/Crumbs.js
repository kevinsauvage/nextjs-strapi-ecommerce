import Link from 'next/link';
import styles from './Crumbs.module.scss';

export default function Crumbs({ title, href, last, isNotClickable }) {
  if (last) {
    const t = decodeURIComponent(title)
      .replace('gid://shopify/Order/', '')
      .replace('gid://shopify/MailingAddress/', '')
      .split('?')[0];
    return <p className={styles.crumbs}> {t}</p>;
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
        {decodeURIComponent(title)}
      </Link>
      {!last && <p className={styles.arrow}>{'>'}</p>}
    </>
  );
}
