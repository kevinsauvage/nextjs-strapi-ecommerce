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
    <div className={styles.container}>
      <header className={`${styles.header}`}>
        <Container>
          <div className={styles.headerInner}>
            <Logo />
            <Navbar headerMenu={headerMenu} handleOver={handleOver} />
            <UserButtons />
          </div>
        </Container>
      </header>
    </div>
  );
}

export default Header;
