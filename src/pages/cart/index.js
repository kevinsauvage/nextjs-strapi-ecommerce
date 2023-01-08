import Page from '@/layout/Page/Page';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import styles from './Cart.module.scss';

function CartPage() {
  const { checkout, handleQuantityChange, removeFromCheckout } =
    useCheckoutContext();

  if (checkout?.lineItems?.length === 0) return <EmptyCart />;

  return (
    <Page title="Your Cart">
      <div className={styles.cart}>
        <div>
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
                <td className={styles.price} colSpan="6">
                  <span>
                    Total {checkout?.totalPrice?.amount}{' '}
                    {checkout?.currencyCode}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <Card title="Shipping Address">
            <Address displayButton={false} address={checkout.shippingAddress} />
          </Card>
          <CheckoutBtn
            extraClass={styles.btn}
            amount={checkout?.totalPrice?.amount}
            currencyCode={checkout?.currencyCode}
            url={checkout?.webUrl}
          />
        </div>
      </div>
    </Page>
  );
}

export default CartPage;
