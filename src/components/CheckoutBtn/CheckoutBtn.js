import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import useCartContext from '@/contexts/CartContext/useCartContext';

export default function CheckoutBtn({ extraClass }) {
  const router = useRouter();

  const { cart } = useCartContext();

  const redirectToCheckout = async () => router.push(cart.checkoutUrl);

  return (
    <Button
      secondary
      onClick={() => redirectToCheckout()}
      text="Checkout"
      extraClass={extraClass}
    />
  );
}
