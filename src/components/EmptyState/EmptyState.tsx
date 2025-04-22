import Image from 'next/image';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';

import styles from './EmptyState.module.scss';

const EmptyState = ({
  children,
  image = NotFoundIllustration,
  title,
  subtitle,
  altText,
}: {
  children?: React.ReactNode;
  image?: {
    src: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle: string;
  altText: string;
}) => (
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

export default EmptyState;
