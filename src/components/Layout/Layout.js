import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import SearchBar from '@/components/Search/SearchBar';
import Cart from '@/components/Cart/Cart';
import User from '@/components/User/User';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Layout.module.scss';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import Modal from '../Modal/Modal';
import ProductPresenter from '../product/ProductPresenter/ProductPresenter';

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
