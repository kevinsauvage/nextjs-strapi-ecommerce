import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import useCartContext from '@/contexts/CartContext/useCartContext';

export default function CheckoutBtn({ extraClass }) {
  const router = useRouter();

  const { cart } = useCartContext();

  const redirectToCheckout = async () => router.push(cart.checkoutUrl);

  const text = `Checkout (${cart?.cost?.subtotalAmount?.amount} ${cart?.cost?.subtotalAmount?.currencyCode})`;

  return (
    <Button
      secondary
      onClick={() => redirectToCheckout()}
      text={text}
      extraClass={extraClass}
    />
  );
}
