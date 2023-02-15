import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import CartSummary from '@/components/_scopes/cart/CartSummary/CartSummary';
import CartTable from '@/components/_scopes/cart/CartTable/CartTable';
import EmptyCart from '@/components/_scopes/cart/EmptyCart/EmptyCart';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import Container from '@/components/Container/Container';
import styles from './Cart.module.scss';

function CartPage() {
  const { checkout, handleQuantityChange, isCheckoutLoading } = useCheckoutContext();
  const { showToast } = useToastContext();
  const [lineItemsToUpdate, setLineItemsToUpdate] = useState([]);

  if ((!checkout || checkout?.lineItems?.length === 0) && !isCheckoutLoading) return <EmptyCart />;

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

  return (
    <PageLayout title="Your Cart">
      <Container>
        {!isCheckoutLoading ? (
          <div className={styles.cart}>
            <main>
              <CartTable handleChange={handleSetLineToUpdate} />

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
          <BlockLoader />
        )}
      </Container>
    </PageLayout>
  );
}

export default CartPage;
