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
    <footer className={styles.footer}>
      <div className={styles.subtotal}>
        <p className={styles.subtotalTitle}>Subtotal</p>
        <p
          className={styles.amount}
        >{`${checkout?.currencyCode} ${checkout?.totalPrice?.amount}`}</p>
      </div>
      <Button
        text="View cart"
        extraClass={styles.btn}
        contrast
        onClick={() => router.push('/cart')}
      />
      <CheckoutBtn
        extraClass={styles.btn}
        amount={checkout?.totalPrice?.amount}
        currencyCode={checkout?.currencyCode}
        url={checkout?.webUrl}
      />
    </footer>
  );
}

function CartContent() {
  const { checkout } = useCheckoutContext();

  return (
    <div className={styles.cart}>
      <ul className={styles.list}>
        {checkout.lineItems.map((item) => (
          <ProductCheckoutCard lineItem={item} key={item?.id} />
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
        Array.isArray(checkout?.lineItems) && checkout?.lineItems.length ? (
          <CartFooter />
        ) : null
      }
    />
  );
}
