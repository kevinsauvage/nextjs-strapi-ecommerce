import { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './Slide.module.scss';

export default function Slide({ isOpen, handleClose, title, footer, content }) {
  const footerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState();
  const headerHeight = 50;

  useEffect(() => {
    if (footerRef?.current) {
      const rect = footerRef?.current?.getBoundingClientRect();
      setContentHeight(window.innerHeight - rect.height - headerHeight);
    }
  }, []);

  return isOpen ? (
    <div
      role="button"
      tabIndex="0"
      className={styles.slide}
      onClick={handleClose}
      onKeyDown={(event) => event.key === 'Escape' && handleClose}
    >
      <aside
        role="presentation"
        className={styles.outer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <button type="button" className={styles.close} onClick={handleClose}>
            <MdClose />
          </button>
        </header>
        <div
          className={styles.content}
          style={{
            maxHeight: `${contentHeight}px`,
          }}
        >
          {content}
        </div>
        {footer && (
          <footer ref={footerRef} className={styles.footer}>
            {footer}
          </footer>
        )}
      </aside>
    </div>
  ) : null;
}
