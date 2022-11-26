import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import SearchBar from '@/layout/Search/SearchBar';
import Cart from '@/layout/Cart/Cart';
import User from '@/layout/User/User';
import Modal from '@/layout/Modal/Modal';
import ProductPresenter from '@/components/product/ProductPresenter/ProductPresenter';
import useProductContext from '@/contexts/ProductContext/useProductContext';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './Layout.module.scss';
import PageLoader from '../Loader/PageLoader/PageLoader';

function Layout({ children, headerMenu }) {
  const { selectedProduct, setSelectedProduct } = useProductContext();
  const { isCartLoading } = useCartContext();
  const { loading } = useUserContext();

  return (
    <>
      <SearchBar />
      <Cart />
      <User />
      {(isCartLoading || loading) && <PageLoader />}
      <div className={styles.container}>
        <Header headerMenu={headerMenu} />
        {selectedProduct ? (
          <Modal handleClose={() => setSelectedProduct(false)}>
            <ProductPresenter product={selectedProduct} isModal carousel />
          </Modal>
        ) : null}
        <div className={styles.children}>{children}</div>
      </div>
      <ToastContainer position="bottom-center" newestOnTop theme="dark" />
      <Footer />
    </>
  );
}

export default Layout;
