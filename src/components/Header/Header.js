import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import Container from '@/components/Container/Container';
import blackLogo from '@/assets/images/BlackLogo.svg';
import whiteLogo from '@/assets/images/WhiteLogo.svg';
import UserButtons from '@/components/UserButtons/UserButtons';
import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './Header.module.scss';

function Header() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { asPath } = useRouter();

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

  const bgColor = asPath === '/' ? styles.bgHome : styles.bgPages;

  return (
    <header
      className={`${styles.header} ${isActive ? styles.active : ''} ${bgColor}`}
    >
      <Container>
        <Link href="/">
          <a className={styles.logo}>
            <Image
              src={isActive ? blackLogo : whiteLogo}
              layout="fill"
              width={200}
              height={33}
            />
          </a>
        </Link>
        <Navbar active={isActive} />
        <Wrapper gap="0rem">
          <UserButtons isActive={isActive} />
        </Wrapper>
      </Container>
    </header>
  );
}

export default Header;
