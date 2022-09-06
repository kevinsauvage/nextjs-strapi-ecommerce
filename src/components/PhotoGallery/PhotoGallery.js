import Image from 'next/image';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ items, selectedVariant, handleSelect }) {
  return (
    <div className={styles.container}>
      <div className={styles.selected}>
        <Image
          src={selectedVariant.image.src}
          alt={selectedVariant}
          width={selectedVariant.image.width}
          height={selectedVariant.image.height}
          layout="responsive"
        />
      </div>
      <ul className={styles.gallery}>
        {items &&
          items.map((item) => {
            const { width, height, src } = item.image;
            return (
              <button
                type="button"
                className={styles.item}
                key={item.id}
                onClick={() => handleSelect(item)}
                onKeyDown={() => handleSelect(item)}
              >
                <Image
                  src={src}
                  alt={item.title}
                  layout="responsive"
                  width={width}
                  height={height}
                />
              </button>
            );
          })}
      </ul>
    </div>
  );
}
