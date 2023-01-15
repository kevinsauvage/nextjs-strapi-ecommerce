import Container from '@/components/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Header.module.scss';
import BigMenu from '../BigMenu/BigMenu';

function Header({ headerMenu }) {
  const headerContainerRef = useRef(null);
  const [activeItems, setActiveItems] = useState([]);

  const handleOver = (items) => {
    setActiveItems(items);
  };

  const handleClose = () => setActiveItems([]);

  const { asPath } = useRouter() || {};

  useEffect(() => {
    handleClose();
  }, [asPath]);

  return (
    <div className={styles.container} ref={headerContainerRef}>
      <header className={`${styles.header}`}>
        <Container>
          <div className={styles.headerInner}>
            <Logo />
            <Navbar headerMenu={headerMenu} handleOver={handleOver} />
            <UserButtons />
          </div>
        </Container>
      </header>
      {activeItems?.length > 0 && (
        <BigMenu data={activeItems} handleClose={handleClose} />
      )}
    </div>
  );
}

export default Header;
