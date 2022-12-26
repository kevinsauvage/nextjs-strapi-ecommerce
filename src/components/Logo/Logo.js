import Link from 'next/link';
import Image from 'next/image';
import logoWhite from '../../../public/logo.svg';
import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <Link href="/" className={styles.Logo}>
      <Image {...logoWhite} alt="logo" />
    </Link>
  );
}
