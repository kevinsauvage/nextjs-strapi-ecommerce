import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import SearchBar from '@/layout/Search/SearchBar';
import Cart from '@/layout/Cart/Cart';
import User from '@/layout/User/User';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import {
  getMenuFooter,
  getMenuHeader,
  getShop,
} from '@/lib/shopify/shop/shopApiCall';
import ModalProduct from '@/modals/modalProduct/ModalProduct';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLoader from '../Loader/PageLoader/PageLoader';
import 'react-toastify/dist/ReactToastify.min.css';
import styles from './Layout.module.scss';

function Layout({ children }) {
  const { selectedProduct, setSelectedProduct } = useGlobalContext();
  const { isCheckoutLoading } = useCheckoutContext();
  const { loading } = useUserContext();
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

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <SearchBar />
      <Cart />
      <User />
      {(isCheckoutLoading || loading) && <PageLoader />}
      <div className={styles.container}>
        <Header headerMenu={menuHeader} />
        {selectedProduct ? (
          <ModalProduct
            handleClose={() => setSelectedProduct(false)}
            product={selectedProduct}
          />
        ) : null}
        <div className={styles.children}>{children}</div>
      </div>
      <ToastContainer position="bottom-center" newestOnTop theme="dark" />
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
    </>
  );
}

export default Layout;
