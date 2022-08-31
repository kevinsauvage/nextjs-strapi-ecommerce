import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import limitStrLength from '../../utils/limitStringLength';
import styles from './ProductCardDefault.module.scss';
import Modal from '../Modal/Modal';
import ProductPresenter from '../ProductPresenter/ProductPresenter';

export default function ProductCardDefault({ product }) {
  const { title, images, description, handle } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <Modal>
          <ProductPresenter product={product} />
        </Modal>
      )}

      <li className={styles.productCardDefault}>
        <div
          role="button"
          tabIndex="0"
          className={styles.image}
          onClick={() => {
            setIsModalOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsModalOpen(true);
          }}
        >
          <Image src={images[0]?.src} layout="fill" objectFit="contain" />
        </div>
        <Link href={`/shop/${handle}`}>
          <a>
            <div className={styles.content}>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>
                {limitStrLength(description, 100)}
              </p>
            </div>
          </a>
        </Link>
      </li>
    </>
  );
}
