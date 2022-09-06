import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext/CartContext';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import Slide from '@/components/Slide/Slide';
import FlexColumn from '@/components/FlexColumn/FlexColumn';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import { UserContext } from '@/contexts/UserContext/UserContext';
import ProductCheckoutCard from '@/components/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import styles from './Cart.module.scss';

export default function Cart() {
  const { cartOpen, resetToggle } = useContext(GlobalStoreContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  return (
    <Slide
      isOpen={cartOpen}
      handleClose={resetToggle}
      title="Shopping Cart"
      headerRight={cart.length}
    >
      {cart && Array.isArray(cart.lineItems) && cart.lineItems.length > 0 ? (
        <>
          <ul className={styles.list}>
            {cart.lineItems.map((item) => (
              <ProductCheckoutCard key={item?.id} product={item} />
            ))}
          </ul>
          <footer>
            <div className={styles.total}>
              <p>
                Total : {cart.paymentDueV2.amount || 0}
                {cart.paymentDueV2.currencyCode}
              </p>
            </div>
            <div className={styles.btns}>
              <FlexColumn gap="1rem">
                <Button
                  text="View cart"
                  extraClass={styles.btn}
                  tertiary
                  onClick={() => router.push('/cart')}
                />
                <CheckoutBtn
                  user={user}
                  extraClass={styles.btn}
                  noUserRedirectURL={routes.base.login}
                  items={cart}
                />
              </FlexColumn>
            </div>
          </footer>
        </>
      ) : (
        <EmptyCart />
      )}
    </Slide>
  );
}
