import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/scopes/product/ProductCheckoutCard/ProductCheckoutCard';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Cart.module.scss';

function CartFooter() {
  const router = useRouter();
  const { checkout } = useCheckoutContext();

  return (
    checkout?.lineItems.length && (
      <footer className={styles.footer}>
        <div className={styles.subtotal}>
          <p className={styles.subtotalTitle}>Subtotal</p>
          <p
            className={styles.amount}
          >{`${checkout?.currencyCode} ${checkout?.totalPrice}`}</p>
        </div>
        <Button
          text="View cart"
          extraClass={styles.btn}
          tertiary
          onClick={() => router.push('/cart')}
        />
        <CheckoutBtn
          extraClass={styles.btn}
          amount={checkout?.totalPrice}
          currencyCode={checkout?.currencyCode}
          url={checkout?.webUrl}
        />
      </footer>
    )
  );
}

function CartContent() {
  const { checkout, handleQuantityChange, removeFromCheckout } =
    useCheckoutContext();

  return (
    <div className={styles.cart}>
      <ul className={styles.list}>
        {checkout.lineItems.map((item) => (
          <ProductCheckoutCard
            key={item?.id}
            product={item.variant.product}
            collection={item.variant.product?.collections?.nodes?.[0]}
            variant={item.variant}
            quantity={item.quantity}
            title={item.title}
            lineId={item.id}
            remove={() => removeFromCheckout(item.id)}
            onQuantityChange={(num) => handleQuantityChange(num, item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default function Cart() {
  const { checkoutOpen, resetToggle } = useGlobalContext();
  const { checkout } = useCheckoutContext();

  return (
    <Slide
      isOpen={checkoutOpen}
      handleClose={resetToggle}
      title="Cart"
      headerRight={checkout?.length}
      content={
        Array.isArray(checkout?.lineItems) && checkout?.lineItems.length > 0 ? (
          <CartContent />
        ) : (
          <EmptyCart />
        )
      }
      footer={
        Array.isArray(checkout?.lineItems) &&
        checkout?.lineItems.length && <CartFooter />
      }
    />
  );
}
