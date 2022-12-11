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
  const { toggleCheckout } = useGlobalContext();

  const toggleLoading = useCallback((state) => {
    dispatch({ type: 'IS_CHECKOUT_LOADING', payload: state });
  }, []);

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

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const res = await nextApiCall.removeLinesFromCheckout({ lineItemId });
      handleResponse(res, userFeedback.removeLinesFromCheckout, false);
    },
    [toggleLoading, handleResponse]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const res = await nextApiCall.checkoutLineItemsUpdate({ id, quantity });
      handleResponse(res, userFeedback.updateLines);
    },
    [toggleLoading, handleResponse]
  );

  const handleRender = useCallback(async () => {
    if (!checkout?.id) {
      const checkoutRes = await nextApiCall.getCheckout();
      if (checkoutRes) handleResponse(checkoutRes, null, false);
      console.log(checkoutRes, 'handleRender checkout res');
    }
  }, [handleResponse, checkout]);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    console.log(checkout);
  }, [checkout]);

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
