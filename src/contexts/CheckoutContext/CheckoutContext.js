import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  createCheckout,
  getCheckoutById,
  addLinesToCheckout,
  updateLines,
  removeLinesFromCheckout,
} from '@/lib/shopify/checkout/checkoutApiCall';
import config from '@/config/index';
import { CheckoutReducer, initialState, actions } from './CheckoutReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import { useToastContext } from '../ToastContext/NotificationContext';

const {
  userFeedback,
  localStorageKeys: { checkoutIdSorageKey },
} = config;

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [states, dispatch] = useReducer(CheckoutReducer, initialState);
  const { checkout, isCheckoutLoading } = states;
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const handleSetCheckout = useCallback((payload) => dispatch({ type: actions.ADD_CHECKOUT, payload }), []);

  const removeFromCheckout = useCallback(
    async (lineItemId) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      const checkoutIdStorage = window.localStorage.getItem(checkoutIdSorageKey);
      if (!checkoutIdStorage) return console.error('Missing checkout id storage');

      toggleLoading(true);
      const removeLinesRes = await removeLinesFromCheckout(checkoutIdStorage, [lineItemId]);
      toggleLoading(false);

      if (removeLinesRes?.id) {
        showToast.success(userFeedback.removeLinesFromCheckout.success);
        return handleSetCheckout(removeLinesRes);
      }

      console.error('Error removing lines from checkout');
      return showToast.error(userFeedback.removeLinesFromCheckout.error);
    },
    [handleSetCheckout, showToast, toggleLoading]
  );

  const handleQuantityChange = useCallback(
    async (lineItems, successCallback) => {
      if (!lineItems) return console.error('Missing line items to update');

      const checkoutIdStorage = window.localStorage.getItem(checkoutIdSorageKey);
      if (!checkoutIdStorage) return console.error('Missing checkout id storage');

      toggleLoading(true);

      const updateLinesRes = await updateLines(checkoutIdStorage, lineItems);

      toggleLoading(false);

      if (updateLinesRes?.id) {
        if (successCallback) successCallback();
        showToast.success(userFeedback.updateLines.success);
        return handleSetCheckout(updateLinesRes);
      }
      return showToast.error(userFeedback.updateLines.error);
    },
    [handleSetCheckout, showToast, toggleLoading]
  );

  const handleAddToCheckout = useCallback(
    async (variantId, quantity) => {
      const checkoutIdStorage = window.localStorage.getItem(checkoutIdSorageKey);

      if (!checkoutIdStorage) {
        console.error('Missing checkout id storage');
        return;
      }

      if (quantity > 0 && variantId) {
        toggleLoading(true);
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }];
        const addLineResponse = await addLinesToCheckout(checkoutIdStorage, lineItemsToAdd);

        if (addLineResponse?.id) {
          dispatch({ type: actions.ADD_CHECKOUT, payload: addLineResponse });
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

  useEffect(() => {
    const handleRender = async () => {
      if (!checkout?.id) {
        const checkoutIdStorage = window.localStorage.getItem(checkoutIdSorageKey);
        console.time('handleRender checkoutContext:');

        if (checkoutIdStorage) {
          const getCheckoutRes = await getCheckoutById(checkoutIdStorage);
          console.timeEnd('handleRender checkoutContext:');

          // Checkout already paid, create a new checkout
          if (getCheckoutRes?.orderStatusUrl || !getCheckoutRes?.id) {
            const createCheckoutRes = await createCheckout({});
            if (createCheckoutRes.id) {
              window.localStorage.setItem(checkoutIdSorageKey, createCheckoutRes.id);
              handleSetCheckout(createCheckoutRes);
              return;
            }
            console.error('Create checkout failed');
          } else {
            handleSetCheckout(getCheckoutRes);
            return;
          }
          console.warn('Checkout already paid, creating new checkout');
        }

        if (!checkoutIdStorage) {
          const createCheckoutRes = await createCheckout({});
          if (createCheckoutRes.id) {
            window.localStorage.setItem(checkoutIdSorageKey, createCheckoutRes.id);
            handleSetCheckout(createCheckoutRes);
            return;
          }
          console.error('Create checkout failed');
        }
      }
    };
    handleRender();
  }, [checkout?.id, handleSetCheckout]);

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
