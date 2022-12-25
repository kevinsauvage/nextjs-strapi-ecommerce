import { createContext, useCallback, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, loading, addresses, orders } = states || {};

  /* A function that is called when the component is mounted. */
  const toggleLoading = useCallback((loadingState) => {
    dispatch({ type: actions.CHANGE_LOADING, payload: loadingState });
  }, []);

  /* A function that is called when an error occurs. */
  const handleError = useCallback((err) => {
    if (Array.isArray(err)) {
      return err.forEach((e) => toast.error(e.message));
    }
    return false;
  }, []);

  const values = useMemo(
    () => ({
      // States
      user,
      loading,
      addresses,
      orders,

      // Functions
      toggleLoading,
      handleError,
      dispatch,
    }),
    [loading, user, toggleLoading, handleError, dispatch, addresses, orders]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
