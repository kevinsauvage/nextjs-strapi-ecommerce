import { useRouter } from 'next/router';
import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import FlexColumn from '@/layout/FlexColumn/FlexColumn';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/product/ProductCheckoutCard/ProductCheckoutCard';
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
      {Array.isArray(cart?.lines) && cart.lines.length > 0 ? (
        <>
          <ul className={styles.list}>
            {cart.lines.map((item) => (
              <ProductCheckoutCard
                key={item?.id}
                product={item.product}
                variant={item.merchandise}
                quantity={item.quantity}
              />
            ))}
          </ul>
          <footer>
            <div className={styles.total}>
              <p>
                Total : {cart.cost?.subtotalAmount?.amount || 0}
                {cart.cost?.subtotalAmount?.currencyCode || 'USD'}
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
