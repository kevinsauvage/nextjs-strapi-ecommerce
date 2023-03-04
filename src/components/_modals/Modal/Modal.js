import { remove } from '@/assets/svg';
import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import useHideScrollbar from '@/hooks/useHideScrollbar';

import styles from './Modal.module.scss';

export default function Modal({ handleClose, loading, children, padding = '0px' }) {
  useHideScrollbar();
  return (
    <div className={styles.Modal}>
      {loading ? (
        <AbsoluteLoader />
      ) : (
        <div className={styles.Container} style={{ padding }}>
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
