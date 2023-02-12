import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import { useToastContext } from '../ToastContext/NotificationContext';

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;

  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
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
        toggleLoading(true);
        const res = await nextApiCall.addToCheckout({ variantId, quantity });

        if (res?.id) {
          dispatch({ type: actions.ADD_CHECKOUT, payload: res });
          showToast.success('Product added successfully');
        } else showToast.error('Could not add the product variant to the checkout');

        toggleLoading(false);
      }
    },
    [showToast, toggleLoading]
  );

  const getTotalItems = useCallback(
    () => checkout?.lineItems?.reduce((acc, item) => acc + item.quantity, 0),
    [checkout?.lineItems]
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
      getTotalItems,
    }),
    [
      checkout,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleSetCheckout,
      handleAddToCheckout,
      getTotalItems,
    ]
  );

  return <CheckoutContext.Provider value={values}>{children}</CheckoutContext.Provider>;
}
