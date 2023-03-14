import Image from 'next/image';

import styles from './EmptyState.module.scss';

const EmptyState = ({ children, image, title, subtitle, altText }) => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.image}
        alt={altText}
        src={image.src}
        width={image.width}
        height={image.height}
      />
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.subtitle}>{subtitle}</p>
      {children}
    </div>
  );
};

export default EmptyState;
