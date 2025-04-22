import Link from 'next/link';

import { logo } from '@/assets/svg';

import styles from './Logo.module.scss';

const Logo = () => (
  <Link href="/" className={styles.logo} aria-label="Link to home page">
    {logo}
  </Link>
);

export default Logo;
