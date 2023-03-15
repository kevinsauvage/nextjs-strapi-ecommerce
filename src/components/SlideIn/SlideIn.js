import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { close } from '@/assets/svg';

import styles from './SlideIn.module.scss';

const SlideIn = ({ children, title, animationPosition = 'right', headerTitle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { asPath } = useRouter();

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    setShowMenu(false);
  }, [asPath]);

  useEffect(() => {
    document.body.style.overflow = showMenu ? 'hidden' : 'visible';
  }, [showMenu]);

  const slideInStyles = { [animationPosition]: showMenu ? '0' : '-100%' };

  return (
    <div className={styles['slide-in']}>
      <button
        className={styles.button}
        aria-label={showMenu ? 'Close menu' : 'Open menu'}
        aria-expanded={showMenu ? 'true' : 'false'}
        type="button"
        onClick={toggleMenu}
      >
        {title}
      </button>
      <div className={styles.children} style={slideInStyles}>
        {headerTitle && (
          <header className={styles.header}>
            {headerTitle}
            <button type="button" onClick={() => setShowMenu(false)} className={styles.icon}>
              {close}
            </button>
          </header>
        )}
        {children}
      </div>
      {showMenu && <div className={styles.backdrop} onClick={toggleMenu} aria-hidden="true" />}
    </div>
  );
};

export default SlideIn;
