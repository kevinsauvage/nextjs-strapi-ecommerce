import { useEffect, useState } from 'react';
import { getMenuFooter, getMenuHeader, getShop } from '@/lib/shopify/shop/shopApiCall';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Cart from '@/components/_slides/Cart/Cart';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';
import SecureBanner from '@/components/_banners/SecureBanner/SecureBanner';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import styles from './RootLayout.module.scss';

function RootLayout({ children }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();

  useEffect(() => {
    console.time('Function #1');

    const fetchData = async () => {
      const [header, footer, shop] = await Promise.all([getMenuHeader(), getMenuFooter(), getShop()]);
      setMenuFooter(footer);
      setMenuHeader(header);
      setShopInfo(shop);
      console.timeEnd('Function #1');
    };

    fetchData();
  }, []);

  return (
    <div className={styles.RootLayout}>
      <Cart />
      {loading && <PageLoader />}
      <Header headerMenu={menuHeader} />
      {selectedProduct ? (
        <ModalProduct handleClose={() => setSelectedProduct(false)} product={selectedProduct} />
      ) : null}
      {children}
      <SecureBanner />
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
      <svg xmlns="https://www.w3.org/2000/svg" version="1.1" height="0">
        <filter id="myblurfilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </svg>
    </div>
  );
}

export default RootLayout;
