import { remove } from '@/assets/svg';
import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import useHideScrollbar from '@/hooks/useHideScrollbar';

import styles from './Modal.module.scss';

const Modal = ({
  handleClose,
  loading,
  children,
  padding = '0px',
}: {
  handleClose: () => void;
  loading: boolean;
  children: React.ReactNode;
  padding?: string;
}) => {
  useHideScrollbar();
  return (
    <div className={styles.modal}>
      {loading ? (
        <AbsoluteLoader text="" />
      ) : (
        <div className={styles.container} style={{ padding }}>
          <div>
            <button className={styles.close} type="button" onClick={() => handleClose()}>
              {remove}
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Modal;
