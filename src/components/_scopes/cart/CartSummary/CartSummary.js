import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import Address from '../../account/Address/Address';
import styles from './CartSummary.module.scss';

function CartSummary() {
  const { checkout } = useCheckoutContext();
  console.log(checkout);
  return (
    <div className={styles.summary}>
      <h5 className={styles.title}>CART SUMMARY</h5>
      <div className={styles.subtotal}>
        <p>Subtotal</p>
        <p>
          {checkout?.totalPrice?.amount} {checkout?.currencyCode}
        </p>
      </div>
      <div className={styles.address}>
        <Address displayButton={false} address={checkout.shippingAddress} />
      </div>
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
