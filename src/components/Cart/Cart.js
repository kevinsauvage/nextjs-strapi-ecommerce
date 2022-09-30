import { useRouter } from 'next/router';
import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import Slide from '@/components/Slide/Slide';
import FlexColumn from '@/components/FlexColumn/FlexColumn';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Cart.module.scss';

export default function Cart() {
  const { cartOpen, resetToggle } = useGlobalContext();
  const { cart } = useCartContext();
  const { user } = useUserContext();
  const router = useRouter();

  return (
    <Slide
      isOpen={cartOpen}
      handleClose={resetToggle}
      title="Cart"
      headerRight={cart?.length}
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
                  noUserRedirectURL={routes.login}
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
