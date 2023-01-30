import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle, subtitle } = collection || {};

  return (
    <div className={style.CollectionCard} style={{ backgroundImage: `url(${image?.url})` }} alt={image?.alt}>
      <div className={style.content}>
        <h3 className={style.title}>{title} COLLECTION</h3>
        {subtitle && <p className={style.subtitle}>{subtitle}</p>}
        <Link className={style.link} href={`${config.routes.collection}/${handle}`}>
          <span>Shop now</span>
        </Link>
      </div>
    </div>
  );
}
