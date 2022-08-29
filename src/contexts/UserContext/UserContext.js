import { useRouter } from 'next/router';
import { createContext, useMemo, useReducer } from 'react';
import routes from '../../data/routes';
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

      register: async (userData) => {
        const res = await nextApiCall.auth.register(userData);
        if (res && res.ok) {
          dispatch({ type: actions.ADD_USER, payload: res.data });
          router.push(routes.base.profile);
        } else {
          // handle error here
        }
      },

      login: async (payload) => {
        const res = await nextApiCall.auth.login(payload);
        if (res && res.ok) {
          dispatch({ type: actions.ADD_USER, payload: res.data });
          router.push(routes.base.profile);
        } else {
          // handle error here
        }
      },

      logOut: async () => {
        const res = await nextApiCall.auth.logout();
        if (res && res.ok) {
          dispatch({ type: actions.REMOVE_USER });
          router.push(routes.base.home);
        } else {
          // handle error here
        }
      },
    }),
    [states]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
