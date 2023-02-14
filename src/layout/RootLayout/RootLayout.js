/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';
import { getMenu, getShop, getMetaObject } from '@/lib/shopify/shop/shopApiCall';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import SearchBar from '@/components/_scopes/search/Search/SearchBar';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';

import styles from './RootLayout.module.scss';

function RootLayout({ children }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [header] = await Promise.all([getMenu('main-menu')]);

      setMenuHeader(header);
    };
    getMetaObject({ type: 'navigation', handle: 'main' });
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [footer, shop] = await Promise.all([getMenu('footer'), getShop()]);
      setMenuFooter(footer);
      setShopInfo(shop);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.RootLayout}>
      <SearchBar />
      <Header headerMenu={menuHeader} />
      {children}
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
      {loading && <PageLoader />}
      {selectedProduct && (
        <ModalProduct handleClose={() => setSelectedProduct(false)} selectedProduct={selectedProduct} />
      )}
    </div>
  );
}

export default RootLayout;
