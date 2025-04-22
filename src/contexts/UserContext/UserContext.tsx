'use client';

import { createContext, useCallback, useMemo } from 'react';
import { redirect } from 'next/navigation';

import {
  removeProductFromWishListAction,
  setProductToWishListAction,
} from '@/actions/whishlistActions';
import type { GetCustomerQuery, ProductFieldsFragment } from '@/shopify/storefront';

import { useToastContext } from '../ToastContext/NotificationContext';

export const UserContext = createContext({
  handleSetWishlist: async (_isWishlisted: boolean, _product: ProductFieldsFragment) => {
    // noop
  },
  user: undefined as GetCustomerQuery['customer'] | null,
  userWishlist: [] as Array<ProductFieldsFragment>,
});

export const UserProvider = ({
  children,
  user,
  userWishlist = [],
}: {
  children: React.ReactNode;
  user: GetCustomerQuery['customer'] | null;
  userWishlist: Array<ProductFieldsFragment>;
}) => {
  const { showToast } = useToastContext();

  const handleSetWishlist = useCallback(
    async (isWishlisted: boolean, product: ProductFieldsFragment) => {
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
    [user, userWishlist, showToast],
  );

  const values = useMemo(
    () => ({ handleSetWishlist, user, userWishlist }),
    [user, userWishlist, handleSetWishlist],
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
