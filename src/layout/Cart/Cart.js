import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/product/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Cart.module.scss';

function CartFooter() {
  const router = useRouter();
  const { cart } = useCartContext();

  return (
    <footer className={styles.footer}>
      <div className={styles.subtotal}>
        <p className={styles.subtotalTitle}>Subtotal</p>
        <p
          className={styles.amount}
        >{`${cart?.cost?.subtotalAmount?.currencyCode}${cart?.cost?.subtotalAmount?.amount}`}</p>
      </div>
      <Button
        text="View cart"
        extraClass={styles.btn}
        tertiary
        onClick={() => router.push('/cart')}
      />
      <CheckoutBtn extraClass={styles.btn} />
    </footer>
  );
}

function CartContent() {
  const { cart, handleQuantityChange, removeFromCart } = useCartContext();

  return Array.isArray(cart?.lines) && cart.lines.length > 0 ? (
    <div className={styles.cart}>
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
    </div>
  ) : (
    <EmptyCart />
  );
}

export default function Cart() {
  const { cartOpen, resetToggle } = useGlobalContext();
  const { cart } = useCartContext();

  return (
    <Slide
      isOpen={cartOpen}
      handleClose={resetToggle}
      title="Cart"
      headerRight={cart?.length}
      content={<CartContent />}
      footer={<CartFooter />}
    />
  );
}
