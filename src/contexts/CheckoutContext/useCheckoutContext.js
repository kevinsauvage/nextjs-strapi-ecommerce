import { useContext } from 'react';
import { CheckoutContext } from './CheckoutContext';

const useCheckoutContext = () => useContext(CheckoutContext);

export default useCheckoutContext;
