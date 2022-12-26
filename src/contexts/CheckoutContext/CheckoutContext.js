import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { toast } from 'react-toastify';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';

const { userFeedback } = config;

export const CheckoutContext = createContext();

const storageCheckoutKey = 'checkoutId';

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;
  const { toggleCheckout, toggleLoading } = useGlobalContext();

  /* A callback function that is used to handle the response of the API call. */
  const handleResponse = useCallback(
    (res, feedBack, toggle = true) => {
      toggleLoading(false);

      if (res?.checkout?.id) {
        if (toggle) toggleCheckout();
        dispatch({ type: actions.ADD_CHECKOUT, payload: res.checkout });
        if (feedBack?.success) toast.success(feedBack.success);
        return;
      }
      if (feedBack?.error) toast.error(feedBack.error);
    },
    [toggleLoading, toggleCheckout]
  );

  /* A callback function that is used to remove a line item from the checkout. */
  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const res = await nextApiCall.removeLinesFromCheckout(lineItemId);
      handleResponse(res, userFeedback.removeLinesFromCheckout, false);
    },
    [toggleLoading, handleResponse]
  );

  /* A callback function that is used to update the quantity of a line item in the checkout. */
  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const res = await nextApiCall.checkoutLineItemsUpdate({ quantity }, id);
      handleResponse(res, userFeedback.updateLines, false);
    },
    [toggleLoading, handleResponse]
  );

  /* A callback function that is used to render the checkout. */
  const handleRender = useCallback(async () => {
    if (!checkout?.id) {
      const checkoutRes = await nextApiCall.getCheckout();
      if (checkoutRes) handleResponse(checkoutRes, null, false);
    }
  }, [handleResponse, checkout]);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  const values = useMemo(
    () => ({
      // States
      checkout,
      isCheckoutLoading,
      storageCheckoutKey,

      // Functions
      removeFromCheckout,
      handleQuantityChange,
      handleResponse,
      toggleLoading,
    }),
    [
      checkout,
      isCheckoutLoading,
      removeFromCheckout,
      handleQuantityChange,
      handleResponse,
      toggleLoading,
    ]
  );

  return (
    <CheckoutContext.Provider value={values}>
      {children}
    </CheckoutContext.Provider>
  );
}
