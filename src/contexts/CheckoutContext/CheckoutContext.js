import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;
  const { toggleLoading, toggleCheckout } = useGlobalContext();

  const handleSetCheckout = useCallback((payload) => dispatch({ type: actions.ADD_CHECKOUT, payload }), []);

  const toggleCheckoutLoading = useCallback(
    (payload) => dispatch({ type: actions.IS_CHECKOUT_LOADING, payload }),
    []
  );

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.removeLinesFromCheckout(lineItemId);
      if (res?.id) handleSetCheckout(res);
      toggleCheckoutLoading(false);
    },
    [handleSetCheckout, toggleCheckoutLoading]
  );

  const handleQuantityChange = useCallback(
    async (payload) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.checkoutLineItemsUpdate(payload);
      if (res?.id) {
        handleSetCheckout(res);
        return true;
      }
      toggleCheckoutLoading(false);
      return false;
    },
    [handleSetCheckout, toggleCheckoutLoading]
  );

  useEffect(() => {
    const handleRender = async () => {
      if (!checkout?.id) {
        const res = await nextApiCall.getCheckout();
        if (res?.id) handleSetCheckout(res);
      }
    };
    handleRender();
  }, [checkout?.id, handleSetCheckout]);

  const handleAddToCheckout = useCallback(
    async (variantId, quantity) => {
      if (quantity > 0 && variantId) {
        toggleCheckoutLoading(true);
        toggleLoading(true);
        const res = await nextApiCall.addToCheckout({ variantId, quantity });
        if (res?.id) {
          dispatch({ type: actions.ADD_CHECKOUT, payload: res });
          toggleCheckout(true);
        } else alert('could not add the product variant to the checkout');
        toggleCheckoutLoading(false);
        toggleLoading(false);
      }
    },
    [toggleCheckout, toggleCheckoutLoading, toggleLoading]
  );

  const values = useMemo(
    () => ({
      checkout,
      dispatch,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleSetCheckout,
      handleAddToCheckout,
    }),
    [
      checkout,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleSetCheckout,
      handleAddToCheckout,
    ]
  );

  return <CheckoutContext.Provider value={values}>{children}</CheckoutContext.Provider>;
}
