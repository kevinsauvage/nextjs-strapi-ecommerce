'use client';

import Image from 'next/image';
import Link from 'next/link';

import { remove } from '@/assets/svg';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import { Row, TData } from '@/components/Table/Table';
import Tooltip from '@/components/Tooltip/Tooltip';
import useCartContext from '@/contexts/CartContext/useCartContext';

import styles from './CartItem.module.scss';

const CartItem = ({ item }) => {
  const { handleQuantityChange, removeFromCart } = useCartContext();

  const { merchandise, quantity, id } = item || {};
  const { priceV2, product, title: variantTitle, image, quantityAvailable } = merchandise || {};
  const { title, handle, collections, productType } = product || {};

  const totalPrice = Number(priceV2?.amount) * Number(quantity);

  return (
    <Row>
      <TData>
        <div className={styles.list}>
          <div className={styles.image}>
            <Image
              src={image.medium}
              alt={image.alt || variantTitle}
              width={image.width}
              height={image.height}
            />
          </div>
          <div className={styles.content}>
            <Link
              className={styles.link}
              href={`/${productType}/${collections?.nodes?.[0]?.handle}/${handle}`}
            >
              <b className={styles.title}>{title}</b>
            </Link>
            <p>{variantTitle}</p>
          </div>
        </div>
      </TData>
      <TData>
        <span className={styles.price}>
          {priceV2?.amount}
          {priceV2?.currencyCode}
        </span>
      </TData>
      <TData>
        <QuantityUpdater
          showTitle={false}
          originalQuantity={quantity}
          quantityAvailable={quantityAvailable}
          onChange={(newQuantity) => handleQuantityChange(id, newQuantity)}
        />
      </TData>
      <TData>
        <span className={styles.subtotal}>
          {totalPrice.toFixed(2)}
          {priceV2?.currencyCode}
        </span>
      </TData>
      <TData>
        <Tooltip text="Remove from cart">
          <button type="button" className={styles.button} onClick={() => removeFromCart(id)}>
            {remove}
          </button>
        </Tooltip>
      </TData>
    </Row>
  );
};

export default CartItem;
