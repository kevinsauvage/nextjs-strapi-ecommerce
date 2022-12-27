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

  console.log(checkout);

  return (
    <Page
      title="Your Cart"
      bannerTitle="Cart"
      bannerDescription="Welcome to your cart! Here you can view all of the items you have added to your cart, adjust quantities, and proceed to checkout. Don't forget to apply any promotional codes or take advantage of any special offers before you complete your purchase. If you have any questions about your cart, please don't hesitate to contact us. We are here to help and make your shopping experience as smooth as possible. Thank you for choosing us!"
    >
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
                      {checkout?.totalPrice?.amount} {checkout?.currencyCode}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div>
              <Card title="Shipping Address">
                <Address
                  displayButton={false}
                  address={checkout.shippingAddress}
                />
              </Card>
              <div className={styles.btns}>
                <CheckoutBtn
                  extraClass={styles.btn}
                  amount={checkout?.totalPrice?.amount}
                  currencyCode={checkout?.currencyCode}
                  url={checkout?.webUrl}
                />
              </div>
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
