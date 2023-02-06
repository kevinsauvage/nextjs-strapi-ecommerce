/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useEffect, useState } from 'react';
import { getMenu, getShop, getPage } from '@/lib/shopify/shop/shopApiCall';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Cart from '@/components/_slides/Cart/Cart';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import SearchBar from '@/components/_scopes/search/Search/SearchBar';
import BigMenu from '@/components/BigMenu/BigMenu';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';
import styles from './RootLayout.module.scss';

function RootLayout({ children }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();
  const [bigMenu, setBigMenu] = useState();
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
      const [header] = await Promise.all([getMenu('main-menu')]);

      setMenuHeader(header);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [footer, shop, menuCross] = await Promise.all([getMenu('footer'), getShop(), getPage('bigMenu')]);

      setBigMenu(menuCross);
      setMenuFooter(footer);
      setShopInfo(shop);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.RootLayout}>
      <SearchBar />

      {loading && <PageLoader />}
      {selectedProduct && (
        <ModalProduct handleClose={() => setSelectedProduct(false)} product={selectedProduct} />
      )}
      <Header headerMenu={menuHeader} handleOver={handleOver} handleClose={handleClose} />
      <Cart />
      {activeItems?.length > 0 && (
        <BigMenu data={activeItems} collections={bigMenu?.collections} handleClose={handleClose} />
      )}
      {children}
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
    </div>
  );
}

export default RootLayout;
