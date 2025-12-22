import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ArrowRight } from 'lucide-react';

const CheckoutButton = ({ checkoutUrl }: { checkoutUrl: string }) => {
  return (
    <Link href={checkoutUrl} className="w-full">
      <Button className="w-full py-6 text-body-lg font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
        Proceed to Checkout
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
  );
};

export default CheckoutButton;
