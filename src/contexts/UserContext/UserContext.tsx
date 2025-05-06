'use client';

import { createContext, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  removeProductFromWishListAction,
  setProductToWishListAction,
} from '@/actions/whishlistActions';
import type { GetCustomerQuery, ProductFieldsFragment } from '@/shopify/storefront';

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
  const router = useRouter();
  const pathname = usePathname();
  const handleSetWishlist = useCallback(
    async (isWishlisted: boolean, product: ProductFieldsFragment) => {
      if (!user) {
        toast.info('You need to login to add products to your wishlist');
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      const response = await (isWishlisted
        ? removeProductFromWishListAction(userWishlist, product, user.id)
        : setProductToWishListAction(userWishlist, product, user.id));

      if (response?.success) {
        toast.success(response.message);
      } else if (response?.message) {
        toast.error(response.message);
      } else {
        toast.error('Something went wrong');
      }
    },
    [user, userWishlist],
  );

  const values = useMemo(
    () => ({ handleSetWishlist, user, userWishlist }),
    [user, userWishlist, handleSetWishlist],
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
