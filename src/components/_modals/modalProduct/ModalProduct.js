import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import Modal from '../Modal/Modal';

export default function ModalProduct({ handleClose, product }) {
  return (
    <Modal handleClose={handleClose}>
      <ProductPresenter product={product} />
    </Modal>
  );
}
