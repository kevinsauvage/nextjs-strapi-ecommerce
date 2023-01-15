import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import nextApiCall from '@/utils/apiNext';
import config from '@/config/index';
import { useRouter } from 'next/router';
import { UserReducer, initialState, actions } from './UserReducer';
import useCheckoutContext from '../CheckoutContext/useCheckoutContext';
import { useToastContext } from '../ToastContext/NotificationContext';
import useGlobalContext from '../GlobalContext/useGlobalContext';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders } = states || {};
  const { showToast } = useToastContext();
  const { toggleLoading } = useGlobalContext();
  const { handleSetCheckout } = useCheckoutContext();
  const { reload } = useRouter();

  /* A function that is called when an error occurs. */
  const handleError = useCallback(
    (err) => {
      if (Array.isArray(err)) {
        return err.forEach((e) => showToast.error(e.message));
      }
      return false;
    },
    [showToast]
  );

  const handleSetCheckoutShippingAddress = useCallback(
    async (customer) => {
      if (!customer.defaultAddress) return;
      const {
        defaultAddress: {
          address1,
          address2,
          city,
          company,
          country,
          firstName,
          lastName,
          phone,
          province,
          zip,
        },
      } = customer || {};

      const payload = {
        address1,
        address2,
        city,
        company,
        country,
        firstName,
        lastName,
        phone,
        province,
        zip,
      };
      const res = await nextApiCall.checkoutUpdateShippingAddress({
        shippingAddress: payload,
      });

      if (res?.checkout) {
        handleSetCheckout(res.checkout);
      } else {
        console.error(
          "Couldn't associate default address to checkout res>>>",
          res
        );
      }
    },
    [handleSetCheckout]
  );

  const logout = useCallback(async () => {
    toggleLoading(true);
    const res = await nextApiCall.logout();
    toggleLoading(false);
    if (res?.ok) {
      return reload();
    }
    return showToast.error(config.userFeedback.logout.error);
  }, [reload, showToast, toggleLoading]);

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return;
      console.log('get customer call');
      const res = await nextApiCall.getCustomer();

      if (res && res?.customer?.id) {
        dispatch({ type: actions.ADD_USER, payload: res.customer });
        handleSetCheckoutShippingAddress(res.customer);
      } else {
        console.log('logout call');
        logout();
      }
    };
    getCustomer();
  }, [dispatch, user, handleSetCheckoutShippingAddress, showToast, logout]);

  const values = useMemo(
    () => ({
      // States
      user,
      addresses,
      orders,

      // Functions
      handleError,
      dispatch,
      logout,
    }),
    [user, handleError, dispatch, addresses, orders, logout]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
