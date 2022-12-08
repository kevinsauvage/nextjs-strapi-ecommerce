import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import config from '@/config/index';

export default function CheckoutBtn({ extraClass, amount, currencyCode, url }) {
  const router = useRouter();

  const webUrl = new URL(url);
  const checkoutUrl = config.paymentUrl + webUrl.pathname + webUrl.search;

  const redirectToCheckout = async () => {
    router.push(checkoutUrl);
  };

  const text = `Checkout (${amount} ${currencyCode})`;

  return (
    <Button
      secondary
      onClick={() => redirectToCheckout()}
      text={text}
      extraClass={extraClass}
    />
  );
}
