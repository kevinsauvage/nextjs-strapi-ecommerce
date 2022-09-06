import { GrClose } from 'react-icons/gr';
import styles from './Modal.module.scss';

export default function Modal({ children, handleClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles.body}>
        <button
          tabIndex="0"
          className={styles.close}
          type="button"
          onClick={handleClose && handleClose}
        >
          <GrClose />
        </button>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
