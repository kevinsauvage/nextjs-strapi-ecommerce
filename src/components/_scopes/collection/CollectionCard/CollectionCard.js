import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle } = collection || {};

  return (
    <div
      className={style.CollectionCard}
      style={{ backgroundImage: `url(${image?.src})` }}
    >
      <div className={style.content}>
        <h3 className={style.title}>{title}</h3>
        <Link
          href={`${config.routes.collection}/${handle}`}
          className={style.link}
        >
          Shop now
        </Link>
      </div>
    </div>
  );
}
