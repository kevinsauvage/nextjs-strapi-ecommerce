import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import limitStrLength from '@/utils/limitStringLength';
import Modal from '@/components/Modal/Modal';
import ProductPresenter from '@/components/ProductPresenter/ProductPresenter';
import styles from './ProductCardDefault.module.scss';

export default function ProductCardDefault({ product, column }) {
  const { title, images, handle } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image] = useState(images[0]);

  const price = product?.variants?.[0]?.priceV2?.amount;
  const currencyCode = product?.variants?.[0]?.priceV2?.currencyCode;

  return (
    <>
      {isModalOpen && (
        <Modal handleClose={() => setIsModalOpen(false)}>
          <ProductPresenter product={product} />
        </Modal>
      )}

      <li className={`${styles.productCardDefault} ${column && styles.column}`}>
        <Link href={`/shop/${handle}`}>
          <a>
            <div className={styles.image}>
              <Image
                src={image?.src}
                layout="responsive"
                objectFit="cover"
                width={image?.width}
                height={image?.height}
              />
              <div
                className={styles.quickView}
                role="button"
                tabIndex="0"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsModalOpen(true);
                }}
              >
                Quick view
              </div>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>{limitStrLength(title, 40)}</p>
              <p className={styles.price}>
                <strong>
                  {price}
                  {currencyCode}
                </strong>
              </p>
            </div>
          </a>
        </Link>
      </li>
    </>
  );
}
