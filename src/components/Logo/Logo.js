import Link from 'next/link';
import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <Link href="/" className={styles.Logo}>
      <p>NAME STORE</p>
    </Link>
  );
}
