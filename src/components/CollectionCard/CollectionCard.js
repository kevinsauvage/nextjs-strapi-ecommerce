import Image from 'next/legacy/image';
import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle } = collection || {};

  console.log(collection);
  return (
    <Link
      href={`${config.routes.collection}/${handle}`}
      className={style.CollectionCard}
    >
      <div className={style.inner}>
        <Image
          src={image?.src}
          alt={image?.alt || title}
          width={500}
          height={750}
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
        <h3 className={style.title}>{title}</h3>
        <p className={style.count}>23 items</p>
      </div>
    </Link>
  );
}
