import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import FlexColumn from '@/layout/FlexColumn/FlexColumn';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/product/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Cart.module.scss';
import Loader from '../Loader/SectionLoader/Loader';

export default function Cart() {
  const { cartOpen, resetToggle } = useGlobalContext();
  const { cart, handleQuantityChange, isCartLoading, removeFromCart } =
    useCartContext();

  const router = useRouter();

  return (
    <Slide
      isOpen={cartOpen}
      handleClose={resetToggle}
      title="Cart"
      headerRight={cart?.length}
    >
      {isCartLoading && <Loader />}

      {Array.isArray(cart?.lines) && cart.lines.length > 0 ? (
        <>
          <ul className={styles.list}>
            {cart.lines.map((item) => (
              <ProductCheckoutCard
                key={item?.id}
                product={item.product}
                variant={item.merchandise}
                quantity={item.quantity}
                lineId={item.id}
                remove={() => removeFromCart(item.id)}
                onQuantityChange={(num) => handleQuantityChange(num, item.id)}
              />
            ))}
          </ul>
          <FlexColumn gap="1rem">
            <Button
              text="View cart"
              extraClass={styles.btn}
              tertiary
              onClick={() => router.push('/cart')}
            />
            <CheckoutBtn extraClass={styles.btn} />
          </FlexColumn>
        </>
      ) : (
        <EmptyCart />
      )}
    </Slide>
  );
}
