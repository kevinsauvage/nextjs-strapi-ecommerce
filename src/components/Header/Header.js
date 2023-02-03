import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.scss';

function Header({ headerMenu, handleClose, handleOver }) {
  const { asPath } = useRouter();

  useEffect(() => {
    handleClose();
  }, [asPath, handleClose]);

  return (
    <Container>
      <header className={`${styles.header}`}>
        <div className={styles.left}>
          <Logo />
          <Navbar headerMenu={headerMenu} handleOver={handleOver} />
        </div>
        <UserButtons />
      </header>
    </Container>
  );
}

export default Header;
