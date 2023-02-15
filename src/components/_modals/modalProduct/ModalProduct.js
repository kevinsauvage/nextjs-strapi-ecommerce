import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/shopify/product/productApiCall';
import Modal from '../Modal/Modal';

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
    <Modal loading={loading} handleClose={handleClose}>
      <ProductPresenter product={product} isModal />
    </Modal>
  );
}
