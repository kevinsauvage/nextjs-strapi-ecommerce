import { GrClose } from 'react-icons/gr';
import styles from './Modal.module.scss';

export default function Modal({ children, handleClose }) {
  return (
    <div
      tabIndex="0"
      className={styles.modal}
      onClick={handleClose}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && handleClose(e)}
    >
      <div className={styles.header}>
        <button
          tabIndex="0"
          className={styles.close}
          type="button"
          onClick={handleClose && handleClose}
        >
          <GrClose />
        </button>
      </div>
      <div className={styles.inner}>
        <div
          className={styles.content}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
