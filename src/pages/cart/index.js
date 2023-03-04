/* eslint-disable no-nested-ternary */
import { useState } from 'react';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import CartSummary from '@/components/_scopes/cart/CartSummary/CartSummary';
import CartTable from '@/components/_scopes/cart/CartTable/CartTable';
import EmptyCart from '@/components/_scopes/cart/EmptyCart/EmptyCart';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';

import styles from './Cart.module.scss';

function CartPage() {
  const { showToast } = useToastContext();
  const [lineItemsToUpdate, setLineItemsToUpdate] = useState([]);
  const { cart, isCartLoading, handleQuantityChange, removeFromCart } = useCartContext();

  const successCallback = () => setLineItemsToUpdate([]);

  const handleUpdate = async () => {
    const isQuantityMissing = lineItemsToUpdate.find((item) => !item.quantity);
    if (isQuantityMissing) return showToast.warning('The quantity should be a positive number');
    const isQuantityNegative = lineItemsToUpdate.find((item) => item.quantity < 0);
    if (isQuantityNegative) return showToast.warning('The quantity should be a positive number');
    return handleQuantityChange(lineItemsToUpdate, successCallback);
  };

  const handleSetLineToUpdate = (line) => {
    setLineItemsToUpdate((prev) => {
      const currentItems = prev.filter((item) => item.id !== line.id);
      return [...currentItems, line];
    });
  };

  const handleRemoveLine = (lineId) => {
    setLineItemsToUpdate((prev) => {
      const currentItems = prev.filter((item) => item.id !== lineId);
      return currentItems;
    });
    removeFromCart(lineId);
  };

  return (
    <PageLayout title={seo.cart.title} description={seo.cart.description}>
      <PageBanner title={seo.cart.title} />
      <Breadcrumbs />
      <Container>
        {isCartLoading ? (
          <BlockLoader />
        ) : cart?.lines?.length > 0 ? (
          <div className={styles.cart}>
            <main>
              <CartTable handleChange={handleSetLineToUpdate} handleRemove={handleRemoveLine} cart={cart} />
              {lineItemsToUpdate.length > 0 && (
                <Button
                  extraClass={styles.button}
                  secondary
                  onClick={handleUpdate}
                  disabled={!lineItemsToUpdate.length}
                >
                  Update
                </Button>
              )}
            </main>
            <aside>
              <CartSummary />
            </aside>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <EmptyCart />
          </div>
        )}
      </Container>
    </PageLayout>
  );
}

export default CartPage;
