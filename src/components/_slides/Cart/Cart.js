import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import ProductCheckoutCard from '@/components/_scopes/product/ProductCheckoutCard/ProductCheckoutCard';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import EmptyCart from '@/components/_scopes/cart/EmptyCart/EmptyCart';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import styles from './Cart.module.scss';
import Slide from '../Slide/Slide';

function CartFooter() {
  const router = useRouter();
  const { checkout } = useCheckoutContext();

  return (
    <footer className={styles.footer}>
      <div className={styles.subtotal}>
        <p className={styles.subtotalTitle}>Subtotal</p>
        <p className={styles.amount}>{`${checkout?.currencyCode} ${checkout?.totalPrice?.amount}`}</p>
      </div>
      <div className={styles.buttons}>
        <Button text="View cart" extraClass={styles.btn} secondary onClick={() => router.push('/cart')} />
        <CheckoutBtn
          extraClass={styles.btn}
          amount={checkout?.totalPrice?.amount}
          currencyCode={checkout?.currencyCode}
          url={checkout?.webUrl}
        />
      </div>
    </footer>
  );
}

function CartContent() {
  const { checkout, isCheckoutLoading } = useCheckoutContext();

  if (isCheckoutLoading) return <BlockLoader />;

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
        Array.isArray(checkout?.lineItems) && checkout?.lineItems.length > 0 ? <CartContent /> : <EmptyCart />
      }
      footer={Array.isArray(checkout?.lineItems) && checkout?.lineItems.length ? <CartFooter /> : null}
    />
  );
}
