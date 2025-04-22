'use client';

import type { ProductFieldsFragment } from '@/shopify/storefront';

import ProductDescription from '@/components/ProductDescription/ProductDescription';

import Modal from '../Modal/Modal';

import styles from './ModalProduct.module.scss';

const ModalProduct = ({
  handleClose,
  selectedProduct,
}: {
  handleClose: () => void;
  selectedProduct: ProductFieldsFragment | undefined;
}) => {
  return (
    <Modal handleClose={handleClose} loading={!selectedProduct}>
      <div className={styles.modal}>
        <ProductDescription product={selectedProduct} isModal />
      </div>
    </Modal>
  );
};

export default ModalProduct;
