/* eslint-disable jsx-a11y/control-has-associated-label */
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import CartItem from '../CartItem/CartItem';
import styles from './CartTable.module.scss';

function CartTable() {
  const { checkout, handleQuantityChange, removeFromCheckout } =
    useCheckoutContext();

  return (
    <table className={styles.table}>
      <thead className={styles.head}>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th colSpan="1" />
        </tr>
      </thead>
      <tbody>
        {checkout.lineItems.map((item) => (
          <CartItem
            key={item?.id}
            product={item.variant.product}
            collection={item.variant.product?.collections?.nodes?.[0]}
            variant={item.variant}
            quantity={item?.quantity}
            title={item?.title}
            removeFromCart={removeFromCheckout}
            lineId={item.id}
            handleQuantityChange={handleQuantityChange}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CartTable;
