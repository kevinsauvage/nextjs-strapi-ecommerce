import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import CartSummary from '@/components/_scopes/cart/CartSummary/CartSummary';
import CartTable from '@/components/_scopes/cart/CartTable/CartTable';
import EmptyCart from '@/components/_scopes/cart/EmptyCart/EmptyCart';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './Cart.module.scss';

function CartPage() {
  const { checkout } = useCheckoutContext();

  if (!checkout || checkout?.lineItems?.length === 0) return <EmptyCart />;

  return (
    <PageLayout title="Your Cart">
      <div className={styles.cart}>
        <CartTable />
        <CartSummary />
      </div>
    </PageLayout>
  );
}

export default CartPage;
