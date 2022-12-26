import ProductPresenter from '@/components/scopes/product/ProductPresenter/ProductPresenter';
import Modal from '@/layout/Modal/Modal';

export default function ModalProduct({ handleClose, product }) {
  return (
    <Modal handleClose={handleClose}>
      <ProductPresenter product={product} />
    </Modal>
  );
}
