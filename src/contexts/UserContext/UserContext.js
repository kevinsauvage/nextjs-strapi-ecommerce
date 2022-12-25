import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders } = states || {};

  /* A function that is called when an error occurs. */
  const handleError = useCallback((err) => {
    if (Array.isArray(err)) {
      return err.forEach((e) => toast.error(e.message));
    }
    return false;
  }, []);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        if (user?.id) return;
        const res = await nextApiCall.getCustomer();
        if (res && res?.customer?.id) {
          dispatch({ type: actions.ADD_USER, payload: res.customer });
        } else throw new Error();
      } catch (e) {
        toast.error('Something went wrong, please try again later');
      }
    };
    getCustomer();
  }, [dispatch, user]);

  const values = useMemo(
    () => ({
      // States
      user,
      addresses,
      orders,

      // Functions
      handleError,
      dispatch,
    }),
    [user, handleError, dispatch, addresses, orders]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
