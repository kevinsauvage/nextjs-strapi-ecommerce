import Image from 'next/image';
import { useState } from 'react';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ items, handleSelect, selected }) {
  return (
    <div className={styles.container}>
      <div className={styles.selected}>
        <Image
          src={selected.image.src}
          alt={selected}
          width={selected.image.width}
          height={selected.image.height}
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
