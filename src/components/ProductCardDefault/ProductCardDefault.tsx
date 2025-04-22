'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { eye, heart } from '@/assets/svg';
import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';
import ModalPortal from '@/components/ModalPortal/ModalPortal';
import Tooltip from '@/components/Tooltip/Tooltip';
import useUserContext from '@/contexts/UserContext/useUserContext';
import type { ProductFieldsFragment } from '@/shopify/storefront';

import Price from '../Price/Price';

import styles from './ProductCardDefault.module.scss';

const isWhatPercentOf = (x: number, y: number) => (((x - y) / y) * 100).toFixed(0);

const ProductCardDefault = ({
  product,
  priority,
}: {
  product: ProductFieldsFragment;
  priority: boolean;
}) => {
  const { title, images, handle, variants, collections, productType, id } = product;
  const { price, compareAtPrice } = variants?.edges?.[0]?.node || {};
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [selectedProduct, setSelectedProduct] = useState<ProductFieldsFragment | undefined>();

  const [loading, setLoading] = useState(false);

  const productImages =
    (images?.edges?.map((image) => image.node) as unknown as ImageFields[]) || [];

  const collectionHandle = collections?.edges?.[0]?.node?.handle;
  const isWishlisted = userWishlist?.find((item) => item.id === id);

  const handleWishlist = async () => {
    setLoading(true);
    await handleSetWishlist(!!isWishlisted, product);
    setLoading(false);
  };

  return (
    <li className={styles.card}>
      {loading && <AbsoluteLoader text="Loading..." />}
      <div className={styles.buttons}>
        <Tooltip text={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <button
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`${styles.wishlist} ${isWishlisted ? styles.active : ''}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handleWishlist().catch(() => {
                setLoading(false);
              });
            }}
          >
            {heart}
          </button>
        </Tooltip>
        <Tooltip text="Quick view">
          <button
            className={styles['quick-view']}
            type="button"
            aria-label="Quick view"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setSelectedProduct(product);
            }}
          >
            {eye}
          </button>
        </Tooltip>
      </div>
      <Link
        className={styles.link}
        href={`/${productType}/${collectionHandle}/${handle}`}
        aria-label={`View product details for ${title}`}
      >
        <div className={styles.image}>
          <Image
            src={productImages?.[0]?.medium || ''}
            alt={productImages?.[0]?.altText || title}
            width={800}
            height={800}
            placeholder="blur"
            blurDataURL={productImages?.[0]?.blurDataURL || ''}
            quality={20}
            priority={priority}
            aria-label={`Image of ${title}`}
          />
        </div>
        {compareAtPrice && price?.amount !== compareAtPrice?.amount && (
          <div className={styles.discount}>
            <p>{isWhatPercentOf(Number(price?.amount), Number(compareAtPrice?.amount))}%</p>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.inner}>
            <div className={styles.header}>
              <b className={styles.title}>{title}</b>
            </div>
            <div className={styles.bottom}>
              <Price compareAtPrice={compareAtPrice} price={price} size="S" />
            </div>
          </div>
        </div>
      </Link>
      {selectedProduct && (
        <ModalPortal>
          <ModalProduct
            selectedProduct={selectedProduct}
            // eslint-disable-next-line unicorn/no-null
            handleClose={() => setSelectedProduct(null)}
          />
        </ModalPortal>
      )}
    </li>
  );
};

export default ProductCardDefault;
