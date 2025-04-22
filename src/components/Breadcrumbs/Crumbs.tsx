import Link from 'next/link';

import { arrowRight2 } from '@/assets/svg';

import styles from './Crumbs.module.scss';

const Crumbs = ({
  title,
  href,
  last,
  isNotClickable,
}: {
  title: string;
  href: string;
  last: boolean;
  isNotClickable?: boolean;
}) => {
  if (isNotClickable) return;
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
        {!last && <p className={styles.arrow}>{arrowRight2}</p>}
      </>
    );
  }
  return (
    <>
      <Link href={href} className={styles.crumbs}>
        {decodeURIComponent(title)}
      </Link>
      {!last && <p className={styles.arrow}>{arrowRight2}</p>}
    </>
  );
};

export default Crumbs;
