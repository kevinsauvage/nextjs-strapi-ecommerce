import Button from '@/components/Button/Button';

const CheckoutButton = ({
  extraClass,
  checkoutUrl,
}: {
  extraClass?: string;
  checkoutUrl: string;
}) => {
  return <Button primary href={checkoutUrl} text="Proceed to checkout" extraClass={extraClass} />;
};

export default CheckoutButton;
