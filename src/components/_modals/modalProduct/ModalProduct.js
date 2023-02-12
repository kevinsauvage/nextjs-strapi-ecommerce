import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import { useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { getProduct } from '@/lib/shopify/product/productApiCall';
import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import styles from './ModalProduct.module.scss';

export default function ModalProduct({ handleClose, selectedProduct }) {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { handle } = selectedProduct || {};
    if (handle) {
      getProduct(handle).then((res) => {
        if (res?.handle) setProduct(res);
        setLoading(false);
      });
    }
  }, [selectedProduct]);

  return (
    <div className={styles.ModalProduct}>
      {loading ? (
        <AbsoluteLoader />
      ) : (
        <div className={styles.Container}>
          <div className={styles.header}>
            <button className={styles.close} type="button" onClick={() => handleClose()}>
              <GrClose />
            </button>
          </div>
          <ProductPresenter product={product} isModal />
        </div>
      )}
    </div>
  );
}
