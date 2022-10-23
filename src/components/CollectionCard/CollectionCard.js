import Image from 'next/image';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image } = collection || {};

  return (
    <div className={style.CollectionCard}>
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={500}
        height={750}
        layout="responsive"
        objectFit="cover"
        objectPosition="center"
        priority
        quality={70}
        placeholder="blur"
        blurDataURL={image?.blurDataURL}
      />
      <div className={style.content}>
        <h3 className={style.title}>{title}</h3>
        <p className={style.count}>23 items</p>
      </div>
    </div>
  );
}
