import { useRouter } from 'next/router';
import { useContext } from 'react';
import Page from '@/components/Page/Page';
import { CartContext } from '@/contexts/CartContext/CartContext';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import routes from '@/data/routes';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import Container from '@/components/Container/Container';
import styles from './Cart.module.scss';

function CartPage() {
  const router = useRouter();
  const { cart, isCheckoutLoading } = useContext(CartContext);

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Cart" loading={isCheckoutLoading}>
      <Container>
        <div className={styles.cart}>
          {cart &&
          Array.isArray(cart.lineItems) &&
          cart?.lineItems?.length > 0 ? (
            <div style={{ width: '100%', height: '100%' }}>
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
                  {cart.lineItems.map((item) => (
                    <CartItem
                      key={item?.variant?.id}
                      product={item}
                      quantity={item?.quantity}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className={styles.summary}>
                    <td colSpan="4">
                      <input
                        style={{ display: 'none', visibility: 'hidden' }}
                      />
                    </td>
                    <td className={styles.price}>
                      <span>
                        {cart?.totalPriceV2?.amount}
                        {cart?.totalPriceV2?.currencyCode}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className={styles.btns}>
                <CheckoutBtn
                  extraClass={styles.btn}
                  noUserRedirectURL={routes.base.login}
                  items={cart}
                />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>
      </Container>
    </Page>
  );
}

export default CartPage;
