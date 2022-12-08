import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';

import {
  createCheckout,
  updateLines,
  associateCustomerToCheckout,
  getCheckoutById,
  addLinesToCheckout,
  removeLinesFromCheckout,
} from '@/lib/shopify/checkout/checkoutApiCall';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import useUserContext from '../UserContext/useUserContext';

export const CheckoutContext = createContext();

const userFeedbacks = {
  removeLinesFromCheckout: {
    success: 'Item correctly removed from the cart',
    error:
      'Something went wrong removing the item from the cart, please try again',
  },
  addLinesToCheckout: {
    success: 'Item correctly added to the cart',
    error: 'Something went wrong adding the item to the cart, please try again',
  },
  updateLines: {
    success: 'Item correctly updated in the cart',
    error:
      'Something went wrong updating the item in the cart, please try again',
  },
};

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const [checkoutId, setCheckoutId, remove] = useLocalStorage('checkoutId', '');
  const { token } = useUserContext();
  const { toggleCheckout } = useGlobalContext();
  const { checkout, isCheckoutLoading } = states;

  const toggleLoading = useCallback((state) => {
    dispatch({ type: 'IS_CHECKOUT_LOADING', payload: state });
  }, []);

  const handleResponse = useCallback(
    (res, userFeedback, toggle = true) => {
      toggleLoading(false);
      if (!res?.checkout && userFeedback?.error.length) {
        return toast.error(`${userFeedback?.error}`);
      }

      if (userFeedback?.success) toast.success(userFeedback.success);

      if (toggle) toggleCheckout();
      return dispatch({ type: actions.ADD_CHECKOUT, payload: res.checkout });
    },
    [toggleLoading, toggleCheckout]
  );

  const addToCheckout = useCallback(
    async (variantId, quantity) => {
      if (!checkoutId) return;
      const lineItemsToAdd = [
        {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      ];
      toggleLoading(true);
      const res = await addLinesToCheckout(checkoutId, lineItemsToAdd);
      handleResponse(res, userFeedbacks.addLinesToCheckout);
    },
    [checkoutId, handleResponse, toggleLoading]
  );

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const res = await removeLinesFromCheckout(checkoutId, [lineItemId]);
      handleResponse(res, userFeedbacks.removeLinesFromCheckout);
    },
    [toggleLoading, handleResponse, checkoutId]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      const res = await updateLines(checkoutId, lineItemsToUpdate);
      handleResponse(res, userFeedbacks.updateLines);
    },
    [toggleLoading, checkoutId, handleResponse]
  );

  const handleCreateCheckout = useCallback(async () => {
    if (!window.localStorage.getItem('checkoutId') && !checkout) {
      const res = await createCheckout({});
      if (res?.id) {
        handleResponse(res, null, false);
        setCheckoutId(res.id);
      }
    }
  }, [checkout, handleResponse, setCheckoutId]);

  const handleGetCheckout = useCallback(async () => {
    console.log('handlegetchecout ', 'id:', checkoutId, 'checkout: ', checkout);
    if (checkoutId && !checkout) {
      const res = await getCheckoutById(checkoutId);
      if (res?.checkout?.orderStatusUrl) {
        remove();
        dispatch({ type: actions.REMOVE_CHECKOUT });
        await handleCreateCheckout();
      } else {
        handleResponse(res, null, false);
      }
    }
  }, [checkoutId, checkout, handleResponse, remove, handleCreateCheckout]);

  useEffect(() => {
    handleGetCheckout();
  }, [handleGetCheckout]);

  useEffect(() => {
    if (token?.value && checkoutId && !checkout?.email) {
      associateCustomerToCheckout(checkoutId, token.value);
    }
  }, [token, checkoutId, checkout?.email]);

  useEffect(() => {
    handleCreateCheckout();
  }, [handleCreateCheckout]);

  const values = useMemo(
    () => ({
      // States
      checkout,
      isCheckoutLoading,

      // Functions
      addToCheckout,
      removeFromCheckout,
      handleQuantityChange,
    }),
    [
      checkout,
      isCheckoutLoading,
      addToCheckout,
      removeFromCheckout,
      handleQuantityChange,
    ]
  );

  return (
    <CheckoutContext.Provider value={values}>
      {children}
    </CheckoutContext.Provider>
  );
}
