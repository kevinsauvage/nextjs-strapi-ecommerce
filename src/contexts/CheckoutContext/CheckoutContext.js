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
  associateCustomerToCheckout,
  getCheckoutById,
  addLinesToCheckout,
  removeLinesFromCheckout,
} from '@/lib/shopify/checkout/checkoutApiCall';
import localStorageHelper from '@/helpers/localStorageHelper';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import useUserContext from '../UserContext/useUserContext';
import userFeedbacks from './CheckoutUserFeedback';

export const CheckoutContext = createContext();

const storageCheckoutKey = 'checkoutId';

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;
  const { toggleCheckout } = useGlobalContext();
  const { token } = useUserContext();

  const toggleLoading = useCallback((state) => {
    dispatch({ type: 'IS_CHECKOUT_LOADING', payload: state });
  }, []);

  const handleResponse = useCallback(
    (res, userFeedback, toggle = true) => {
      toggleLoading(false);

      if (res?.checkout?.id) {
        if (toggle) toggleCheckout();
        dispatch({ type: actions.ADD_CHECKOUT, payload: res.checkout });
        if (userFeedback?.success) toast.success(userFeedback.success);
        return;
      }
      if (userFeedback?.error) toast.error(userFeedback.error);
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
      handleResponse(res, userFeedbacks.addLinesToCheckout);
    },
    [handleResponse, toggleLoading]
  );

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
      const res = await removeLinesFromCheckout(checkoutId, [lineItemId]);
      handleResponse(res, userFeedbacks.removeLinesFromCheckout);
    },
    [toggleLoading, handleResponse]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      const res = await updateLines(checkoutId, lineItemsToUpdate);
      handleResponse(res, userFeedbacks.updateLines);
    },
    [toggleLoading, handleResponse]
  );

  const handleCreateCheckout = useCallback(async () => {
    const res = await createCheckout({});
    if (!res) return;
    if (res?.checkout?.id) {
      handleResponse(res, null, false);
      localStorageHelper.setValue(storageCheckoutKey, res.checkout.id);
    }
  }, [handleResponse]);

  const handleGetCheckout = useCallback(
    async (id) => {
      const res = await getCheckoutById(id);
      if (!res) return;
      if (res?.checkout?.orderStatusUrl) handleCreateCheckout();
      else handleResponse(res, null, false);
    },
    [handleResponse, handleCreateCheckout]
  );

  const handleAssociateCustomer = useCallback(async () => {
    const checkoutId = localStorageHelper.getValue(storageCheckoutKey);
    if (token?.value && checkoutId && !checkout?.email) {
      const res = await associateCustomerToCheckout(checkoutId, token.value);
      handleResponse(res, null, false);
    }
  }, [checkout?.email, handleResponse, token?.value]);

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

  useEffect(() => {
    handleAssociateCustomer();
  }, [handleAssociateCustomer]);

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
