/* eslint-disable jsx-a11y/control-has-associated-label */
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import config from '@/config/index';
import CartItem from '../CartItem/CartItem';
import styles from './CartTable.module.scss';

const { userFeedback } = config;

function CartTable() {
  const { checkout, handleQuantityChange, removeFromCheckout } =
    useCheckoutContext();

  const { showToast } = useToastContext();

  const [lineItemsToUpdate, setLineItemsToUpdate] = useState([]);

  console.log(lineItemsToUpdate);

  const handleUpdate = async () => {
    const res = await handleQuantityChange(lineItemsToUpdate);

    console.log('🚀 ~ file: CartTable.js:25 ~ handleUpdate ~ res', res);

    if (res) {
      setLineItemsToUpdate([]);
      return showToast.success(userFeedback.updateLines.success);
    }
    return showToast.error(userFeedback.updateLines.error);
  };

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
            handleChange={(line) =>
              setLineItemsToUpdate((prev) => [...prev, line])
            }
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} />
          <td>
            <Button
              extraClass={styles.button}
              contrast
              onClick={handleUpdate}
              disabled={!lineItemsToUpdate.length}
            >
              Update
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default CartTable;
