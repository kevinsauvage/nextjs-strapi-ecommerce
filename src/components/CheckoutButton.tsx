import Link from 'next/link';

import { Button } from '@/components/ui/button';

const CheckoutButton = ({ checkoutUrl }: { checkoutUrl: string }) => {
  return (
    <Link href={checkoutUrl} className="w-full">
      <Button className="w-full py-6 text-lg" size="lg">
        Proceed to Checkout
      </Button>
    </Link>
  );
};

export default CheckoutButton;
