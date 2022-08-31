import styles from './Modal.module.scss';

export default function Modal({ children, handleClose }) {
  return (
    <div className={styles.modal}>
      <button
        className={styles.close}
        type="button"
        onClick={handleClose && handleClose}
      >
        close
      </button>
      
      <div className={styles.content}>{children}</div>
    </div>
  );
}
