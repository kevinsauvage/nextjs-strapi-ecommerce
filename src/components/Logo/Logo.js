import Link from 'next/link';

import { logo } from '@/assets/svg';

import styles from './Logo.module.scss';

const Logo = () => {
  return (
    <Link href="/" className={styles.Logo} aria-label="Link to home page">
      {logo}
    </Link>
  );
};

export default Logo;
