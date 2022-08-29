import { useRouter } from 'next/router';
import React from 'react';
import apiHelper from '../../utils/apiHelper';
import getStripe from '../../utils/getStripe';
import Button from '../Button/Button';

export default function CheckoutBtn({
  user,
  noUserRedirectURL,
  items,
  extraClass,
}) {
  const router = useRouter();
  const redirectToCheckout = async () => {
    if (!user || !user?.id) return router.push(noUserRedirectURL);

    const res = await apiHelper('/api/checkout_sessions', {
      items,
      user,
    });

    if (!res || !res.id) return null;

    const stripe = await getStripe();

    return stripe.redirectToCheckout({ sessionId: res.id });
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
