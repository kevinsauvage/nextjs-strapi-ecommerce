import { useEffect, useState } from 'react';

import styles from './SlideIn.module.scss';

function SlideIn({ children, title, width = 300, animationDuration = 0.3 }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [showMenu]);

  return (
    <div className={styles.slideIn}>
      <button
        className={styles.button}
        aria-label={showMenu ? 'Close menu' : 'Open menu'}
        aria-expanded={showMenu ? 'true' : 'false'}
        type="button"
        onClick={toggleMenu}
      >
        {title}
      </button>
      <div
        className={`${styles.children} ${showMenu ? styles.showChildren : ''}`}
        style={{
          width: `${width}px`,
          transition: `right ${animationDuration}s ease-in-out`,
        }}
      >
        {children}
      </div>
      {showMenu && <div className={styles.backdrop} onClick={toggleMenu} aria-hidden="true" />}
    </div>
  );
}

export default SlideIn;
