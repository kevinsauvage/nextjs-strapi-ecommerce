import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';

export const CheckoutContext = createContext();

const storageCheckoutKey = 'checkoutId';

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;

  const handleSetCheckout = (payload) => {
    dispatch({ type: actions.ADD_CHECKOUT, payload });
  };

  const toggleCheckoutLoading = useCallback((payload) => {
    dispatch({ type: actions.IS_CHECKOUT_LOADING, payload });
  }, []);

  /* A callback function that is used to handle the response of the API call. */
  const handleResponse = useCallback(
    (res) => {
      toggleCheckoutLoading(false);
      if (res?.checkout?.id) handleSetCheckout(res.checkout);
    },
    [toggleCheckoutLoading]
  );

  /* A callback function that is used to remove a line item from the checkout. */
  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.removeLinesFromCheckout(lineItemId);
      handleResponse(res);
    },
    [toggleCheckoutLoading, handleResponse]
  );

  /* A callback function that is used to update the quantity of a line item in the checkout. */
  const handleQuantityChange = useCallback(
    async (payload) => {
      toggleCheckoutLoading(true);
      const res = await nextApiCall.checkoutLineItemsUpdate(payload);
      handleResponse(res);
      if (res?.checkout) return true;
      return false;
    },
    [toggleCheckoutLoading, handleResponse]
  );

  /* A callback function that is used to render the checkout. */
  const handleRender = useCallback(async () => {
    if (!checkout?.id) {
      const checkoutRes = await nextApiCall.getCheckout();
      handleResponse(checkoutRes);
    }
  }, [checkout?.id, handleResponse]);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  const values = useMemo(
    () => ({
      // States
      checkout,
      storageCheckoutKey,
      isCheckoutLoading,

      // Functions
      removeFromCheckout,
      handleQuantityChange,
      handleResponse,
      handleSetCheckout,
    }),
    [
      checkout,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleResponse,
    ]
  );

  return (
    <CheckoutContext.Provider value={values}>
      {children}
    </CheckoutContext.Provider>
  );
}
