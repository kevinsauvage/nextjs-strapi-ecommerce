import Image from 'next/image';
import Link from 'next/link';
import routes from '@/data/routes';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle } = collection || {};

  return (
    <Link href={`${routes.collection}/${handle}`}>
      <a className={style.CollectionCard}>
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
      </a>
    </Link>
  );
}
