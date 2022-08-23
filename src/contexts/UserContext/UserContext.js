import { useRouter } from 'next/router';
import { createContext, useMemo, useReducer } from 'react';
import nextApiCall from '../../utils/apiNext';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const router = useRouter();

  const values = useMemo(
    () => ({
      user: states.user,

      addUser: (payload) => dispatch({ type: actions.ADD_USER, payload }),

      login: async (payload) => {
        const res = await nextApiCall.auth.login(payload);
        if (res && res.ok) {
          dispatch({ type: actions.LOG_IN, payload: res.data });
          router.push('/profile');
        } else {
          // handle error here
        }
      },

      logOut: async () => {
        const res = await nextApiCall.auth.logout();
        if (res && res.ok) {
          dispatch({ type: actions.LOG_OUT });
          router.push('/');
        } else {
          // handle error here
        }
      },
    }),
    [states]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
