import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import CartSummary from '@/components/_scopes/cart/CartSummary/CartSummary';
import CartTable from '@/components/_scopes/cart/CartTable/CartTable';
import EmptyCart from '@/components/_scopes/cart/EmptyCart/EmptyCart';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { useState } from 'react';
import config from '@/config/index';
import Button from '@/components/Button/Button';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import styles from './Cart.module.scss';

const { userFeedback } = config;

function CartPage() {
  const { checkout, handleQuantityChange, isCheckoutLoading } =
    useCheckoutContext();
  const { showToast } = useToastContext();
  const [lineItemsToUpdate, setLineItemsToUpdate] = useState([]);

  if ((!checkout || checkout?.lineItems?.length === 0) && !isCheckoutLoading)
    return <EmptyCart />;

  const handleUpdate = async () => {
    const isQuantityMissing = lineItemsToUpdate.find((item) => !item.quantity);
    if (isQuantityMissing)
      return showToast.warning('The quantity should be a positive number');

    const isQuantityNegative = lineItemsToUpdate.find(
      (item) => item.quantity < 0
    );

    if (isQuantityNegative)
      return showToast.warning('The quantity should be a positive number');

    const res = await handleQuantityChange(lineItemsToUpdate);

    if (res) {
      setLineItemsToUpdate([]);
      return showToast.success(userFeedback.updateLines.success);
    }
    return showToast.error(userFeedback.updateLines.error);
  };

  const handleSetLineToUpdate = (line) => {
    setLineItemsToUpdate((prev) => {
      const currentItems = prev.filter((item) => item.id !== line.id);
      return [...currentItems, line];
    });
  };

  return (
    <PageLayout title="Your Cart">
      {!isCheckoutLoading ? (
        <div className={styles.cart}>
          <main>
            <CartTable handleChange={handleSetLineToUpdate} />

            {lineItemsToUpdate.length > 0 && (
              <Button
                extraClass={styles.button}
                contrast
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
    </PageLayout>
  );
}

export default CartPage;
