import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import SearchBar from '@/layout/Search/SearchBar';
import Cart from '@/layout/Cart/Cart';
import {
  getMenuFooter,
  getMenuHeader,
  getShop,
} from '@/lib/shopify/shop/shopApiCall';
import ModalProduct from '@/modals/modalProduct/ModalProduct';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLoader from '../Loader/PageLoader/PageLoader';
import styles from './Layout.module.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import SecureBanner from '../SecureBanner/SecureBanner';

function Layout({ children }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const header = await getMenuHeader();
      const footer = await getMenuFooter();
      const shop = await getShop();
      setMenuFooter(footer);
      setMenuHeader(header);
      setShopInfo(shop);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.layout}>
      <SearchBar />
      <Cart />
      {loading && <PageLoader />}
      <Header headerMenu={menuHeader} />
      {selectedProduct ? (
        <ModalProduct
          handleClose={() => setSelectedProduct(false)}
          product={selectedProduct}
        />
      ) : null}
      {children}
      <SecureBanner />
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
      <ToastContainer position="top-left" newestOnTop theme="dark" />
    </div>
  );
}

export default Layout;
