import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { toast } from 'react-toastify';
import {
  createCheckout,
  updateLines,
  getCheckoutById,
  addLinesToCheckout,
  removeLinesFromCheckout,
} from '@/lib/shopify/checkout/checkoutApiCall';
import localStorageHelper from '@/helpers/localStorageHelper';
import config from '@/config/index';
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

  const addToCheckout = useCallback(
    async (variantId, quantity) => {
      const checkoutId = localStorageHelper.getValue(storageCheckoutKey);

      if (!checkoutId) return;
      const lineItemsToAdd = [
        {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      ];
      toggleLoading(true);
      const res = await addLinesToCheckout(checkoutId, lineItemsToAdd);
      handleResponse(res, userFeedback.addLinesToCheckout);
    },
    [handleResponse, toggleLoading]
  );

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
      const res = await removeLinesFromCheckout(checkoutId, [lineItemId]);
      handleResponse(res, userFeedback.removeLinesFromCheckout, false);
    },
    [toggleLoading, handleResponse]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      const res = await updateLines(checkoutId, lineItemsToUpdate);
      handleResponse(res, userFeedback.updateLines);
    },
    [toggleLoading, handleResponse]
  );

  const handleCreateCheckout = useCallback(async () => {
    console.log('%c create checkout', 'color: yellow; font-size: 20px;');
    const res = await createCheckout({});
    if (!res) return;
    if (res?.checkout?.id) {
      handleResponse(res, null, false);
      localStorageHelper.setValue(storageCheckoutKey, res.checkout.id);
    }
  }, [handleResponse]);

  const handleGetCheckout = useCallback(
    async (id) => {
      console.log('%c get checkout', 'color: yellow; font-size: 20px;');
      const res = await getCheckoutById(id);
      if (!res) return;
      if (res?.checkout?.orderStatusUrl) handleCreateCheckout();
      else handleResponse(res, null, false);
    },
    [handleResponse, handleCreateCheckout]
  );

  const handleRender = useCallback(async () => {
    const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
    if (checkoutId && !checkout) {
      await handleGetCheckout(checkoutId);
    } else if (!checkoutId && !checkout) {
      await handleCreateCheckout();
    }
  }, [checkout, handleCreateCheckout, handleGetCheckout]);

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
      addToCheckout,
      removeFromCheckout,
      handleQuantityChange,
      handleResponse,
    }),
    [
      checkout,
      isCheckoutLoading,
      addToCheckout,
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
