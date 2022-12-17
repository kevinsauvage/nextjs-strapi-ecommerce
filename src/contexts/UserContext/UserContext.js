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
  const { user, loading } = states || {};

  const toggleLoading = useCallback((loadingState) => {
    dispatch({ type: actions.CHANGE_LOADING, payload: loadingState });
  }, []);

  const handleError = useCallback((err) => {
    if (Array.isArray(err)) {
      return err.forEach((e) => toast.error(e.message));
    }
    return false;
  }, []);

  const handleRender = useCallback(async () => {
    const response = await nextApiCall.getCustomer();
    if (response?.customer?.id) {
      dispatch({ type: actions.ADD_USER, payload: response.customer });
    }
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  const values = useMemo(
    () => ({
      // States
      user,
      loading,

      // Functions
      toggleLoading,
      handleError,
      dispatch,
    }),
    [loading, user, toggleLoading, handleError, dispatch]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
