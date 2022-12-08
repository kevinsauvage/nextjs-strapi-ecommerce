import Page from '@/layout/Page/Page';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import styles from './Cart.module.scss';

function CartPage() {
  const { checkout, handleQuantityChange, removeFromCheckout } =
    useCheckoutContext();

  return (
    <Page title="Your Cart">
      <div className={styles.cart}>
        {Array.isArray(checkout?.lineItems) &&
        checkout?.lineItems?.length > 0 ? (
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
              <tfoot>
                <tr className={styles.summary}>
                  <td colSpan="4">
                    <input style={{ display: 'none', visibility: 'hidden' }} />
                  </td>
                  <td className={styles.price}>
                    <span>
                      {checkout?.totalPrice} {checkout?.currencyCode}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className={styles.btns}>
              <CheckoutBtn
                extraClass={styles.btn}
                amount={checkout?.totalPrice}
                currencyCode={checkout?.currencyCode}
                url={checkout?.webUrl}
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
