import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from '@/components/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import styles from './Header.module.scss';

function Header() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = scrollPosition > 60;

  return (
    <header className={`${styles.header} ${isActive ? styles.active : ''}`}>
      <Container>
        <div className={styles.inner}>
          <div>logo</div>
          <Link href="/">
            <a className={styles.logo}>
              <p>NAMEE</p>
            </a>
          </Link>
          <UserButtons isActive={isActive} />
        </div>
      </Container>
    </header>
  );
}

export default Header;
