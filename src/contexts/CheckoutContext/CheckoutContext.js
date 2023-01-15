import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';

export const CheckoutContext = createContext();

const storageCheckoutKey = 'checkoutId';

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;

  const handleSetCheckout = (payload) => dispatch({ type: actions.ADD_CHECKOUT, payload });

  const toggleCheckoutLoading = useCallback((payload) => {
    dispatch({ type: actions.IS_CHECKOUT_LOADING, payload });
  }, []);

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.removeLinesFromCheckout(lineItemId);
      if (res?.id) dispatch({ type: actions.ADD_CHECKOUT, payload: res });
      toggleCheckoutLoading(false);
    },
    [toggleCheckoutLoading]
  );

  const handleQuantityChange = useCallback(
    async (payload) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.checkoutLineItemsUpdate(payload);
      if (res?.id) {
        dispatch({ type: actions.ADD_CHECKOUT, payload: res });
        return true;
      }
      toggleCheckoutLoading(false);

      return false;
    },
    [toggleCheckoutLoading]
  );

  useEffect(() => {
    const handleRender = async () => {
      if (!checkout?.id) {
        const checkoutRes = await nextApiCall.getCheckout();

        if (checkoutRes.id) {
          dispatch({ type: actions.ADD_CHECKOUT, payload: checkoutRes });
        }
      }
    };
    handleRender();
  }, [checkout?.id]);

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
    [checkout, isCheckoutLoading, removeFromCheckout, handleQuantityChange]
  );

  return <CheckoutContext.Provider value={values}>{children}</CheckoutContext.Provider>;
}
