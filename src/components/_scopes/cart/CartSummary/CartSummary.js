import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
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
  const { checkout } = useCheckoutContext();
  return (
    <div className={styles.summary}>
      <h5 className={styles.title}>CART SUMMARY</h5>
      <CartSummaryRow
        title="Subtotal"
        content={`${checkout?.totalPrice?.amount} ${checkout?.currencyCode}`}
      />
      <CartSummaryRow title="Total products" content={checkout?.lineItems?.length || 0} />
      <CheckoutBtn
        extraClass={styles.btn}
        amount={checkout?.totalPrice?.amount}
        currencyCode={checkout?.currencyCode}
        url={checkout?.webUrl}
      />
    </div>
  );
}

export default CartSummary;
