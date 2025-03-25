'use client';

import { createContext, useCallback, useMemo } from 'react';
import { redirect } from 'next/navigation';

import {
  removeProductFromWishListAction,
  setProductToWishListAction,
} from '@/actions/whishlistActions';

import { useToastContext } from '../ToastContext/NotificationContext';

export const UserContext = createContext();

export const UserProvider = ({ children, user, userWishlist }) => {
  const { showToast } = useToastContext();

  const handleSetWishlist = useCallback(
    async (isWishlisted, product) => {
      if (!user) {
        redirect('/login');
      }

      const response = await (isWishlisted
        ? removeProductFromWishListAction(userWishlist, product, user.id)
        : setProductToWishListAction(userWishlist, product, user.id));

      if (response?.success) {
        showToast.success(response.message);
      } else if (response?.message) {
        showToast.error(response.message);
      } else {
        showToast.error('Something went wrong');
      }
    },
    [user, userWishlist, showToast]
  );

  const values = useMemo(
    () => ({ handleSetWishlist, user, userWishlist }),
    [user, userWishlist, handleSetWishlist]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
