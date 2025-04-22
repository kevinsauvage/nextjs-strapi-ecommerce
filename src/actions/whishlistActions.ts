'use server';

import { adminSdk, storefrontSdk } from '@/shopify';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

const getMetafields = (
  wishlist: Array<ProductFieldsFragment> | ProductFieldsFragment | undefined,
  userId: string,
) => {
  const metafields = [
    {
      key: 'wishlist',
      namespace: 'custom',
      ownerId: userId,
      type: 'json',
      value: JSON.stringify(wishlist),
    },
  ];

  return { metafields };
};

export const setProductToWishListAction = async (
  wishlist: Array<ProductFieldsFragment>,
  product: ProductFieldsFragment,
  userId: string,
) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return;

  const isWishlist = wishlist?.some((production) => production.id === product.id);

  if (isWishlist) {
    return { error: true, message: 'Product already in wishlist' };
  }

  const newWishList = [...wishlist, product];

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await adminSdk().MetafieldsSet({ metafields });
  const errors = responseMetafield?.metafieldsSet?.userErrors;

  if (errors?.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong setting the product to the wishlist',
    };
  }

  const value = responseMetafield?.metafieldsSet?.metafields?.filter(
    (field) => field.key === 'wishlist',
  )?.[0]?.value;

  const parsed = value ? (JSON.parse(value) as ProductFieldsFragment[]) : undefined;

  if (parsed) {
    return {
      message: 'Product correctly added to wishlist',
      responseMetafield: parsed,
      success: true,
    };
  }

  return {
    error: true,
    message: "Couldn't add product to user wishlist",
  };
};

export const removeProductFromWishListAction = async (
  wishlist: Array<ProductFieldsFragment>,
  product: ProductFieldsFragment,
  userId: string,
) => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return { error: true, message: 'User not logged in' };

  const newWishList = wishlist?.filter((production) => production.id !== product?.id);

  const { metafields } = getMetafields(newWishList, userId);

  const responseMetafield = await adminSdk().MetafieldsSet({ metafields });

  const errors = responseMetafield?.metafieldsSet?.userErrors;

  if (errors?.length > 0) {
    console.error(errors);
    return {
      error: true,
      message: 'Something went wrong removing the product from the wishlist',
    };
  }

  const value = responseMetafield?.metafieldsSet?.metafields?.filter(
    (field) => field.key === 'wishlist',
  )?.[0]?.value;

  const parsed = value ? (JSON.parse(value) as ProductFieldsFragment[]) : undefined;

  if (parsed) {
    return {
      message: 'Product correctly removed from wishlist',
      responseMetafield: parsed,
      success: true,
    };
  }

  return {
    error: true,
    message: 'Something went wrong removing the product from the wishlist',
  };
};

[
  {
    availableForSale: true,
    collections: { edges: [Array] },
    descriptionHtml: `<p></p><p><span style="color: rgb(127, 127, 127); font-family: ">Product description:</span></p><p><span style="line-height: 21px; color: rgb(73, 68, 41); font-family: ">1. Brand: SMAEL</span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">2. Dual time shows with LED backlight function</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">3. 50M Water Resistant</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">4. Type: Men Sports Watches</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">5. Movement: Japan Original Digital Movement</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">6. There are 8 colors for selection</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">8. Band Width: (approx) 2.2cm</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">9. Dial Diameter: (approx) 5.5cm</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">10. Strap Material: Strong PU</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">11. Case Material: Strong Rubber + High Strength Hardened Glass</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">12. Clasp: Buckle</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">13. Showing precise time</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">14. It is good gift for someone special</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">Note: we suggest you not wear it when swim .but  if  you go to swim or dive , pls don't  press any button underwater!</span></span></span></p><p><strong style="font-family: ">Components Included:</strong></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">-1 x Genuine SMAEL Watch</span></span></span></p><p><span style="line-height: 18px; color: rgb(73, 68, 41);"><span style="line-height: 18px; font-family: "><span style="line-height: 21px; font-size: 14px;">-1 x Use Manual</span></span></span></p><p><img alt="英文_01" src="https://ae01.alicdn.com/kf/Hfb9b5e9a64394678aa5e7446be10744cB.jpg"><img alt="英文_02" src="https://ae01.alicdn.com/kf/Ha6ac9b0068f04a3895e6a0d8565193bdv.jpg"><img alt="英文_03" src="https://ae01.alicdn.com/kf/H6ebe688582a34415a3f4ae7289a666b3Z.jpg"><img alt="英文_04" src="https://ae01.alicdn.com/kf/Hb7ed5012839e47ec8beac86434901635M.jpg"><img alt="英文_05" src="https://ae01.alicdn.com/kf/He2ca51044cf1412f846da760db11ccabI.jpg"><img alt="英文_06" src="https://ae01.alicdn.com/kf/Hf17214b530dd4ddb911ab58437598aac4.jpg"><img alt="英文_07" src="https://ae01.alicdn.com/kf/Ha5b08cf0b5344dd6a7e7d330892c14b54.jpg"><img alt="英文_08" src="https://ae01.alicdn.com/kf/Ha46359fe699d4069ad35859ceca2e1586.jpg"><img alt="英文_09" src="https://ae01.alicdn.com/kf/H464a15087d844d6682ca590eb6f313adB.jpg"><img alt="英文_10" src="https://ae01.alicdn.com/kf/Hc7c239d4768f4685aa78eb536f30496c3.jpg"><img alt="英文_11" src="https://ae01.alicdn.com/kf/H80c613c95f2d45f0be0a54aa3c96112b1.jpg"><img alt="英文_12" src="https://ae01.alicdn.com/kf/H02c574e5359c4b7ebaa6ecb4668d3b62R.jpg"><img alt="英文_14" src="https://ae01.alicdn.com/kf/Hba1f6878116d40d1b11d828c2f4c4b92I.jpg"><img alt="英文_15" src="https://ae01.alicdn.com/kf/Hf972bd8690eb4dfeb22e70a74630f645d.jpg"></p><p></p><p><br></p>`,
    handle: 'smael-8026-top',
    id: 'gid://shopify/Product/8097695826218',
    images: { edges: [Array] },
    metafields: [],
    options: [[Object]],
    priceRange: { maxVariantPrice: [Object], minVariantPrice: [Object] },
    productType: 'men',
    tags: ['best', 'casual', 'men', 'new', 'sports'],
    title: 'SMAEL 8026 Top',
    totalInventory: 31_869,
    variants: { edges: [Array] },
    vendor: 'eprolo',
  },
];

export const getWishlistAction = async (): Promise<ProductFieldsFragment[]> => {
  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) return [];

  const wishlistResponse = await storefrontSdk().getCustomerMetafields({
    customerAccessToken: shopifyToken,
    metafields: [{ key: 'wishlist', namespace: 'custom' }],
  });

  const metafields = wishlistResponse?.customer?.metafields;
  const wishlist = metafields?.[0]?.value;

  if (typeof wishlist === 'string') {
    return JSON.parse(wishlist) as ProductFieldsFragment[];
  }
  return [];
};
