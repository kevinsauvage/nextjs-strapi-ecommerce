/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useEffect, useState } from 'react';
import { getMenuFooter, getShop } from '@/lib/shopify/shop/shopApiCall';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Cart from '@/components/_slides/Cart/Cart';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SecureBanner from '@/components/_banners/SecureBanner/SecureBanner';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/_scopes/search/Search/SearchBar';
import BigMenu from '@/components/BigMenu/BigMenu';
import styles from './RootLayout.module.scss';

function RootLayout({ children, headerMenu }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();
  const [activeItems, setActiveItems] = useState([]);
  const { toggleSearch, searchOpen } = useGlobalContext();

  const handleOver = useCallback(
    (items) => {
      toggleSearch(false);
      setActiveItems(items);
    },
    [toggleSearch]
  );

  const handleClose = useCallback(() => setActiveItems([]), []);

  useEffect(() => {
    if (searchOpen) setActiveItems([]);
  }, [searchOpen]);

  useEffect(() => {
    const fetchData = async () => {
      const [footer, shop] = await Promise.all([getMenuFooter(), getShop()]);
      setMenuFooter(footer);
      setShopInfo(shop);
    };

    fetchData();
  }, []);

  const loader = <PageLoader />;

  const getProductModal = () => {
    const ProductModal = dynamic(() => import('../../components/_modals/modalProduct/ModalProduct'), {
      loading: () => loader,
    });
    return <ProductModal handleClose={() => setSelectedProduct(false)} product={selectedProduct} />;
  };

  return (
    <div className={styles.RootLayout}>
      <Header headerMenu={headerMenu} handleOver={handleOver} handleClose={handleClose} />
      <Cart />
      {loading && <PageLoader />}
      <SearchBar />
      {activeItems?.length > 0 && <BigMenu data={activeItems} handleClose={handleClose} />}
      {selectedProduct && getProductModal()}
      {children}
      <SecureBanner />
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
    </div>
  );
}

export default RootLayout;
