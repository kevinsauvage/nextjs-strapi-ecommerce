import Image from 'next/image';
import Loader from '@/layout/Loader/Loader';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ selectedVariant }) {
  return (
    <div className={styles.container}>
      {selectedVariant?.id ? (
        <Image
          src={selectedVariant?.image?.src}
          alt={selectedVariant?.image?.alt || selectedVariant?.title}
          width={selectedVariant?.image?.width}
          height={selectedVariant?.image?.height}
          layout="responsive"
          objectFit="contain"
          priority
          blurDataURL={selectedVariant?.image?.blurDataURL}
          placeholder="blur"
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}
