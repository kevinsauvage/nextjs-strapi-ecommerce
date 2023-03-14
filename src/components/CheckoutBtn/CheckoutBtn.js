import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';

const CheckoutBtn = ({ extraClass, checkoutUrl }) => {
  const router = useRouter();
  const redirectToCheckout = async () => router.push(checkoutUrl);

  return (
    <Button primary onClick={() => redirectToCheckout()} text="Proceed to checkout" extraClass={extraClass} />
  );
};

export default CheckoutBtn;
