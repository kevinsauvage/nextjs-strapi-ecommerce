import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import Header from '@/components/Header/Header';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import getClient from '@/shopify/index';

import styles from './RootLayout.module.scss';

const LazyCookieBanner = dynamic(() => import('@/components/CookieBanner/CookieBanner'));
const LazyModalCookies = dynamic(() => import('@/components/_modals/ModalCookies/ModalCookies'), {
  loading: () => <AbsoluteLoader />,
});
const LazyModalProduct = dynamic(() => import('@/components/_modals/modalProduct/ModalProduct'), {
  loading: () => <AbsoluteLoader />,
});
const LazyFooter = dynamic(() => import('@/components/Footer/Footer'));
const LazySearchBar = dynamic(() => import('@/components/_scopes/search/Search/SearchBar'));

const RootLayout = ({ children }) => {
  const { selectedProduct, setSelectedProduct, loading, showBannerCookies, showModalCookies } =
    useGlobalContext();
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
      {loading && <PageLoader />}

      <LazySearchBar />

      <Header headerMenu={menuHeader} />
      {children}

      <LazyFooter menuFooter={menuFooter} />

      {selectedProduct && (
        <LazyModalProduct
          handleClose={() => setSelectedProduct(false)}
          selectedProduct={selectedProduct}
        />
      )}
      {showBannerCookies && <LazyCookieBanner />}
      {showModalCookies && <LazyModalCookies />}
    </div>
  );
};

export default RootLayout;
