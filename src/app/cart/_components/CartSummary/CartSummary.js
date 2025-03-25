import CheckoutButton from '@/components/CheckoutButton/CheckoutButton';

import styles from './CartSummary.module.scss';

const CartSummaryRow = ({ title, content, children }) => (
  <div className={styles['cart-summary-row']}>
    <div className={styles['cart-summary-row__header']}>
      <p className={styles['cart-summary-row__title']}>{title}</p>
      <p>{content}</p>
    </div>
    {children && <div className={styles['cart-summary-row__children']}>{children}</div>}
  </div>
);

const CartSummary = ({ cart }) => {
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
        <CartSummaryRow title="Total products" content={cart?.totalQuantity || 0} />
        <CheckoutButton extraClass={styles.btn} checkoutUrl={cart?.checkoutUrl} />
      </div>
    </div>
  );
};

export default CartSummary;
