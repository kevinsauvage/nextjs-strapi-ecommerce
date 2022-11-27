import Image from 'next/legacy/image';
import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle, description } = collection || {};

  return (
    <Link
      href={`${config.routes.collection}/${handle}`}
      className={style.CollectionCard}
    >
      <div className={style.inner}>
        <Image
          src={image?.src}
          alt={image?.alt || title}
          width={700}
          height={500}
          layout="responsive"
          objectFit="cover"
          objectPosition="center"
          quality={70}
          placeholder="blur"
          blurDataURL={image?.blurDataURL}
          loading="lazy"
        />
      </div>
      <div className={style.content}>
        <div className={style.header}>
          <h4 className={style.title}>{title}</h4>
          <p className={style.count}>23 items</p>
        </div>
        <p className={style.description}>{description}</p>
      </div>
    </Link>
  );
}
