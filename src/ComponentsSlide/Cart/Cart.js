import { useRouter } from 'next/router';
import { useContext } from 'react';
import Image from 'next/image';
import { CartContext } from '../../contexts/CartContext/CartContext';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import routes from '../../data/routes';
import Button from '../../components/Button/Button';
import Slide from '../../components/Slide/Slide';
import Wrapper from '../../components/Wrapper/Wrapper';
import styles from './Cart.module.scss';
import CheckoutBtn from '../../components/CheckoutBtn/CheckoutBtn';
import { UserContext } from '../../contexts/UserContext/UserContext';
import useTotalPrice from '../../hooks/useTotalPrice';

export default function Cart() {
  const { cartOpen, resetToggle } = useContext(GlobalStoreContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const total = useTotalPrice(cart);

  const router = useRouter();

  return (
    <Slide isOpen={cartOpen} handleClose={resetToggle} title="Shopping Cart">
      <p className={styles.totalItems}>{cart.length} items</p>
      {cart && Array.isArray(cart) && cart.length > 0 ? (
        <>
          {cart.map((item) => console.log(item))}
          <footer>
            <div className={styles.total}>
              <p>Total : {total}</p>
            </div>
            <div className={styles.btns}>
              <Wrapper>
                <Button
                  text="View cart"
                  extraClass={styles.btn}
                  tertiary
                  onClick={() => router.push('/cart')}
                />

                <CheckoutBtn
                  user={user}
                  noUserRedirectURL={routes.base.login}
                  items={cart}
                />
              </Wrapper>
            </div>
          </footer>
        </>
      ) : (
        <div className={styles.emptyContainer}>
          <Image src="/emptyCart.svg" width="200" height="200" />
          <p className={styles.emptyText}>Your cart is empty</p>
          <Button
            text="CONTINUE SHOPPING"
            secondary
            onClick={() => {
              resetToggle();
              router.push(routes.base.shop);
            }}
          />
        </div>
      )}
    </Slide>
  );
}
