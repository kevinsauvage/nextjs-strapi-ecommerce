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
      <div
        role="presentation"
        className={styles.outer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={styles.inner}>
          <header className={styles.header}>
            <h5 className={styles.title}>{title}</h5>
          </header>
          <div className={styles.children}>{children}</div>
        </div>
        <button type="button" className={styles.close} onClick={handleClose}>
          <MdClose />
        </button>
      </div>
    </div>
  ) : null;
}
