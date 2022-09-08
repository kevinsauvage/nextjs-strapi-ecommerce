import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext/CartContext';
import Button from '@/components/Button/Button';

export default function CheckoutBtn({ noUserRedirectURL, extraClass }) {
  const router = useRouter();

  const { getCheckoutById, cart } = useContext(CartContext);

  const redirectToCheckout = async () => {
    await getCheckoutById();

    if (!cart?.shippingAddress) return router.push(cart.webUrl);
    return router.push(noUserRedirectURL);
  };

  return (
    <Button
      secondary
      onClick={() => redirectToCheckout()}
      text="Checkout"
      extraClass={extraClass}
    />
  );
}
