import { useContext } from 'react';
import { CheckoutContext } from './CheckoutContext';

const useCartContext = () => useContext(CheckoutContext);

export default useCartContext;
