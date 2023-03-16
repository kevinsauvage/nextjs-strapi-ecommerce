import { useEffect, useState } from 'react';
import Image from 'next/legacy/image';

import { arrowLeft2, arrowRight2 } from '@/assets/svg';

import styles from './PhotoSlider.module.scss';

const PhotoSlider = ({ variants, selectedVariant }) => {
  const [selected, setSelected] = useState({});
  const [index, setIndex] = useState(0);

  const { image: selectedImage } = selected || {};

  useEffect(() => {
    setSelected(variants[index]);
  }, [index, variants]);

  useEffect(() => {
    if (variants?.length && selectedVariant?.id) {
      variants.forEach((variant, i) => variant.id === selectedVariant.id && setIndex(i));
    }
  }, [selectedVariant, variants]);
  const handlePrevious = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (index >= variants.length - 1) return;
    setIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.indicators}>
        {index + 1} / {variants.length}
      </div>
      <div className={styles.buttons}>
        <button disabled={index <= 0} type="button" onClick={() => handlePrevious()}>
          {arrowLeft2}
        </button>
        <button disabled={index >= variants.length - 1} type="button" onClick={() => handleNext()}>
          {arrowRight2}
        </button>
      </div>
      {selectedImage?.src && (
        <Image
          src={selectedImage?.large}
          alt={selectedImage?.altText || 'selectedImage'}
          width={selectedImage?.width}
          height={selectedImage?.height}
          blurDataURL={selectedImage?.blurDataURL}
          placeholder="blur"
          quality={50}
          priority
        />
      )}
    </div>
  );
};

export default PhotoSlider;
