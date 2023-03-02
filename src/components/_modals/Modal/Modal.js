import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import { remove } from '@/assets/svg';
import styles from './Modal.module.scss';

export default function Modal({ handleClose, loading, children }) {
  return (
    <div className={styles.Modal}>
      {loading ? (
        <AbsoluteLoader />
      ) : (
        <div className={styles.Container}>
          <div className={styles.header}>
            <button className={styles.close} type="button" onClick={() => handleClose()}>
              {remove}
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
