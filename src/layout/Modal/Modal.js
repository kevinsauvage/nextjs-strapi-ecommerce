import { GrClose } from 'react-icons/gr';
import styles from './Modal.module.scss';

export default function Modal({ children, handleClose }) {
  return (
    <div
      tabIndex="0"
      className={styles.modal}
      onClick={handleClose}
      role="button"
      onKeyPress={(e) => e.key === 'Enter' && handleClose(e)}
    >
      <div
        className={styles.content}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation()}
      >
        <button
          tabIndex="0"
          className={styles.close}
          type="button"
          onClick={handleClose && handleClose}
        >
          <GrClose />
        </button>
        {children}
      </div>
    </div>
  );
}
