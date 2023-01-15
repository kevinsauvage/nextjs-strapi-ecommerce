import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import config from '@/config/index';

export default function CheckoutBtn({ extraClass, url }) {
  const router = useRouter();

  const webUrl = new URL(url);
  const checkoutUrl = config.paymentUrl + webUrl.pathname + webUrl.search;
  const redirectToCheckout = async () => router.push(checkoutUrl);

  return (
    <Button primary onClick={() => redirectToCheckout()} text="Proceed to checkout" extraClass={extraClass} />
  );
}
