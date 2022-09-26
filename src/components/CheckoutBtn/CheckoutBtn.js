import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext/CartContext';
import Button from '@/components/Button/Button';

export default function CheckoutBtn({ extraClass }) {
  const router = useRouter();

  const { cart } = useContext(CartContext);

  const redirectToCheckout = async () => router.push(cart.webUrl);

  return (
    <Button
      secondary
      onClick={() => redirectToCheckout()}
      text="Checkout"
      extraClass={extraClass}
    />
  );
}
