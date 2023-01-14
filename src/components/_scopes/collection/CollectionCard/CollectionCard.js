import Image from 'next/image';
import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle } = collection || {};

  return (
    <div className={style.CollectionCard}>
      <div className={style.inner}>
        <Image
          className={style.image}
          src={image?.src}
          alt={image?.alt || title}
          fill
        />
      </div>
      <div className={style.content}>
        <div className={style.innerContent}>
          <h3 className={style.title}>{title}</h3>
          <Link
            href={`${config.routes.collection}/${handle}`}
            className={style.link}
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
}
