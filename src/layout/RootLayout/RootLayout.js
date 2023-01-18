/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';
import { getMenuFooter, getMenuHeader, getShop } from '@/lib/shopify/shop/shopApiCall';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Cart from '@/components/_slides/Cart/Cart';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SecureBanner from '@/components/_banners/SecureBanner/SecureBanner';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import dynamic from 'next/dynamic';
import styles from './RootLayout.module.scss';

function RootLayout({ children }) {
  const { selectedProduct, setSelectedProduct, loading } = useGlobalContext();
  const [menuHeader, setMenuHeader] = useState();
  const [menuFooter, setMenuFooter] = useState();
  const [shopInfo, setShopInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [header, footer, shop] = await Promise.all([getMenuHeader(), getMenuFooter(), getShop()]);
      setMenuFooter(footer);
      setMenuHeader(header);
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
      <Cart />
      {loading && <PageLoader />}
      <Header headerMenu={menuHeader} />
      {selectedProduct && getProductModal()}
      {children}
      <SecureBanner />
      <Footer menuFooter={menuFooter} shopInfo={shopInfo} />
    </div>
  );
}

export default RootLayout;
