'use client';

import ProductDescription from '@/components/ProductDescription/ProductDescription';

import Modal from '../Modal/Modal';

import styles from './ModalProduct.module.scss';

const ModalProduct = ({ handleClose, selectedProduct }) => {
  return (
    <Modal handleClose={handleClose}>
      <div className={styles.modal}>
        <ProductDescription product={selectedProduct} isModal />
      </div>
    </Modal>
  );
};

export default ModalProduct;
