import { useRouter } from 'next/router';
import { useContext } from 'react';
import Image from 'next/image';
import { CartContext } from '../../contexts/CartContext/CartContext';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import routes from '../../data/routes';
import Button from '../../components/Button/Button';
import Slide from '../../components/Slide/Slide';
import FlexColumn from '../../components/FlexColumn/FlexColumn';
import styles from './Cart.module.scss';
import CheckoutBtn from '../../components/CheckoutBtn/CheckoutBtn';
import { UserContext } from '../../contexts/UserContext/UserContext';
import useTotalPrice from '../../hooks/useTotalPrice';
import ProductCheckoutCard from '../../components/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '../../components/EmptyCart/EmptyCart';

export default function Cart() {
  const { cartOpen, resetToggle } = useContext(GlobalStoreContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const total = useTotalPrice(cart.items);

  const router = useRouter();
  console.log(cart, 'caart');

  return (
    <Slide
      isOpen={cartOpen}
      handleClose={resetToggle}
      title="Shopping Cart"
      headerRight={cart.length}
    >
      {cart && Array.isArray(cart.items) && cart.items.length > 0 ? (
        <>
          <ul className={styles.list}>
            {cart.items.map((item) => (
              <ProductCheckoutCard key={item.product.id} item={item} />
            ))}
          </ul>
          <footer>
            <div className={styles.total}>
              <p>Total : {total}</p>
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
