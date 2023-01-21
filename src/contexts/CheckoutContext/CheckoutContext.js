import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';

export const CheckoutContext = createContext();

const storageCheckoutKey = 'checkoutId';

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;

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

  const values = useMemo(
    () => ({
      checkout,
      dispatch,
      storageCheckoutKey,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleSetCheckout,
    }),
    [checkout, isCheckoutLoading, removeFromCheckout, handleQuantityChange, handleSetCheckout]
  );

  return <CheckoutContext.Provider value={values}>{children}</CheckoutContext.Provider>;
}
