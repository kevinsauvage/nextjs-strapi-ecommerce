import { useEffect, useState } from 'react';

import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';
import SearchBar from '@/components/_scopes/search/Search/SearchBar';
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import getClient from '@/shopify/index';

import styles from './RootLayout.module.scss';

const RootLayout = ({ children }) => {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();

  console.log('🚀 ~ file: RootLayout.js:18 ~ RootLayout ~ shopInfo:', shopInfo);

  useEffect(() => {
    const fetchData = async () => {
      const header = await getClient().storefront.shop.getMenu({ handle: 'main-menu' });
      setMenuHeader(header);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [footer, shop] = await Promise.all([
        getClient().storefront.shop.getMenu({ handle: 'footer' }),
        getClient().storefront.shop.getShop(),
      ]);
      setMenuFooter(footer);
      setShopInfo(shop);
    };

    fetchData();
  }, []);

  return (
    <div className={styles['root-layout']}>
      <SearchBar />
      <Header headerMenu={menuHeader} />
      {children}
      <Footer menuFooter={menuFooter} />
      {loading && <PageLoader />}
      {selectedProduct && (
        <ModalProduct handleClose={() => setSelectedProduct(false)} selectedProduct={selectedProduct} />
      )}
      <CookieBanner />
    </div>
  );
};

export default RootLayout;
