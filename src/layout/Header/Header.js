import Container from '@/layout/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import { useEffect, useRef, useState } from 'react';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import { useRouter } from 'next/router';
import styles from './Header.module.scss';

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
        <Logo />
        <Navbar headerMenu={headerMenu} handleOver={handleOver} />
        <UserButtons />
      </header>
      {activeItems?.length ? (
        <div
          role="button"
          tabIndex="0"
          className={styles.bigMenu}
          onClick={() => handleClose()}
          onMouseOver={() => handleClose()}
          onFocus={() => handleClose()}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        >
          <div
            className={styles.inner}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseOver={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Container>
              <div className={styles.content}>
                <div className={styles.grid}>
                  {activeItems.map((item) => (
                    <div key={item.id}>
                      <ActiveLink
                        url={item?.url}
                        activeClass={styles.active}
                        className={styles.item}
                      >
                        <p>{item?.title}</p>
                      </ActiveLink>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Header;
