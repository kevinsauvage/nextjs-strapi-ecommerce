'use client';

import { useState } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { eye, heart } from '@/assets/svg';
import AbsoluteLoader from '@/components/_loaders/AbsoluteLoader/AbsoluteLoader';
import ModalProduct from '@/components/_modals/modalProduct/ModalProduct';
import ModalPortal from '@/components/ModalPortal/ModalPortal';
import Tooltip from '@/components/Tooltip/Tooltip';
import useUserContext from '@/contexts/UserContext/useUserContext';

import Price from '../Price/Price';

import styles from './ProductCardDefault.module.scss';

const isWhatPercentOf = (x, y) => (((x - y) / y) * 100).toFixed(0);

const ProductCardDefault = ({ product = {}, priority }) => {
  const { title, images, handle, variants, collections, productType, id } = product;
  const { priceV2, compareAtPriceV2 } = variants?.[0] || {};
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [selectedProduct, setSelectedProduct] = useState();

  const [loading, setLoading] = useState(false);
  const searchParameters = useSearchParams();

  const collectionSlug = searchParameters.get('collectionSlug');
  const collectionHandle = collectionSlug || collections?.[0]?.handle;
  const isWishlisted = userWishlist?.find((item) => item.id === id);

  const handleWishlist = async () => {
    setLoading(true);
    await handleSetWishlist(isWishlisted, product);
    setLoading(false);
  };

  return (
    <li className={styles.card}>
      {loading && <AbsoluteLoader />}
      <div className={styles.buttons}>
        <Tooltip text={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <button
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`${styles.wishlist} ${isWishlisted ? styles.active : ''}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handleWishlist();
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
        href={`/${productType}/${collectionSlug || collectionHandle}/${handle}`}
        aria-label={`View product details for ${title}`}
      >
        <div className={styles.image}>
          <Image
            src={images?.[0]?.medium}
            alt={images?.[0]?.alt || title}
            width={800}
            height={800}
            blurDataURL={images?.[0]?.blurDataURL}
            placeholder="blur"
            quality={20}
            priority={priority}
            aria-label={`Image of ${title}`}
          />
        </div>
        {compareAtPriceV2 && priceV2?.amount !== compareAtPriceV2?.amount && (
          <div className={styles.discount}>
            <p>{isWhatPercentOf(priceV2?.amount, compareAtPriceV2?.amount)}%</p>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.inner}>
            <div className={styles.header}>
              <b className={styles.title}>{title}</b>
            </div>
            <div className={styles.bottom}>
              <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="S" />
            </div>
          </div>
        </div>
      </Link>
      {selectedProduct && (
        <ModalPortal>
          <ModalProduct
            selectedProduct={selectedProduct}
            handleClose={() => setSelectedProduct()}
          />
        </ModalPortal>
      )}
    </li>
  );
};

export default ProductCardDefault;
