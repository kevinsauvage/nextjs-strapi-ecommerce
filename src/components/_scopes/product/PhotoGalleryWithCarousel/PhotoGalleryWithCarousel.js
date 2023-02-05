import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import styles from './PhotoGalleryWithCarousel.module.scss';

export default function PhotoGalleryWithCarousel({
  selectedVariant,
  variants = [],
  handleSetSelectedProductOption,
}) {
  return (
    <div className={styles.container}>
      {selectedVariant?.id && (
        <div className={styles.selectedImage}>
          <Image
            className={styles.image}
            src={selectedVariant?.image?.large}
            alt={selectedVariant?.image?.altText || selectedVariant?.title}
            width={selectedVariant?.image?.width}
            height={selectedVariant?.image?.height}
            quality={50}
            priority
          />
        </div>
      )}
      <Carousel itemToShow={5} showButtons spacing={0}>
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            className={`${styles.item} ${
              variant?.image?.src === selectedVariant?.image?.src ? styles.selected : ''
            }`}
            onClick={() => handleSetSelectedProductOption(variant.selectedOptions)}
          >
            <Image
              src={variant?.image?.small}
              alt={variant?.image?.altText || selectedVariant?.title}
              width={variant?.image?.width}
              height={variant?.image?.height}
              quality={10}
              className={styles.image}
            />
          </button>
        ))}
      </Carousel>
    </div>
  );
}
