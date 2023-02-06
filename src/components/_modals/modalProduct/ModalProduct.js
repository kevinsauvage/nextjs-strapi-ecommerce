import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import { GrClose } from 'react-icons/gr';
import styles from './ModalProduct.module.scss';

export default function ModalProduct({ handleClose, product }) {
  return (
    <div className={styles.ModalProduct}>
      <div className={styles.Container}>
        <div className={styles.header}>
          <button className={styles.close} type="button" onClick={() => handleClose()}>
            <GrClose />
          </button>
        </div>
        <ProductPresenter product={product} isModal />
      </div>
    </div>
  );
}
