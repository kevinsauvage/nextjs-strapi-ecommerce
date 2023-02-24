import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import useCartContext from '@/contexts/CartContext/useCartContext';
import styles from './CartSummary.module.scss';

function CartSummaryRow({ title, content, children }) {
  return (
    <div className={styles.CartSummaryRow}>
      <div className={styles.CartSummaryRow__header}>
        <p className={styles.CartSummaryRow__title}>{title}</p>
        <p className={styles.CartSummaryRow__content}>{content}</p>
      </div>
      {children && <div className={styles.CartSummaryRow__children}>{children}</div>}
    </div>
  );
}

function CartSummary() {
  const { cart, getTotalItems } = useCartContext();
  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h5 className={styles.title}>CART SUMMARY</h5>
      </div>
      <div className={styles.content}>
        <CartSummaryRow
          title="Total Amount"
          content={`${cart?.cost?.totalAmount?.amount} ${cart?.cost?.totalAmount?.currencyCode}`}
        />

        <CartSummaryRow
          title="Subtotal Amout"
          content={`${cart?.cost?.subtotalAmount?.amount} ${cart?.cost?.subtotalAmount?.currencyCode}`}
        />
        <CartSummaryRow title="Total products" content={getTotalItems() || 0} />
        <CheckoutBtn extraClass={styles.btn} checkoutUrl={cart?.checkoutUrl} />
      </div>
    </div>
  );
}

export default CartSummary;
