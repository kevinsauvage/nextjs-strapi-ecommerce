import Button from '@/components/Button/Button';

const CheckoutButton = ({ extraClass, checkoutUrl }) => {
  return <Button primary href={checkoutUrl} text="Proceed to checkout" extraClass={extraClass} />;
};

export default CheckoutButton;
