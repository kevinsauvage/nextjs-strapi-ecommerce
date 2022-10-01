import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import SearchBar from '@/layout/Search/SearchBar';
import Cart from '@/layout/Cart/Cart';
import User from '@/layout/User/User';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import CategoryButtons from '@/layout/CategoryButtons/CategoryButtons';
import Modal from '@/layout/Modal/Modal';
import ProductPresenter from '@/components/product/ProductPresenter/ProductPresenter';
import styles from './Layout.module.scss';

function Layout({ children, collections }) {
  const { modalSelectedProduct, setSelectedModalProduct } = useGlobalContext();

  return (
    <>
      <SearchBar />
      <Cart />
      <User />
      <div className={styles.container}>
        <Header />
        <CategoryButtons collections={collections} />
        {modalSelectedProduct ? (
          <Modal handleClose={() => setSelectedModalProduct(false)}>
            <ProductPresenter product={modalSelectedProduct} isModal />
          </Modal>
        ) : null}
        <div className={styles.children}>{children}</div>
      </div>
      <ToastContainer position="bottom-center" newestOnTop theme="dark" />
      <Footer collections={collections} />
    </>
  );
}

export default Layout;
