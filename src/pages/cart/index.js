import Page from '@/layout/Page/Page';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import routes from '@/data/routes';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import useCartContext from '@/contexts/CartContext/useCartContext';
import styles from './Cart.module.scss';

function CartPage() {
  const { cart, removeFromCart, handleQuantityChange } = useCartContext();

  return (
    <Page title="Your Cart">
      <div className={styles.cart}>
        {Array.isArray(cart?.lines) && cart?.lines?.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead className={styles.head}>
                <tr>
                  <th className="image text-left">Item</th>
                  <th className="price">Price</th>
                  <th className="qty">Quantity</th>
                  <th className="total">Total</th>
                  <th className="remove">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.lines.map((item) => (
                  <CartItem
                    key={item?.id}
                    product={item.product}
                    variant={item.merchandise}
                    quantity={item?.quantity}
                    removeFromCart={removeFromCart}
                    lineId={item.id}
                    handleQuantityChange={handleQuantityChange}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.summary}>
                  <td colSpan="4">
                    <input style={{ display: 'none', visibility: 'hidden' }} />
                  </td>
                  <td className={styles.price}>
                    <span>
                      {cart?.cost?.subtotalAmount?.amount}{' '}
                      {cart?.cost?.subtotalAmount?.currencyCode}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className={styles.btns}>
              <CheckoutBtn
                extraClass={styles.btn}
                noUserRedirectURL={routes.login}
                items={cart}
              />
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </div>
    </Page>
  );
}

export default CartPage;
