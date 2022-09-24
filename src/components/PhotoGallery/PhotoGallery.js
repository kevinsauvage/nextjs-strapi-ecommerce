import Image from 'next/image';
import Loader from '../Loader/Loader';
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
          objectFit="cover"
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
