import { MdClose } from 'react-icons/md';
import styles from './Slide.module.scss';

export default function Slide({ children, isOpen, handleClose, title }) {
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
        <div style={{ position: 'relative', padding: '20px 30px' }}>
          <header className={styles.header}>
            <h5 className={styles.title}>{title}</h5>
            <button
              type="button"
              className={styles.close}
              onClick={handleClose}
            >
              <MdClose />
            </button>
          </header>
          <div className={styles.inner}>
            <div className={styles.children}>{children}</div>
          </div>
        </div>
      </aside>
    </div>
  ) : null;
}
