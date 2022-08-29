import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './Header.module.scss';
import UserButtons from '../UserButtons/UserButtons';
import Wrapper from '../Wrapper/Wrapper';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Navbar from '../Navbar/Navbar';
import Container from '../Container/Container';
import blackLogo from '../../assets/images/BlackLogo.svg';
import whiteLogo from '../../assets/images/WhiteLogo.svg';

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
